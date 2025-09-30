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
                    <h2 className="font-serif text-xl font-semibold">
                        Upload dine billeder
                    </h2>
                    <p className="text-md text-muted-foreground">
                        Del dine yndlings øjeblikke fra vores bryllup
                    </p>
                </div>
            </Container>

            <WeddingUploaderComponent />
            <Container>
                <div className="flex flex-row gap-2 items-center justify-center">
                    <ArrowLeftIcon className="w-4 h-4" />
                    <p>
                        <Link
                            className=" text-muted-foreground hover:text-primary"
                            href="/">
                            Tilbage
                        </Link>
                    </p>
                </div>
            </Container>
        </Section>
    );
}
