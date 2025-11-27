"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryNavigationProps {
    className?: string;
}

export function GalleryNavigation({ className }: GalleryNavigationProps) {
    return (
        <div className={cn("flex items-center py-4", className)}>
            <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
            >
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-lg font-medium">Volver al inicio</span>
                </Link>
            </Button>
        </div>
    );
}
