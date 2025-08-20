'use client';
import { usePathname } from "next/navigation";
import {
    HomeLink,
    SimulationsLink,
    DocsLink,
    DownloadLink,
} from "@/components/layout/LinksButton";

function LinksNav() {
    
    const pathname = usePathname();

    return (
        <>
            <ul className="flex flex-row w-fit h-fit p-1 gap-2 bg-[rgba(210,210,200,0.75)] dark:bg-[rgba(39,39,42,0.75)] backdrop-blur-md rounded-lg shadow-md shadow-[rgba(0,0,0,0.1)]">
                <HomeLink isThisPage={pathname === '/' || pathname === ''} />
                <SimulationsLink isThisPage={pathname.includes('/simulations/') || pathname === '/simulations'} />
                <DocsLink isThisPage={pathname.includes('/docs/') || pathname === '/docs'} />
            </ul>
        </>
    );
}

export default LinksNav;