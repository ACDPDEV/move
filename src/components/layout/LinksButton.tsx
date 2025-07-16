import Link from "next/link";
import { Button } from '@/components/ui/button';
import {
    IconHome,
    IconPrismLight,
    IconInfoCircle,
    IconMessage,
} from '@tabler/icons-react';

function HomeLink({isThisPage}: Readonly<{ 
    isThisPage: boolean;
}>) {
    return (
        <Button variant={isThisPage ? 'secondary' : 'default'} disabled={isThisPage} className="p-0">
            <Link href="/" className="flex flex-row gap-2 justify-center items-center h-full w-full p-3">
                <IconHome className={`${isThisPage ? 'stroke-stone-800 hover:stroke-stone-950' : 'stroke-stone-400 hover:stroke-stone-200'} hover:scale-110 transition-all`} />
                <span className={isThisPage ? 'text-stone-800' : 'text-stone-400'}>Inicio</span>
            </Link>
        </Button>
    )
}

function SimulationsLink({isThisPage}: Readonly<{
    isThisPage: boolean;
}>) {
    return (
        <Button variant={isThisPage ? 'secondary' : 'default'} disabled={isThisPage} className="p-0">
            <Link href="/simulations/" className="flex flex-row gap-2 justify-center items-center h-full w-full p-3">
                <IconPrismLight className={`${isThisPage ? 'stroke-stone-800 hover:stroke-stone-950' : 'stroke-stone-400 hover:stroke-stone-200'} hover:scale-110 transition-all`} />
                <span className={isThisPage ? 'text-stone-800' : 'text-stone-400'}>Simulaciones</span>
            </Link>
        </Button>
    )
}

function AboutLink({isThisPage}: Readonly<{ 
    isThisPage?: boolean;
}>) {
    return (
        <Button variant={isThisPage ? 'secondary' : 'default'} disabled={isThisPage} className="p-0">
            <Link href="/about/" className="flex flex-row gap-2 justify-center items-center h-full w-full p-3">
                <IconInfoCircle className={`${isThisPage ? 'stroke-stone-800 hover:stroke-stone-950' : 'stroke-stone-400 hover:stroke-stone-200'} hover:scale-110 transition-all`} />
                <span className={isThisPage ? 'text-stone-800' : 'text-stone-400'}>Sobre nosotros</span>
            </Link>
        </Button>
    )
}

function ContactLink({isThisPage}: Readonly<{ 
    isThisPage?: boolean;
}>) {
    return (
        <Button variant={isThisPage ? 'secondary' : 'default'} disabled={isThisPage} className="p-0">
            <Link href="/contact/" className="flex flex-row gap-2 justify-center items-center h-full w-full p-3">
                <IconMessage className={`${isThisPage ? 'stroke-stone-800 hover:stroke-stone-950' : 'stroke-stone-400 hover:stroke-stone-200'} hover:scale-110 transition-all`} />
                <span className={isThisPage ? 'text-stone-800' : 'text-stone-400'}>Contacto</span>
            </Link>
        </Button>
    )
}

export {
    HomeLink,
    SimulationsLink,
    AboutLink,
    ContactLink,
}