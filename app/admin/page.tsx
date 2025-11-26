import { Suspense } from "react";
import { Container, Section } from "@/components/ds";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Download } from "lucide-react";
import Image from "next/image";
import { logout } from "../login/actions";
import { deletePhoto } from "./actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function AdminGallery() {
    const photos = await prisma.photo.findMany({
        orderBy: { createdAt: "desc" },
    });

    if (photos.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No hay fotos subidas aún.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                    <CardContent className="p-0 aspect-square relative">
                        <Image
                            src={photo.path}
                            alt={`Foto ${photo.repairNumber}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </CardContent>
                    <CardFooter className="p-2 flex justify-between items-center bg-muted/50">
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {photo.repairNumber}
                        </div>
                        <form action={deletePhoto}>
                            <input type="hidden" name="id" value={photo.id} />
                            <input type="hidden" name="bucketPath" value={photo.bucketPath} />
                            <Button
                                type="submit"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                title="Eliminar foto"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default function AdminPage() {
    return (
        <Section>
            <Container className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-serif font-bold">Panel de Administración</h1>
                    <div className="flex gap-2">
                        <Button asChild variant="default">
                            <a href="/api/download-all" download>
                                <Download className="h-4 w-4 mr-2" />
                                Descargar Todo
                            </a>
                        </Button>
                        <form action={async () => {
                            "use server";
                            await logout();
                            redirect("/login");
                        }}>
                            <Button variant="outline">Cerrar Sesión</Button>
                        </form>
                    </div>
                </div>
                <p className="text-muted-foreground">
                    Gestiona las fotos del evento. Las fotos eliminadas aquí desaparecerán de la galería pública.
                </p>
                <Suspense fallback={<div>Cargando fotos...</div>}>
                    <AdminGallery />
                </Suspense>
            </Container>
        </Section>
    );
}
