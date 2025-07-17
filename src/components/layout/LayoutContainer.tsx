import Header from "@/components/layout/Header";
import { ScrollArea } from "../ui/scroll-area";

function LayoutContainer({ children }: Readonly<{ 
    children: React.ReactNode;
}>) {
    return (
        <ScrollArea className="flex flex-col w-screen h-screen overflow-hidden p-3">
            <Header /> 
            <main className="w-full h-full mt-[52px]">
                {children}
            </main>
        </ScrollArea>
    )
}

export default LayoutContainer;