import Header from "@/components/layout/Header";

function LayoutContainer({ children }: Readonly<{ 
    children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col w-screen h-screen overflow-scroll bg-black text-white p-3">
            <Header /> 
            <article className="w-full h-full mt-[52px]">
                {children}
            </article>
        </main>
    )
}

export default LayoutContainer;