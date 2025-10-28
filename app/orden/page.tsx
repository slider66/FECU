import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Section, Container } from "@/components/ds";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock, Download, Upload } from "lucide-react";

export const metadata: Metadata = {
    title: "Consultar orden de reparacion",
    description:
        "Busca una orden y revisa las fotos de ingreso y salida del equipo.",
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
        : "";

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
    const exitPhotos = photos.filter(
        (photo: OrderPhoto) => photo.stage === "EXIT"
    );

    return (
        <Section>
            <Container className="space-y-6 max-w-4xl">
                <Card>
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="text-2xl font-serif">
                            Consulta de orden
                        </CardTitle>
                        <CardDescription>
                            Ingresa el numero de reparacion para visualizar las
                            fotos cargadas durante el proceso.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            action="/orden"
                            method="GET"
                            className="flex flex-col gap-3 md:flex-row md:items-end">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="repair-number">
                                    Numero de reparacion
                                </Label>
                                <Input
                                    id="repair-number"
                                    name="repairNumber"
                                    placeholder="Ej. 2458-2025"
                                    required
                                    defaultValue={repairNumber}
                                    autoComplete="off"
                                />
                            </div>
                            <Button type="submit" className="md:w-auto w-full">
                                Buscar orden
                            </Button>
                        </form>
                    </CardContent>
                    {repairNumber && (
                        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 justify-center">
                                <CalendarClock className="h-4 w-4" />
                                <span>
                                    Mostrando informacion para la orden{" "}
                                    <strong>{repairNumber}</strong>
                                </span>
                            </div>
                            <p className="text-center">
                                Comparte esta pagina para que el cliente pueda
                                revisar el estado visual del equipo.
                            </p>
                        </CardFooter>
                    )}
                </Card>

                {repairNumber ? (
                    photos.length > 0 ? (
                        <div className="space-y-6">
                            <StageGallery
                                title="Ingreso"
                                description="Evidencia tomada al recibir el equipo."
                                photos={entryPhotos}
                                emptyMessage="Todavia no hay fotos del ingreso."
                            />
                            <StageGallery
                                title="Salida"
                                description="Evidencia tomada antes de entregar el equipo."
                                photos={exitPhotos}
                                emptyMessage="Todavia no hay fotos de la salida."
                            />
                            <div className="flex items-center justify-center">
                                <Button asChild variant="outline">
                                    <Link
                                        href={`/upload?repairNumber=${encodeURIComponent(
                                            repairNumber
                                        )}`}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Agregar mas fotos
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <CardHeader className="text-center space-y-2">
                                <CardTitle className="font-serif text-xl">
                                    No encontramos registros
                                </CardTitle>
                                <CardDescription>
                                    Aun no hay fotos cargadas para la orden{" "}
                                    <strong>{repairNumber}</strong>. Sube la
                                    primera evidencia para comenzar el historial.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <Button asChild>
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
                    )
                ) : (
                    <Card>
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="font-serif text-xl">
                                Esperando una orden
                            </CardTitle>
                            <CardDescription>
                                Introduce un numero de reparacion para mostrar
                                el historial de fotos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center text-muted-foreground gap-2">
                            <Download className="h-4 w-4" />
                            <span>
                                Cuando completes el formulario se mostrara aqui
                                el resultado.
                            </span>
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
