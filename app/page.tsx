import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container, Main, Section } from "@/components/ds";
import { Images, Plus } from "lucide-react";

export default function Home() {
    return (
        <Main>
            <Section>
                <Container className="max-w-3xl space-y-8 py-12">
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/bautizo-iago-29112025.png"
                            alt="Bautizo de Iago - 29 de Noviembre de 2025"
                            width={600}
                            height={300}
                            priority
                            className="h-auto w-full max-w-lg object-contain"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="hover:shadow-lg transition-shadow border-primary/20">
                            <CardHeader className="text-center">
                                <CardTitle className="font-[family-name:var(--font-handwriting)] text-4xl">
                                    Subir Fotos
                                </CardTitle>
                                <CardDescription>
                                    Comparte tus recuerdos de este día especial con nosotros.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/upload?repairNumber=BAUTIZO-IAGO-2025&stage=ENTRY">
                                    <Button className="w-full h-12 text-lg" size="lg">
                                        <Plus className="h-5 w-5 mr-2" />
                                        Subir Recuerdos
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow border-primary/20">
                            <CardHeader className="text-center">
                                <CardTitle className="font-[family-name:var(--font-handwriting)] text-4xl">
                                    Ver Álbum
                                </CardTitle>
                                <CardDescription>
                                    Revive los momentos capturados por todos los invitados.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/orden?repairNumber=BAUTIZO-IAGO-2025">
                                    <Button variant="outline" className="w-full h-12 text-lg" size="lg">
                                        <Images className="h-5 w-5 mr-2" />
                                        Ver Galería
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center text-muted-foreground">
                        <p className="font-[family-name:var(--font-handwriting)] text-2xl">
                            Gracias por acompañarnos en este día tan importante.
                        </p>
                    </div>
                </Container>
            </Section>
        </Main>
    );
}


