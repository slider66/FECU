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

export default function GalleryPage() {
    return (
        <Section>
            <Container className="text-center space-y-2">
                <h2 className="font-serif text-xl font-semibold">
                    Galería de Recuerdos
                </h2>
                <p className="text-md text-muted-foreground">
                    Un repaso rápido de los momentos capturados por familiares y amigos.
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
