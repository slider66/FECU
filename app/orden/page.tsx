import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ds";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const metadata: Metadata = {
    title: "Álbum del Bautizo",
    description:
        "Revisa las fotos del Bautizo de Iago.",
};

type OrderPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderPage({ searchParams }: OrderPageProps) {
    const params = await searchParams;
    const rawRepairNumber = Array.isArray(params.repairNumber)
        ? params.repairNumber[0]
        : params.repairNumber;
    const repairNumber = rawRepairNumber
        ? decodeURIComponent(rawRepairNumber)
        : "BAUTIZO-IAGO-2025"; // Default to event code if missing

    const photos = repairNumber
        ? await prisma.photo.findMany({
            where: { repairNumber },
            orderBy: [
                { stage: "asc" },
                { createdAt: "asc" },
            ],
        })
        : [];

    type OrderPhoto = Awaited<typeof photos>[number];

    const entryPhotos = photos.filter(
        (photo: OrderPhoto) => photo.stage === "ENTRY"
    );
    // In this context, we might just want to show all photos together or separate by some logic?
    // For now, keeping the separation but maybe renaming titles?
    // "Fotos del Evento" vs "Otros"?
    // Actually, the upload form defaults to ENTRY stage.
    // So most photos will be in ENTRY.

    // Let's just show all photos in one gallery if possible, or keep the structure but rename.
    // Since the upload form hides the stage, it defaults to ENTRY (or whatever the form defaults to).
    // Let's check the upload form default.

    return (
        <Section>
            <Container className="space-y-6 max-w-4xl">
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="text-4xl font-[family-name:var(--font-handwriting)] text-primary">
                            Álbum de Recuerdos
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Los momentos especiales del Bautizo de Iago.
                        </CardDescription>
                    </CardHeader>
                    {/* Form removed */}
                </Card>

                {photos.length > 0 ? (
                    <div className="space-y-8">
                        {/* We can combine them or show just one gallery if all are ENTRY */}
                        {entryPhotos.length > 0 && (
                            <StageGallery
                                title="Galería de Fotos"
                                description="Fotos compartidas por los invitados."
                                photos={entryPhotos}
                                emptyMessage=""
                            />
                        )}
                        {/* If there are EXIT photos (unlikely for this event but possible if logic changes), show them */}
                        {photos.filter(p => p.stage === "EXIT").length > 0 && (
                            <StageGallery
                                title="Otros Momentos"
                                description=""
                                photos={photos.filter(p => p.stage === "EXIT")}
                                emptyMessage=""
                            />
                        )}

                        <div className="flex items-center justify-center pt-4">
                            <Button asChild variant="default" size="lg" className="rounded-full">
                                <Link
                                    href={`/upload?repairNumber=${encodeURIComponent(
                                        repairNumber
                                    )}`}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Subir más fotos
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Card className="bg-white/50 backdrop-blur-sm">
                        <CardHeader className="text-center space-y-4 py-12">
                            <div className="flex justify-center">
                                <Image
                                    src="/placeholder.svg" // We don't have a specific image, maybe use an icon
                                    width={200}
                                    height={200}
                                    alt="No photos"
                                    className="opacity-20 hidden" // Hiding placeholder for now
                                />
                                <Upload className="h-16 w-16 text-muted-foreground/30" />
                            </div>
                            <CardTitle className="font-[family-name:var(--font-handwriting)] text-3xl text-muted-foreground">
                                Aún no hay fotos
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Sé el primero en compartir un recuerdo de este día especial.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center pb-12">
                            <Button asChild size="lg" className="rounded-full">
                                <Link
                                    href={`/upload?repairNumber=${encodeURIComponent(
                                        repairNumber
                                    )}`}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Subir fotos ahora
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Section>
    );
}

type StageGalleryProps = {
    title: string;
    description: string;
    photos: Awaited<ReturnType<typeof prisma.photo.findMany>>;
    emptyMessage: string;
};

type StageGalleryPhoto = StageGalleryProps["photos"][number];

function StageGallery({
    title,
    description,
    photos,
    emptyMessage,
}: StageGalleryProps) {
    if (!photos.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {emptyMessage}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-serif text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo: StageGalleryPhoto) => (
                        <div key={photo.id} className="space-y-2">
                            <figure className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                                <Image
                                    src={photo.path}
                                    alt={photo.filename}
                                    fill
                                    sizes="(min-width: 1024px) 320px, 100vw"
                                    className="object-cover"
                                />
                                <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 flex justify-between">
                                    <span className="truncate">
                                        {photo.filename}
                                    </span>
                                    <time dateTime={photo.createdAt.toISOString()}>
                                        {photo.createdAt.toLocaleDateString()}
                                    </time>
                                </figcaption>
                            </figure>
                            {photo.comments && (
                                <p className="text-xs text-muted-foreground line-clamp-3">
                                    {photo.comments}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
