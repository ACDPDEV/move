import Header from '@/components/layout/Header';
import { ScrollArea } from '../ui/scroll-area';

function LayoutContainer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <ScrollArea className="flex flex-col w-screen h-screen overflow-visible rounded-md">
                <main className="w-[calc(100vw-1rem)] min-h-[calc(100vh-4.5rem)] mt-14 rounded-md overflow-visible">
                    {children}
                </main>
            </ScrollArea>
        </>
    );
}

export default LayoutContainer;
