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
        <Link href="/">
            <Button variant={isThisPage ? 'default' : 'secondary'} >
                <IconHome className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Inicio
                </span>
            </Button>
        </Link>
    )
}

function SimulationsLink({isThisPage}: Readonly<{
    isThisPage: boolean;
}>) {
    return (
        <Link href="/simulations/">
            <Button variant={isThisPage ? 'default' : 'secondary'} >
                <IconPrismLight className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Simulaciones
                </span>
            </Button>
        </Link>
    )
}

function AboutLink({isThisPage}: Readonly<{ 
    isThisPage?: boolean;
}>) {
    return (
        <Link href="/about/">
            <Button variant={isThisPage ? 'default' : 'secondary'} >
                <IconInfoCircle className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Sobre nosotros
                </span>
            </Button>
        </Link>
    )
}

function ContactLink({isThisPage}: Readonly<{ 
    isThisPage?: boolean;
}>) {
    return (
        <Link href="/contact/">
            <Button variant={isThisPage ? 'default' : 'secondary'} >
                <IconMessage className={isThisPage ? 'stroke-stone-400 dark:stroke-stone-800' : 'stroke-stone-800 dark:stroke-stone-400'} />
                <span className={isThisPage ? 'text-stone-400 dark:text-stone-800' : 'text-stone-800 dark:text-stone-400'}>
                    Contacto
                </span>
            </Button>
        </Link>
    )
}

export {
    HomeLink,
    SimulationsLink,
    AboutLink,
    ContactLink,
}