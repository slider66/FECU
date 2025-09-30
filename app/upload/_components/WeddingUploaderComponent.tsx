"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

// FormSchema for the wedding uploader component
const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Dit navn skal være mindst 2 tegn.",
    }),
    images: z
        .array(z.instanceof(File))
        .min(1, {
            message: "Mindst et billede er påkrævet",
        })
        .refine(
            (images) =>
                images.every((image) =>
                    ACCEPTED_IMAGE_MIME_TYPES.includes(image.type)
                ),
            {
                message:
                    "Billederne skal være i formatet jpeg, jpg, png eller webp",
            }
        )
        .refine(
            (images) => images.every((image) => image.size <= MAX_FILE_SIZE),
            {
                message: "Billederne skal være mindre end 5MB",
            }
        ),
});

export function WeddingUploaderComponent() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            images: [],
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // Reset the file input when the key changes

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setIsLoading(true);
            // Create a FormData object to send the data to the API
            const formData = new FormData();
            formData.append("name", data.name);
            data.images.forEach((image) => {
                formData.append("images", image);
            });

            // Send the data to the API
            const response = await fetch("/api/photos", {
                method: "POST",
                body: formData,
            });

            // Wait for the response
            const result = await response.json();

            toast.success(result.message);
            form.reset();
            setFileInputKey(Date.now()); // Reset the file input when the key changes
        } catch (error) {
            toast.error("Billederne blev ikke uploadet");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Used as a counter for the number of images
    const images = useWatch({
        control: form.control,
        name: "images",
    });
    const isFormValid = form.formState.isValid; // Check if the form is valid - either enable or disable the button

    return (
        <Card>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6">
                    {/* Name */}
                    <CardHeader>
                        <FormField
                            control={form.control}
                            name="name" // equal to the name in the FormSchema
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dit navn</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Indtast dit navn"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardHeader>
                    {/* Billeder */}
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="images" // equal to the name in the FormSchema
                            render={({
                                field: { value, onChange, ...fieldProps },
                            }) => (
                                <FormItem>
                                    <FormControl>
                                        <div>
                                            <Input
                                                key={fileInputKey}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden" // see the card below instead
                                                id="file-upload"
                                                onChange={(e) => {
                                                    const files =
                                                        e.target.files;
                                                    onChange(
                                                        files
                                                            ? Array.from(files)
                                                            : []
                                                    );
                                                }}
                                                {...fieldProps}
                                            />

                                            {/* Card for the file input */}
                                            <label htmlFor="file-upload">
                                                <Card className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground hover:bg-muted/50 shadow-none transition-colors">
                                                    <CardContent>
                                                        <ImageIcon className="w-8 h-8 justify-self-center mb-2 text-muted-foreground" />
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <p className="text-md font-medium text-muted-foreground font-serif">
                                                                Klik for at
                                                                vælge billeder
                                                            </p>
                                                            {images &&
                                                                images.length >
                                                                    0 && (
                                                                    <p className="text-sm  text-muted-foreground">
                                                                        {
                                                                            images.length
                                                                        }{" "}
                                                                        billede
                                                                        {images.length !==
                                                                        1
                                                                            ? "r"
                                                                            : ""}{" "}
                                                                        valgt
                                                                    </p>
                                                                )}
                                                        </div>
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
                                    <Loader2 className=" h-4 w-4 animate-spin" />
                                    Uploader {images?.length || 0} billede
                                    {images?.length !== 1 ? "r" : ""}...
                                </>
                            ) : (
                                <>
                                    <Upload className=" h-4 w-4" />
                                    Upload {images?.length || 0} billede
                                    {images?.length !== 1 ? "r" : ""}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
