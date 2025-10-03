import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { prisma } from "@/lib/prisma";
import { sendMailWithPhotos } from "@/lib/transport_nodemailer";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        // Get the form data from the request
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const images = formData.getAll("images") as File[];

        // Upload each image to Supabase Storage in parallel
        const uploadPromises = images.map(async (image) => {
            // 1. Make a unique filename
            const fileExtension = image.name.split(".").pop(); // Get the file extension (.jpeg, .jpg etc.)
            const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`; // Create a unique filename

            // 2. Convert File to ArrayBuffer to be able to upload it to Supabase Storage
            const arrayBuffer = await image.arrayBuffer();

            // 3. Upload to Supabase Storage
            const { data, error } = await supabaseAdmin.storage
                .from("wedding-photos")
                .upload(fileName, arrayBuffer, {
                    contentType: image.type,
                    upsert: false,
                });

            if (error) {
                console.error("Upload error:", error);
                throw error;
            }

            // 4. Get public URL for the image
            const {
                data: { publicUrl },
            } = supabaseAdmin.storage
                .from("wedding-photos")
                .getPublicUrl(fileName);

            // 5. Save metadata to database
            const photo = await prisma.photo.create({
                data: {
                    filename: image.name, // Original filename
                    path: publicUrl, // Public URL for the image
                    uploadedBy: name, // Name of the uploader
                    bucketPath: data.path, // Storage path for the image
                    fileSize: image.size, // File size in bytes
                    mimeType: image.type, // MIME type of the image
                },
            });

            return photo;
        });

        // Wait for all uploads to finish
        const uploadedPhotos = await Promise.all(uploadPromises);

        // Revalidate gallery page to show new photos immediately
        revalidatePath("/gallery");

        console.log(
            "Success! Uploaded",
            uploadedPhotos.length,
            "images by",
            name
        );

        try {
            await sendMailWithPhotos(
                name,
                uploadedPhotos.length,
                uploadedPhotos
            );
            console.log("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
        }

        // Return the response
        return NextResponse.json(
            {
                message:
                    "Mange tak for dine billeder! Vi glæder os til at se dem ♥️", // Message to the user
                name: name, // Name of the uploader
                imageCount: uploadedPhotos.length, // Number of images uploaded
                photos: uploadedPhotos, // The uploaded photos
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            {
                message:
                    "Upload fejl: " +
                    (error instanceof Error ? error.message : "Ukendt fejl"),
            },
            { status: 500 }
        );
    }
}
