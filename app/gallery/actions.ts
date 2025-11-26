"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deletePhoto(formData: FormData) {
    const photoId = formData.get("id") as string;

    const photo = await prisma.photo.findUnique({
        where: { id: photoId },
    });

    if (!photo) return;

    await supabaseAdmin.storage
        .from("repair-photos")
        .remove([photo.bucketPath]);

    await prisma.photo.delete({
        where: { id: photoId },
    });

    revalidatePath("/gallery");
    revalidatePath("/orden");
}
