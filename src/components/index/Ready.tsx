import { IconBook, IconChevronRight, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { Meteors } from '../ui/meteors';
import Aureola from '../svgs/Aureola';
import Line from '../svgs/Line';

function Ready() {
    return (
        <section className="relative overflow-hidden w-full flex flex-col justify-center items-center gap-16 px-24 py-16 [&_h1]:font-semibold [&_h1]:text-2xl [&_h1]:text-[#FCFCFD] [&_h2]:text-md [&_h2]:font-medium [&_h2]:text-[#D9D9D9] border-x border-[#222326]">
            <div className="flex flex-col gap-2 justify-center items-center z-2">
                <h1>¿Listo para comenzar?</h1>
                <h2>Explora nuestro catálogo de simulaciones</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-20 justify-center items-center font-medium z-2">
                <Link
                    href="/simulations/"
                    className="flex p-0.5 rounded-lg border border-[#302D55] hover:scale-120 transition-all duration-300 ease-in"
                >
                    <button className="flex flex-row w-fit gap-1 sm:gap-2 p-2 sm:p-3 bg-[#5646ED] border border-[#5848EE] rounded-md justify-between items-center shadow-inset-double text-sm sm:text-md">
                        <IconSearch className="size-4 sm:size-5" />
                        Explorar
                        <IconChevronRight className="size-4 sm:size-5" />
                    </button>
                </Link>
                <Link href="/docs/guide/" className="w-full sm:w-fit">
                    <button className="flex flex-row w-full sm:w-fit gap-1 sm:gap-2 p-2 sm:p-3 backdrop-blur-sm border border-[#302D55] rounded-md justify-between items-center hover:shadow-inset-double hover:scale-120 transition-all duration-300 ease-in text-sm md:text-md">
                        <IconBook className="size-4 sm:size-5" />
                        Lee más
                        <IconChevronRight className="size-4 sm:size-5" />
                    </button>
                </Link>
            </div>
            <Meteors number={20} />
            <Aureola className="absolute top-1/2 left-1/2 -translate-1/2 min-w-[90rem] w-full h-auto z-100 pointer-events-none" />
            <img
                src="/Stars.avif"
                alt="stars"
                className="absolute top-1/2 left-1/2 -translate-1/2 min-w-6xl w-full max-w-none h-auto z-1 opacity-60 animate-pulse animate-iteration-count-infinite pointer-events-none"
            />
        </section>
    );
}

export default Ready;
