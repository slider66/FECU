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
                    <div className="relative rounded-2xl overflow-hidden shadow-sm">
                        <Image
                            src="/Renas-and-Ayse.png"
                            alt="Bryllup"
                            width={1000}
                            height={1000}
                            className="rounded-2xl"
                            priority
                        />
                        {/* Overlay to the image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/30 to-primary/15 pointer-events-none" />
                    </div>
                </Container>

                {/* CTA */}
                <Container>
                    <Card>
                        <CardHeader>
                            <div className="items-center justify-center flex flex-col gap-2 text-center">
                                <CardTitle>
                                    <h2 className="font-serif text-xl font-semibold">
                                        Del dine minder
                                    </h2>
                                </CardTitle>
                                <CardDescription>
                                    <p className="text-md text-muted-foreground">
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
                            <p className="text-xs text-muted-foreground italic">
                                P.s. det er kun os der kan se dine billeder
                            </p>
                        </CardFooter>
                    </Card>
                </Container>
            </Section>
        </Main>
    );
}
