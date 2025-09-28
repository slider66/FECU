import { HeartIcon } from "lucide-react";

import { Container, Section } from "../ds";

export default function Header() {
    return (
        <header>
            <Section>
                <Container>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <HeartIcon className="w-10 h-10" />
                        <h1>Renas & Ayse</h1>
                        <HeartIcon className="w-10 h-10" />
                    </div>
                    <p className="text-center">07. juni 2025</p>
                </Container>
            </Section>
        </header>
    );
}
