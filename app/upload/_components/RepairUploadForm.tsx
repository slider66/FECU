"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { compressImage } from "./image-compression";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 1024 * 1024 * 8; // 8MB
const MAX_FILES = 12;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
];

const stageOptions = [
    { value: "ENTRY", label: "Ingreso" },
    { value: "EXIT", label: "Salida" },
] as const;

const FormSchema = z.object({
    repairNumber: z
        .string()
        .trim()
        .min(3, { message: "Ingresa al menos 3 caracteres." })
        .max(32, { message: "El numero es demasiado largo." })
        .regex(/^[a-zA-Z0-9-_.]+$/, {
            message: "Solo letras, numeros, guiones y puntos.",
        }),
    stage: z.enum(["ENTRY", "EXIT"], "Selecciona ingreso o salida."),
    technician: z
        .string()
        .trim()
        .max(48, { message: "El nombre es demasiado largo." })
        .optional()
        .or(z.literal("")),
    comments: z
        .string()
        .trim()
        .max(400, { message: "El comentario es demasiado largo." })
        .optional()
        .or(z.literal("")),
    images: z
        .array(z.instanceof(File))
        .min(1, { message: "Debes elegir al menos una foto." })
        .max(MAX_FILES, {
            message: `Puedes subir hasta ${MAX_FILES} fotos a la vez.`,
        })
        .refine(
            (images) =>
                images.every((image) =>
                    ACCEPTED_IMAGE_MIME_TYPES.includes(image.type)
                ),
            {
                message:
                    "Formato invalido. Usa jpeg, jpg, png, webp, heic o heif.",
            }
        )
        .refine(
            (images) => images.every((image) => image.size <= MAX_FILE_SIZE),
            {
                message: "Cada archivo debe pesar menos de 8MB.",
            }
        ),
});

type FormValues = z.infer<typeof FormSchema>;

interface RepairUploadFormProps {
    initialRepairNumber?: string;
    initialStage?: (typeof stageOptions)[number]["value"];
}

export function RepairUploadForm({
    initialRepairNumber = "",
    initialStage = "ENTRY",
}: RepairUploadFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            repairNumber: initialRepairNumber,
            stage: stageOptions.some((option) => option.value === initialStage)
                ? initialStage
                : "ENTRY",
            technician: "",
            comments: "",
            images: [],
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    // Prevent accidental navigation during upload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isLoading) {
                e.preventDefault();
                e.returnValue = ""; // Chrome requires returnValue to be set
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isLoading]);

    // Request Wake Lock to prevent screen sleep
    useEffect(() => {
        let wakeLock: WakeLockSentinel | null = null;

        const requestWakeLock = async () => {
            if (isLoading && "wakeLock" in navigator) {
                try {
                    wakeLock = await navigator.wakeLock.request("screen");
                } catch (err) {
                    console.error("Wake Lock error:", err);
                }
            }
        };

        if (isLoading) {
            requestWakeLock();
        }

        return () => {
            if (wakeLock) {
                wakeLock.release().catch(() => { });
            }
        };
    }, [isLoading]);

    const images = useWatch({
        control: form.control,
        name: "images",
    });

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true);
            setUploadProgress(0);
            setStatusMessage("Preparando fotos...");

            const formData = new FormData();

            formData.append("repairNumber", data.repairNumber);
            formData.append("stage", data.stage);

            if (data.technician) {
                formData.append("technician", data.technician);
            }
            if (data.comments) {
                formData.append("comments", data.comments);
            }

            // Compress and append images
            setStatusMessage("Comprimiendo imágenes...");
            const totalImages = data.images.length;
            const compressedImages = [];

            for (let i = 0; i < totalImages; i++) {
                const compressed = await compressImage(data.images[i]);
                compressedImages.push(compressed);
                // Compression takes up the first 30% of progress
                setUploadProgress(Math.round(((i + 1) / totalImages) * 30));
            }

            compressedImages.forEach((image) => {
                formData.append("images", image);
            });

            setStatusMessage("Subiendo a la nube...");

            // Use XMLHttpRequest for upload progress tracking
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/api/photos");

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        // Upload takes up the remaining 70% (from 30% to 100%)
                        const percentComplete = (event.loaded / event.total) * 70;
                        setUploadProgress(30 + Math.round(percentComplete));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        try {
                            const errorResponse = JSON.parse(xhr.responseText);
                            reject(new Error(errorResponse.message || "Error al subir"));
                        } catch {
                            reject(new Error("Error al subir las fotos"));
                        }
                    }
                };

                xhr.onerror = () => reject(new Error("Error de red"));
                xhr.send(formData);
            });

            toast.success("¡Fotos subidas correctamente!");
            const preservedStage = data.stage;
            const preservedRepair = data.repairNumber;
            form.reset({
                repairNumber: preservedRepair,
                stage: preservedStage,
                technician: data.technician ?? "",
                comments: data.comments ?? "",
                images: [],
            });
            setFileInputKey(Date.now());
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "No se pudieron subir las fotos.";
            toast.error(message);
            console.error(error);
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
            setStatusMessage("");
        }
    };

    const isFormValid = form.formState.isValid;


    return (
        <Card>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6">
                    <CardHeader>
                        <div className="space-y-4">
                            {/* Hidden fields for internal logic */}
                            <div className="hidden">
                                <FormField
                                    control={form.control}
                                    name="repairNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="technician"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tu nombre (opcional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="off"
                                                placeholder="Para saber quién tomó la foto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dedicatoria (opcional)</FormLabel>
                                        <FormControl>
                                            <textarea
                                                rows={3}
                                                placeholder="Escribe un mensaje para Iago..."
                                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field: { onChange, onBlur, name, ref } }) => (
                                <FormItem>
                                    <FormControl>
                                        <div>
                                            <Input
                                                key={fileInputKey}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                id="file-upload"
                                                onBlur={onBlur}
                                                name={name}
                                                ref={ref}
                                                onChange={(event) => {
                                                    const files = event.target.files;
                                                    const clonedFiles = files
                                                        ? Array.from(files, (file) =>
                                                            new File([file], file.name, {
                                                                type: file.type,
                                                                lastModified: file.lastModified,
                                                            })
                                                        )
                                                        : [];
                                                    onChange(clonedFiles);
                                                }}
                                            />
                                            <label htmlFor="file-upload">
                                                <Card className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground hover:bg-muted/50 shadow-none transition-colors">
                                                    <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
                                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                                        <p className="text-md font-medium text-muted-foreground">
                                                            Toca para abrir la camara o galeria
                                                        </p>
                                                        {images &&
                                                            images.length >
                                                            0 && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    {images.length}{" "}
                                                                    archivo
                                                                    {images.length !==
                                                                        1
                                                                        ? "s"
                                                                        : ""}{" "}
                                                                    listos
                                                                </p>
                                                            )}
                                                    </CardContent>
                                                </Card>
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isLoading && (
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{statusMessage}</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-2" />
                            </div>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button
                            size="lg"
                            type="submit"
                            className="w-full"
                            disabled={!isFormValid || isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Camera className="h-4 w-4 mr-2" />
                                    Subir Fotos
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
