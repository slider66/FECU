import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/utils/supabase/admin";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { Trash2 } from "lucide-react";

type GalleryPhoto = {
    id: string;
    filename: string;
    path: string;
    createdAt: Date;
    repairNumber: string;
    stage: "ENTRY" | "EXIT";
    bucketPath: string;
    fileSize: number | null;
    mimeType: string | null;
    technician: string | null;
    comments: string | null;
};

async function deletePhoto(formData: FormData) {
    "use server";

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

export async function GalleryComponent() {
    const enableDelete = false;

    const data: GalleryPhoto[] = await prisma.photo.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    if (data.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                        <p className="text-muted-foreground text-lg">
                            Todavia no hay fotos para mostrar.
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Sube la primera evidencia desde la pagina principal.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((photo) => {
                        const stageLabel =
                            photo.stage === "ENTRY" ? "Ingreso" : "Salida";
                        const timestamp = photo.createdAt.toLocaleString();
                        return (
                            <div
                                key={photo.id}
                                className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                {enableDelete && (
                                    <form
                                        action={deletePhoto}
                                        className="absolute top-2 right-2 z-10">
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={photo.id}
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            type="submit">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                )}
                                <Image
                                    src={photo.path}
                                    alt={photo.filename}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-black/60 text-white text-xs leading-tight space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold uppercase tracking-wide">
                                            {stageLabel}
                                        </span>
                                        <span className="text-[10px]">
                                            {timestamp}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate">
                                            #{photo.repairNumber}
                                        </span>
                                        {photo.technician && (
                                            <span className="truncate text-[10px] opacity-80">
                                                {photo.technician}
                                            </span>
                                        )}
                                    </div>
                                    {photo.comments && (
                                        <p className="text-[10px] opacity-80 line-clamp-2">
                                            {photo.comments}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
