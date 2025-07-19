import Link from "next/link";
import { Button } from '@/components/ui/button';
import {
    IconHome,
    IconPrismLight,
    IconBook,
    IconDownload,
} from '@tabler/icons-react';

function HomeLink({isThisPage}: Readonly<{ 
    isThisPage: boolean;
}>) {
    return (
        <Link href="/">
            <Button variant={isThisPage ? 'default' : 'secondary'} className="hidden md:flex" >
                <IconHome className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Inicio
                </span>
            </Button>
            <Button variant={isThisPage ? 'default' : 'secondary'} size={'icon'} className="md:hidden">
                <IconHome className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
            </Button>
        </Link>
    )
}

function SimulationsLink({isThisPage}: Readonly<{
    isThisPage: boolean;
}>) {
    return (
        <Link href="/simulations/">
            <Button variant={isThisPage ? 'default' : 'secondary'} className="hidden md:flex" >
                <IconPrismLight className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Simulaciones
                </span>
            </Button>
            <Button variant={isThisPage ? 'default' : 'secondary'} size={'icon'} className="md:hidden">
                <IconPrismLight className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
            </Button>
        </Link>
    )
}

function DocsLink({isThisPage}: Readonly<{ 
    isThisPage?: boolean;
}>) {
    return (
        <Link href="/docs/">
            <Button variant={isThisPage ? 'default' : 'secondary'} className="hidden md:flex" >
                <IconBook className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Documentación
                </span>
            </Button>
            <Button variant={isThisPage ? 'default' : 'secondary'} size={'icon'} className="md:hidden">
                <IconBook className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
            </Button>
        </Link>
    )
}

function DownloadLink({isThisPage}: Readonly<{ 
    isThisPage?: boolean;
}>) {
    return (
        <Link href="/download/">
            <Button variant={isThisPage ? 'default' : 'secondary'} className="hidden md:flex" >
                <IconDownload className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Descargar
                </span>
            </Button>
            <Button variant={isThisPage ? 'default' : 'secondary'} size={'icon'} className="md:hidden">
                <IconDownload className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
            </Button>
        </Link>
    )
}

export {
    HomeLink,
    SimulationsLink,
    DocsLink,
    DownloadLink,
}