import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { prisma } from "@/lib/prisma";
import { sendMailWithPhotos } from "@/lib/transport_nodemailer";

const STAGES = ["ENTRY", "EXIT"] as const;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const repairNumber = (formData.get("repairNumber") as string)?.trim();
        const stageRaw = (formData.get("stage") as string)
            ?.trim()
            .toUpperCase();
        const technician =
            (formData.get("technician") as string | null)?.trim() || null;
        const comments =
            (formData.get("comments") as string | null)?.trim() || null;
        const images = formData.getAll("images") as File[];

        if (!repairNumber) {
            return NextResponse.json(
                { message: "El numero de reparacion es obligatorio." },
                { status: 400 }
            );
        }

        if (!stageRaw || !STAGES.includes(stageRaw as (typeof STAGES)[number])) {
            return NextResponse.json(
                {
                    message:
                        "La etapa debe ser ENTRY (ingreso) o EXIT (salida).",
                },
                { status: 400 }
            );
        }

        if (images.length === 0) {
            return NextResponse.json(
                { message: "Debes seleccionar al menos una imagen." },
                { status: 400 }
            );
        }

        const stage = stageRaw as (typeof STAGES)[number];

        const uploadPromises = images.map(async (image) => {
            const fileExtension =
                image.name.includes(".") && image.name.split(".").pop()
                    ? image.name.split(".").pop()
                    : "jpeg";
            const fileName = `${repairNumber}-${stage}-${Date.now()}-${crypto.randomUUID()}.${
                fileExtension ?? "jpeg"
            }`;
            const arrayBuffer = await image.arrayBuffer();

            const { data, error } = await supabaseAdmin.storage
                .from("repair-photos")
                .upload(fileName, arrayBuffer, {
                    contentType: image.type,
                    upsert: false,
                });

            if (error) {
                console.error("Upload error:", error);
                throw error;
            }

            const {
                data: { publicUrl },
            } = supabaseAdmin.storage
                .from("repair-photos")
                .getPublicUrl(fileName);

            return prisma.photo.create({
                data: {
                    filename: image.name,
                    path: publicUrl,
                    repairNumber,
                    stage,
                    technician,
                    comments,
                    bucketPath: data.path,
                    fileSize: image.size,
                    mimeType: image.type,
                },
            });
        });

        const uploadedPhotos = await Promise.all(uploadPromises);

        revalidatePath("/gallery");
        revalidatePath("/orden");

        console.log(
            `Uploaded ${uploadedPhotos.length} images for ${repairNumber} (${stage}).`
        );

        try {
            await sendMailWithPhotos(
                repairNumber,
                stage,
                uploadedPhotos.length,
                uploadedPhotos,
                technician,
                comments
            );
        } catch (error) {
            console.error("Error sending email:", error);
        }

        return NextResponse.json(
            {
                message: `Se guardaron ${uploadedPhotos.length} fotos para la orden ${repairNumber} (${stage === "ENTRY" ? "ingreso" : "salida"}).`,
                repairNumber,
                stage,
                technician,
                comments,
                imageCount: uploadedPhotos.length,
                photos: uploadedPhotos,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            {
                message:
                    "Error al subir las imagenes: " +
                    (error instanceof Error ? error.message : "desconocido"),
            },
            { status: 500 }
        );
    }
}
