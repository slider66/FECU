import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/utils/supabase/admin";

async function deletePhoto(formData: FormData) {
    "use server";

    const photoId = formData.get("id") as string;

    // Find photo
    const photo = await prisma.photo.findUnique({
        where: { id: photoId },
    });

    if (!photo) return;

    // Delete from Storage
    await supabaseAdmin.storage
        .from("wedding-photos")
        .remove([photo.bucketPath]);

    // Delete from database
    await prisma.photo.delete({
        where: { id: photoId },
    });

    revalidatePath("/gallery"); // Revalidate path when deleting a photo
}

export async function GalleryComponent() {
    const data = await prisma.photo.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <Card>
            <CardContent>
                {data.length === 0 ? (
                    //  if no data, show this:
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                        <p className="text-muted-foreground text-lg">
                            Der er ingen billeder at vise
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Upload det første billede for at komme i gang
                        </p>
                    </div>
                ) : (
                    //  if data, show this:
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.map((photo) => (
                            <div
                                key={photo.id}
                                className="relative aspect-square rounded-lg overflow-hidden ">
                                <form
                                    action={deletePhoto}
                                    className="absolute top-2 right-2 z-10">
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={photo.id}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        type="submit">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </form>
                                <Image
                                    key={photo.id}
                                    src={photo.path}
                                    alt={photo.filename}
                                    className="object-cover"
                                    fill
                                />
                                <div className="absolute bottom-2 left-2 right-2 px-3 py-1 bg-accent/70 text-accent-foreground text-sm rounded-lg font-mono">
                                    <span className="block break-words line-clamp-2 font-bold">
                                        Uploadet af {photo.uploadedBy}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
