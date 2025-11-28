"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePhoto } from "@/app/gallery/actions";
import { ImageLightbox } from "./image-lightbox";
import { GalleryPhoto } from "./gallery-types";

interface GalleryGridProps {
    photos: GalleryPhoto[];
    enableDelete?: boolean;
}

export function GalleryGrid({ photos, enableDelete = false }: GalleryGridProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => {
                    const stageLabel =
                        photo.stage === "ENTRY" ? "Ingreso" : "Salida";
                    const timestamp = photo.createdAt.toLocaleString();
                    return (
                        <div
                            key={photo.id}
                            className="relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            {enableDelete && (
                                <form
                                    action={deletePhoto}
                                    className="absolute top-2 right-2 z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={photo.id}
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        type="submit"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </form>
                            )}
                            <Image
                                src={photo.path}
                                alt={photo.filename}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-0 bottom-0 px-3 py-2 bg-black/60 text-white text-xs leading-tight space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold uppercase tracking-wide">
                                        {stageLabel}
                                    </span>
                                    <span className="text-[10px]">
                                        {timestamp}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate">
                                        #{photo.repairNumber}
                                    </span>
                                    {photo.technician && (
                                        <span className="truncate text-[10px] opacity-80">
                                            {photo.technician}
                                        </span>
                                    )}
                                </div>
                                {photo.comments && (
                                    <p className="text-[10px] opacity-80 line-clamp-2">
                                        {photo.comments}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedPhoto && (
                <ImageLightbox
                    src={selectedPhoto.path}
                    alt={selectedPhoto.filename}
                    onClose={() => setSelectedPhoto(null)}
                />
            )}
        </>
    );
}
