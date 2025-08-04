import Header from '@/components/layout/Header';
import { ScrollArea } from '../ui/scroll-area';

function LayoutContainer({
    children,
    showHeader = true,
    bgColor = '#151618',
    personalisedBackground,
}: Readonly<{
    children: React.ReactNode;
    showHeader?: boolean;
    bgColor?: string;
    personalisedBackground?: React.ReactNode;
}>) {
    if (showHeader) {
        return (
            <div
                id="app"
                className="relative w-screen h-screen overflow-hidden"
            >
                <Header />
                <ScrollArea className="flex flex-col w-screen h-screen rounded-md">
                    <main className="w-screen min-h-[calc(100vh-4rem)] mt-14 rounded-md">
                        {children}
                    </main>
                </ScrollArea>
                <div
                    className="absolute w-full h-full top-0 left-0 bottom-0 right-0 -z-1000"
                    style={{ backgroundColor: bgColor }}
                >
                    {personalisedBackground}
                </div>
            </div>
        );
    } else {
        return (
            <div
                id="app"
                className="relative w-screen h-screen overflow-hidden"
            >
                <main className="w-screen h-screen flex flex-row">
                    {children}
                </main>
                <div
                    className="absolute w-full h-full top-0 left-0 bottom-0 right-0 -z-1000"
                    style={{ backgroundColor: bgColor }}
                >
                    {personalisedBackground}
                </div>
            </div>
        );
    }
}

export default LayoutContainer;
