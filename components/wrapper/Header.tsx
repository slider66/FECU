import { Container, Section } from "../ds";
import Link from "next/link";

export default function Header() {
    return (
        <header>
            <Section className="">
                <Container>
                    <div className="flex flex-col items-center justify-center gap-2 ">
                        <h1 className="text-5xl font-bold font-serif ">
                            <Link href="/">Renas & Ayse</Link>
                        </h1>
                        <p className="text-md italic text-center text-muted-foreground">
                            07. juni 2025
                        </p>
                    </div>
                </Container>
            </Section>
        </header>
    );
}
