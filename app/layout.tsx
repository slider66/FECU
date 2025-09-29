import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/ds";
import Header from "@/components/wrapper/Header";
import Footer from "@/components/wrapper/Footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Renas & Ayse's Bryllup",
    description: "Renas & Ayse's Bryllup",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Layout>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <Header />
                {children}
                <Footer />
                <Toaster />
            </body>
        </Layout>
    );
}
