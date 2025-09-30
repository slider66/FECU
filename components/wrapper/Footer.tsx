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
                        <p className="text-center  text-muted-foreground text-xs">
                            Copyright © {new Date().getFullYear()} www.gokm8.xyz
                        </p>
                    </div>
                </Container>
            </Section>
        </footer>
    );
}
