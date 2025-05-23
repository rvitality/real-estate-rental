import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Real Estate - Rental",
    description:
        "Discover your next rental home with ease using our real estate rental app. Browse properties on an interactive map, view detailed listings, and find rentals based on location, budget, and preferences—all in one place.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
