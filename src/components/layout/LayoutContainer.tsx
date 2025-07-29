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
            <ScrollArea className="flex flex-col w-screen h-screen overflow-hidden p-2 rounded-md">
                <main className="mt-14 rounded-md overflow-hidden">
                    {children}
                </main>
            </ScrollArea>
        </>
    );
}

export default LayoutContainer;
