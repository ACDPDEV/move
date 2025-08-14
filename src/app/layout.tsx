import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { ViewTransitions } from 'next-view-transitions';

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist',
    weight: ['300', '400', '500', '700'],
});

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
    title: 'Move',
    description:
        'Plataforma educativa interactiva diseñada para facilitar el aprendizaje de física y matemáticas mediante simulaciones visuales accesibles desde la web.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="es" suppressHydrationWarning>
                <body
                    className={`${geist.variable} ${geistMono.variable} ${geist.className}`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                    <Analytics />
                    <SpeedInsights />
                </body>
            </html>
        </ViewTransitions>
    );
}
