import { Container, Main, Section } from "@/components/ds";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Camera, HeartIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <Main>
            <Section>
                {/* Content */}
                <Container>
                    <Image
                        src="/Renas-and-Ayse.png"
                        alt="Bryllup"
                        width={1000}
                        height={1000}
                        className="rounded-2xl shadow-sm"
                    />
                </Container>

                {/* CTA */}
                <Container>
                    <Card>
                        <CardHeader>
                            <div className="items-center justify-center flex flex-col gap-2 text-center">
                                <CardTitle>
                                    <h2>Del dine minder</h2>
                                </CardTitle>
                                <CardDescription>
                                    <p>
                                        Hjælp os med at fange alle de specielle
                                        øjeblikke fra vores bryllup
                                    </p>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="items-center justify-center flex flex-col gap-2">
                                <Button size="lg" className="w-full" asChild>
                                    <Link href="/upload">
                                        <Camera className="w-4 h-4" />
                                        Upload billeder
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="items-center justify-center">
                            <p>P.s. det er kun os der kan se dine billeder</p>
                        </CardFooter>
                    </Card>
                </Container>
            </Section>
        </Main>
    );
}
