"use client";

import { X, Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Prevent scrolling when lightbox is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleDownload = async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = alt || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading image:", error);
            // Fallback: open in new tab
            window.open(src, "_blank");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-16 z-50 text-white hover:bg-white/20"
                    onClick={handleDownload}
                    title="Descargar imagen"
                >
                    <Download className="w-6 h-6" />
                </Button>

                <div className="relative w-full h-full">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-contain"
                        priority
                        sizes="100vw"
                    />
                </div>
            </div>
        </div>
    );
}
