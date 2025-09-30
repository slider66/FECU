import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Lora } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/ds";
import Header from "@/components/wrapper/Header";
import Footer from "@/components/wrapper/Footer";
import { Toaster } from "@/components/ui/sonner";

const lora = Lora({
    variable: "--font-sans",
    subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
    variable: "--font-serif",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Renas & Ayse's Bryllup",
    description: "Renas & Ayse's Bryllup - Renas og Ayse",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Layout>
            <body className={`${lora.variable} ${playfairDisplay.variable}`}>
                <Header />
                {children}
                <Footer />
                <Toaster />
            </body>
        </Layout>
    );
}
