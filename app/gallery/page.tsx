import { Metadata } from "next";
import { Container, Section } from "@/components/ds";
import { GalleryComponent } from "./_components/GalleryComponent";
import { Suspense } from "react";
import GalleryLoading from "./loading";

export const metadata: Metadata = {
    title: "Galleri | Renas & Ayse's Bryllup",
    description: "Galleri af billeder fra vores bryllup",
};

export default function GalleryPage() {
    return (
        <Section>
            <Container>
                <div className="flex flex-col gap-2 items-center justify-center">
                    <h2 className="font-serif text-xl font-semibold">
                        Bryllupsgalleri
                    </h2>
                    <p className="text-md text-muted-foreground">
                        Minder fra vores særlige dag
                    </p>
                </div>
            </Container>
            <Suspense fallback={<GalleryLoading />}>
                <Container className="max-w-3xl">
                    <GalleryComponent />
                </Container>
            </Suspense>
        </Section>
    );
}
