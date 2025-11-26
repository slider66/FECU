import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { Container, Section } from "@/components/ds";
import { RepairUploadForm } from "./_components/RepairUploadForm";

export const metadata: Metadata = {
    title: "Subir fotos del Bautizo",
    description:
        "Comparte tus fotos del Bautizo de Iago.",
};

type UploadPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UploadPage({ searchParams }: UploadPageProps) {
    const params = await searchParams;
    const rawRepairNumber = Array.isArray(params.repairNumber)
        ? params.repairNumber[0]
        : params.repairNumber;
    const repairNumber = rawRepairNumber
        ? decodeURIComponent(rawRepairNumber)
        : "BAUTIZO-IAGO-2025";
    const rawStage = Array.isArray(params.stage) ? params.stage[0] : params.stage;
    const stageParam = rawStage?.toUpperCase();
    const stage = stageParam === "EXIT" ? "EXIT" : "ENTRY";

    return (
        <Section>
            <Container>
                <div className="flex flex-col gap-2 items-center justify-center text-center">
                    <h2 className="font-[family-name:var(--font-handwriting)] text-4xl font-semibold text-primary">
                        Sube tus recuerdos
                    </h2>
                    <p className="text-md text-muted-foreground font-serif italic">
                        Comparte las fotos que tomaste durante el bautizo.
                    </p>
                </div>
            </Container>

            <Container>
                <RepairUploadForm
                    initialRepairNumber={repairNumber}
                    initialStage={stage}
                />
            </Container>

            <Container>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Link
                        className="flex flex-row gap-2 items-center text-muted-foreground hover:text-primary"
                        href="/">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                    <Link
                        className="flex flex-row gap-2 items-center text-muted-foreground hover:text-primary"
                        href={`/orden?repairNumber=${encodeURIComponent(repairNumber)}`}>
                        <ImageIcon className="w-4 h-4" />
                        Ver Álbum
                    </Link>
                </div>
            </Container>
        </Section>
    );
}
