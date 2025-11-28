import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { GalleryPhoto } from "@/components/gallery/gallery-types";

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
                <GalleryGrid photos={data} enableDelete={enableDelete} />
            </CardContent>
        </Card>
    );
}
