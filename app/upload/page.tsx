import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Container, Section } from "@/components/ds";
import { RepairUploadForm } from "./_components/RepairUploadForm";

export const metadata: Metadata = {
    title: "Registrar fotos de reparacion",
    description:
        "Captura el estado de ingreso o salida de un equipo por numero de reparacion.",
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
        : "";
    const rawStage = Array.isArray(params.stage) ? params.stage[0] : params.stage;
    const stageParam = rawStage?.toUpperCase();
    const stage = stageParam === "EXIT" ? "EXIT" : "ENTRY";

    return (
        <Section>
            <Container>
                <div className="flex flex-col gap-2 items-center justify-center text-center">
                    <h2 className="font-serif text-xl font-semibold">
                        Registro fotografico
                    </h2>
                    <p className="text-md text-muted-foreground">
                        Guarda evidencia visual del equipo cuando ingresa o
                        cuando egresa del servicio tecnico.
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
                <div className="flex flex-row gap-2 items-center justify-center">
                    <Link
                        className="flex flex-row gap-2 items-center text-muted-foreground hover:text-primary"
                        href="/">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>
            </Container>
        </Section>
    );
}
