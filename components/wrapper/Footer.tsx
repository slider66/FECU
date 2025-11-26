import Link from "next/link";
import { Container, Section } from "../ds";

export default function Footer() {
    return (
        <footer className="mt-auto">
            <Section>
                <Container>
                    <div className="flex flex-col gap-2 items-center text-center">
                        <p className="font-serif text-muted-foreground text-sm">
                            Bautizo de Iago &mdash; Recuerdos de un día especial.
                        </p>
                        <p className="text-muted-foreground text-xs">
                            &copy; {new Date().getFullYear()} Familia de Iago
                        </p>
                        <p className="text-muted-foreground text-xs">
                            <Link
                                href="/gallery"
                                className="underline underline-offset-2">
                                Ver álbum completo
                            </Link>
                        </p>
                    </div>
                </Container>
            </Section>
        </footer>
    );
}
