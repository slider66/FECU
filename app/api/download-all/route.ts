import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";

/**
 * API endpoint to download all photos as a ZIP file.
 * Only accessible by authenticated admin users.
 */
export async function GET(req: NextRequest) {
    try {
        // SECURITY: Verify admin authentication
        const adminSession = req.cookies.get("admin_session");
        if (!adminSession || adminSession.value !== "true") {
            return NextResponse.json(
                { message: "No autorizado. Debes iniciar sesión como administrador." },
                { status: 401 }
            );
        }

        // Fetch all photos from the database
        const photos = await prisma.photo.findMany({
            orderBy: { createdAt: "desc" },
        });

        if (photos.length === 0) {
            return NextResponse.json(
                { message: "No hay fotos para descargar." },
                { status: 404 }
            );
        }

        // Create a new ZIP file
        const zip = new JSZip();

        // Download each photo and add it to the ZIP
        const downloadPromises = photos.map(async (photo, index) => {
            try {
                const response = await fetch(photo.path);
                if (!response.ok) {
                    console.error(`Failed to download ${photo.filename}`);
                    return;
                }

                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // Use the original filename or create a unique one
                const filename = photo.filename || `foto-${index + 1}.jpg`;
                zip.file(filename, buffer);
            } catch (error) {
                console.error(`Error downloading ${photo.filename}:`, error);
            }
        });

        await Promise.all(downloadPromises);

        // Generate the ZIP file
        const zipBuffer = await zip.generateAsync({
            type: "nodebuffer",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
        });

        // Return the ZIP file as a download
        return new NextResponse(new Uint8Array(zipBuffer), {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="fotos-bautizo-iago-${new Date().toISOString().split("T")[0]}.zip"`,
                "Content-Length": zipBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("Error generating ZIP:", error);
        return NextResponse.json(
            {
                message:
                    "Error al generar el archivo ZIP: " +
                    (error instanceof Error ? error.message : "desconocido"),
            },
            { status: 500 }
        );
    }
}
