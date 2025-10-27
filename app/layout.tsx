import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Lora } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/ds";
import Header from "@/components/wrapper/Header";
import Footer from "@/components/wrapper/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const lora = Lora({
    variable: "--font-sans",
    subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
    variable: "--font-serif",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Control de Reparaciones",
    description:
        "Registro fotografico de ingreso y salida de equipos con evidencia visual en la nube.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Layout>
            <body
                className={`${lora.variable} ${playfairDisplay.variable} flex flex-col min-h-screen`}>
                <Header />
                {children}
                <Analytics />
                <Footer />
                <Toaster />
            </body>
        </Layout>
    );
}
