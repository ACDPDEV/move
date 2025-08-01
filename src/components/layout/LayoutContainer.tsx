import Header from '@/components/layout/Header';
import { ScrollArea } from '../ui/scroll-area';

function LayoutContainer({
    children,
    bgColor = '#151618',
    overflow = 'hidden',
}: Readonly<{
    children: React.ReactNode;
    bgColor?: string;
    overflow?: string;
}>) {
    return (
        <>
            <Header />
            <ScrollArea
                className="flex flex-col w-screen h-screen overflow-visible rounded-md -z-100"
                style={{ backgroundColor: bgColor }}
            >
                <main
                    className={`w-screen min-h-[calc(100vh-4rem)] mt-14 rounded-md overflow-${overflow}`}
                >
                    {children}
                </main>
            </ScrollArea>
        </>
    );
}

export default LayoutContainer;
