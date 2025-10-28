import { Container, Section } from "../ds";
import Link from "next/link";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Header() {
    return (
        <header>
            <Section className="">
                <Container>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h1
                            className={`${roboto.className} text-center text-5xl font-bold`}>
                            <Link href="/">Control de Reparaciones</Link>
                        </h1>
                        <p className="text-md italic text-center text-muted-foreground">
                            Registro fotografico de ingreso y salida de equipos
                        </p>
                    </div>
                </Container>
            </Section>
        </header>
    );
}
