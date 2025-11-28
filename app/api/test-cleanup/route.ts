import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function GET() {
    try {
        const repairNumber = "LOAD-TEST";

        // Find photos
        const photos = await prisma.photo.findMany({
            where: { repairNumber },
        });

        if (photos.length === 0) {
            return NextResponse.json({ message: "No photos to clean up" });
        }

        // Delete from storage
        const paths = photos.map(p => p.bucketPath);
        const { error } = await supabaseAdmin.storage
            .from("repair-photos")
            .remove(paths);

        if (error) {
            console.error("Storage delete error:", error);
        }

        // Delete from DB
        const { count } = await prisma.photo.deleteMany({
            where: { repairNumber },
        });

        return NextResponse.json({
            message: "Cleanup successful",
            deletedCount: count,
            storageError: error ? error.message : null
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
