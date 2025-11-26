import type { Metadata } from "next";
import { Playfair_Display, Dancing_Script } from "next/font/google";
import { Lora } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/ds";
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

const dancingScript = Dancing_Script({
    variable: "--font-handwriting",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Bautizo de Iago",
    description:
        "Comparte tus recuerdos del bautizo de Iago.",
    icons: {
        icon: "/favicon.png",
        shortcut: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Layout>
            <body
                className={`${lora.variable} ${playfairDisplay.variable} ${dancingScript.variable} flex flex-col min-h-screen`}>
                {children}
                <Analytics />
                <Footer />
                <Toaster />
            </body>
        </Layout>
    );
}
