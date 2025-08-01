import Header from '@/components/layout/Header';
import { ScrollArea } from '../ui/scroll-area';

function LayoutContainer({
    children,
    bgColor = '#151618',
}: Readonly<{
    children: React.ReactNode;
    bgColor?: string;
    overflow?: string;
}>) {
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
}

export default LayoutContainer;
