import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container, Main, Section } from "@/components/ds";
import { Camera, FolderSearch, Images, Plus } from "lucide-react";

export default function Home() {
    return (
        <Main>
            <Section>
                <Container className="max-w-3xl space-y-6">
                    <Card>
                        <CardHeader className="text-center space-y-2">
                            <CardTitle className="text-2xl font-serif">
                                Registro visual de reparaciones
                            </CardTitle>
                            <CardDescription>
                                Documenta el estado de cada equipo al ingresar y
                                al egresar del taller. Captura las fotos con la
                                camara del celular o carga imagenes desde la
                                galeria.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                action="/upload"
                                method="GET"
                                className="space-y-4">
                                <div className="space-y-2">
                                    <Label
                                        className="text-sm font-medium"
                                        htmlFor="repairNumber">
                                        Numero de reparacion
                                    </Label>
                                    <Input
                                        id="repairNumber"
                                        name="repairNumber"
                                        required
                                        placeholder="Ej. 2458-2025"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        formAction="/upload?stage=ENTRY">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Registrar ingreso
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        variant="outline"
                                        formAction="/upload?stage=EXIT">
                                        <Camera className="h-4 w-4 mr-2" />
                                        Registrar salida
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <p className="text-sm text-muted-foreground text-center">
                                Cada carga se guarda automaticamente en la nube
                                con el numero de reparacion.
                            </p>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="font-serif text-xl">
                                Consultar historial
                            </CardTitle>
                            <CardDescription>
                                Busca una orden para ver las fotos de ingreso y
                                salida.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                action="/orden"
                                method="GET"
                                className="space-y-3">
                                <div className="space-y-2">
                                    <Label
                                        className="text-sm font-medium"
                                        htmlFor="lookup-number">
                                        Numero de reparacion
                                    </Label>
                                    <Input
                                        id="lookup-number"
                                        name="repairNumber"
                                        required
                                        placeholder="Ej. 2458-2025"
                                        autoComplete="off"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <FolderSearch className="h-4 w-4 mr-2" />
                                    Ver registro
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 justify-center">
                                <Images className="h-4 w-4" />
                                <Link
                                    className="underline underline-offset-2"
                                    href="/gallery">
                                    Ver galeria completa
                                </Link>
                            </div>
                            <p className="text-center">
                                Comparte el enlace de una orden para que el
                                cliente vea el estado de su equipo en cualquier
                                momento.
                            </p>
                        </CardFooter>
                    </Card>
                </Container>
            </Section>
        </Main>
    );
}
