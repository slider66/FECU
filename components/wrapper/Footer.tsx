import Link from "next/link";
import { Container, Section } from "../ds";

export default function Footer() {
    return (
        <footer className="mt-auto">
            <Section>
                <Container>
                    <div className="flex flex-col gap-2 items-center text-center">
                        <p className="font-serif text-muted-foreground text-sm">
                            Control de Reparaciones &mdash; evidencia visual para tu taller.
                        </p>
                        <p className="text-muted-foreground text-xs">
                            &copy; {new Date().getFullYear()} Equipo de servicio tecnico
                        </p>
                        <p className="text-muted-foreground text-xs">
                            <Link
                                href="/gallery"
                                className="underline underline-offset-2">
                                Ver galeria general
                            </Link>
                        </p>
                    </div>
                </Container>
            </Section>
        </footer>
    );
}
