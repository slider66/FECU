"use client";

import { useState } from "react";
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
    stage: z.enum(["ENTRY", "EXIT"], {
        errorMap: () => ({
            message: "Selecciona ingreso o salida.",
        }),
    }),
    technician: z
        .string()
        .trim()
        .max(48, { message: "El nombre es demasiado largo." })
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
            images: [],
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const stage = useWatch({
        control: form.control,
        name: "stage",
    });

    const images = useWatch({
        control: form.control,
        name: "images",
    });

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true);
            const formData = new FormData();

            formData.append("repairNumber", data.repairNumber);
            formData.append("stage", data.stage);

            if (data.technician) {
                formData.append("technician", data.technician);
            }

            data.images.forEach((image) => {
                formData.append("images", image);
            });

            const response = await fetch("/api/photos", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || "Error al subir las fotos.");
            }

            toast.success(result.message);
            const preservedStage = data.stage;
            const preservedRepair = data.repairNumber;
            form.reset({
                repairNumber: preservedRepair,
                stage: preservedStage,
                technician: data.technician ?? "",
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
        }
    };

    const isFormValid = form.formState.isValid;
    const stageLabel =
        stage === "EXIT"
            ? "Registrar estado de salida"
            : "Registrar estado de ingreso";

    return (
        <Card>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6">
                    <CardHeader>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="repairNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Numero de reparacion
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="off"
                                                placeholder="Ej. 2458-2025"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Etapa</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-2 gap-2">
                                                {stageOptions.map((option) => (
                                                    <Button
                                                        key={option.value}
                                                        type="button"
                                                        variant={
                                                            field.value ===
                                                            option.value
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        onClick={() =>
                                                            form.setValue(
                                                                "stage",
                                                                option.value,
                                                                {
                                                                    shouldDirty:
                                                                        true,
                                                                    shouldTouch:
                                                                        true,
                                                                    shouldValidate:
                                                                        true,
                                                                }
                                                            )
                                                        }>
                                                        <Camera className="h-4 w-4 mr-2" />
                                                        {option.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="technician"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tecnico (opcional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="off"
                                                placeholder="Quien hace el registro"
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
                            render={({ field: { onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormControl>
                                        <div>
                                            <Input
                                                key={fileInputKey}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                id="file-upload"
                                                onChange={(event) => {
                                                    const files =
                                                        event.target.files;
                                                    const clonedFiles = files
                                                        ? Array.from(
                                                              files,
                                                              (file) =>
                                                                  new File(
                                                                      [file],
                                                                      file.name,
                                                                      {
                                                                          type: file.type,
                                                                          lastModified:
                                                                              file.lastModified,
                                                                      }
                                                                  )
                                                          )
                                                        : [];
                                                    onChange(clonedFiles);
                                                }}
                                                {...fieldProps}
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
                                    Subiendo {images?.length || 0} foto
                                    {images && images.length !== 1 ? "s" : ""}...
                                </>
                            ) : (
                                <>
                                    <Camera className="h-4 w-4 mr-2" />
                                    {stageLabel}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
