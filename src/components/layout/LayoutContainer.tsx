import Header from '@/components/layout/Header';
import { ScrollArea } from '../ui/scroll-area';

function LayoutContainer({
    children,
    showHeader = true,
    bgColor = '#151618',
}: Readonly<{
    children: React.ReactNode;
    showHeader?: boolean;
    bgColor?: string;
}>) {
    if (showHeader) {
        return (
            <>
                <Header />
                <ScrollArea
                    className="flex flex-col w-screen h-screen rounded-md"
                    style={{ backgroundColor: bgColor }}
                >
                    <main className="w-screen min-h-[calc(100vh-4rem)] mt-14 rounded-md">
                        {children}
                    </main>
                </ScrollArea>
            </>
        );
    } else {
        return (
            <main
                className="w-screen h-screen flex flex-row"
                style={{ backgroundColor: bgColor }}
            >
                {children}
            </main>
        );
    }
}

export default LayoutContainer;
