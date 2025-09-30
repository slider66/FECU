import { Container, Section } from "@/components/ds";
import { WeddingUploaderComponent } from "./_components/WeddingUploaderComponent";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Upload billeder | Renas & Ayse's Bryllup",
    description: "Upload dine billeder til vores bryllup",
};

export default function UploadPage() {
    return (
        <Section>
            <Container>
                <div className="flex flex-col gap-2 items-center justify-center">
                    <h2>Upload dine billeder</h2>
                    <p>Del dine yndlings øjeblikke fra vores bryllup</p>
                </div>
            </Container>
            <WeddingUploaderComponent />
            <div className="flex flex-row gap-2 items-center justify-center mt-2">
                <ArrowLeftIcon className="w-4 h-4" />
                <p>
                    <Link href="/">Tilbage</Link>
                </p>
            </div>
        </Section>
    );
}
