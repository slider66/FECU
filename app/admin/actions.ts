"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deletePhoto(formData: FormData) {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");

    if (!adminSession) {
        throw new Error("Unauthorized");
    }

    const id = formData.get("id") as string;
    const bucketPath = formData.get("bucketPath") as string;

    if (!id || !bucketPath) return;

    try {
        // 1. Delete from Supabase Storage
        const { error } = await supabaseAdmin.storage
            .from("repair-photos")
            .remove([bucketPath]);

        if (error) {
            console.error("Error deleting from storage:", error);
            // Continue to delete from DB even if storage fails (orphan cleanup)
        }

        // 2. Delete from Database
        await prisma.photo.delete({
            where: { id },
        });

        // 3. Revalidate paths
        revalidatePath("/gallery");
        revalidatePath("/orden");
        revalidatePath("/admin");

    } catch (error) {
        console.error("Error deleting photo:", error);
    }
}
