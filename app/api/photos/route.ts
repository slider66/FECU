import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { prisma } from "@/lib/prisma";

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

        console.log(
            "Success! Uploaded",
            uploadedPhotos.length,
            "images by",
            name
        );

        return NextResponse.json(
            {
                message: "Billede(rne) blev uploadet", // Message to the user
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

export async function GET(req: NextRequest) {
    try {
        // Get all images from database
        const photos = await prisma.photo.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            {
                message: "Images fetched",
                count: photos.length,
                photos,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Error fetching images" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const photoId = searchParams.get("id");

        if (!photoId) {
            return NextResponse.json(
                { message: "Image ID missing" },
                { status: 400 }
            );
        }

        // Find the image
        const photo = await prisma.photo.findUnique({
            where: { id: photoId },
        });

        if (!photo) {
            return NextResponse.json(
                { message: "Image not found" },
                { status: 404 }
            );
        }

        // Delete from Storage
        await supabaseAdmin.storage
            .from("wedding-photos")
            .remove([photo.bucketPath]);

        // Delete from database
        await prisma.photo.delete({
            where: { id: photoId },
        });

        return NextResponse.json({ message: "Image deleted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Error deleting image" },
            { status: 500 }
        );
    }
}
