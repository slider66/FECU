import { Suspense } from "react";
import { Metadata } from "next";
import { Container, Section } from "@/components/ds";
import { GalleryComponent } from "./_components/GalleryComponent";
import GalleryLoading from "./loading";

export const metadata: Metadata = {
    title: "Galería del Bautizo",
    description:
        "Visualiza todas las fotos del Bautizo de Iago.",
};

import { GalleryNavigation } from "@/components/gallery/gallery-navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Upload } from "lucide-react";

export default function GalleryPage() {
    return (
        <Section>
            <Container className="max-w-5xl">
                <GalleryNavigation />
            </Container>
            <Container className="text-center space-y-2">
                <h2 className="font-serif text-xl font-semibold">
                    Galería de Recuerdos
                </h2>
                <p className="text-md text-muted-foreground">
                    Un repaso rápido de los momentos capturados por familiares y amigos.
                </p>
            </Container>
            <Suspense fallback={<GalleryLoading />}>
                <Container className="max-w-5xl space-y-8">
                    <GalleryComponent />

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button asChild variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Volver al Inicio
                            </Link>
                        </Button>
                        <Button asChild variant="default" size="lg" className="rounded-full w-full sm:w-auto">
                            <Link href="/upload">
                                <Upload className="h-4 w-4 mr-2" />
                                Subir más fotos
                            </Link>
                        </Button>
                    </div>
                </Container>
            </Suspense>
        </Section>
    );
}
