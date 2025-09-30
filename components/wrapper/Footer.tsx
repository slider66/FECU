import Link from "next/link";
import { Container } from "../ds";

import { Section } from "../ds";

export default function Footer() {
    return (
        <footer>
            <Section>
                <Container>
                    <div className="flex flex-col gap-2">
                        <p className="text-center font-serif text-muted-foreground text-sm ">
                            Lavet med ♥️ af Gøkmen Øzbayir
                        </p>
                        <div className="flex flex-row gap-2 items-center justify-center">
                            <p className="text-center  text-muted-foreground text-xs">
                                Copyright © {new Date().getFullYear()}{" "}
                            </p>
                            <p className="text-center text-muted-foreground text-xs underline">
                                <Link href="https://www.gokm8.xyz">
                                    www.gokm8.xyz
                                </Link>
                            </p>
                        </div>
                    </div>
                </Container>
            </Section>
        </footer>
    );
}
