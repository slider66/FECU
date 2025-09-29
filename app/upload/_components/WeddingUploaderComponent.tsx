"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6">
                {/* Name */}
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
                {/* Billeder */}
                <FormField
                    control={form.control}
                    name="images" // equal to the name in the FormSchema
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel>Dine billeder</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    placeholder="Indtast dine billeder"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        onChange(
                                            files ? Array.from(files) : []
                                        );
                                    }}
                                    {...fieldProps}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={!isFormValid || isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploader {images?.length || 0} billede
                            {images?.length !== 1 ? "r" : ""}...
                        </>
                    ) : (
                        `Upload ${images?.length || 0} billede${
                            images?.length !== 1 ? "r" : ""
                        }`
                    )}
                </Button>
            </form>
        </Form>
    );
}
