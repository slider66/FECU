import { Suspense } from "react";
import { Metadata } from "next";
import { Container, Section } from "@/components/ds";
import { GalleryComponent } from "./_components/GalleryComponent";
import GalleryLoading from "./loading";

export const metadata: Metadata = {
    title: "Galeria de ordenes",
    description:
        "Visualiza todas las fotos subidas para las reparaciones recientes.",
};

export default function GalleryPage() {
    return (
        <Section>
            <Container className="text-center space-y-2">
                <h2 className="font-serif text-xl font-semibold">
                    Galeria general
                </h2>
                <p className="text-md text-muted-foreground">
                    Un repaso rapido de las ultimas evidencias cargadas por el
                    equipo tecnico.
                </p>
            </Container>
            <Suspense fallback={<GalleryLoading />}>
                <Container className="max-w-5xl">
                    <GalleryComponent />
                </Container>
            </Suspense>
        </Section>
    );
}
