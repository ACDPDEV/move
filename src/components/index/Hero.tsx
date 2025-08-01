/* eslint-disable @next/next/no-img-element */
import Aureola from '@/components/svgs/Aureola';
import E from '@/components/svgs/E';
import M from '@/components/svgs/M';
import O from '@/components/svgs/O';
import V from '@/components/svgs/V';
import Line from '@/components/svgs/Line';
import Link from 'next/link';
import { IconBook, IconChevronRight, IconSearch } from '@tabler/icons-react';

function Hero() {
    return (
        <section className="relative w-full max-w-3xl h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center">
            <div className="w-full h-auto px-2 sm:px-12 pb-8 [&>*]:w-auto [&>*]:h-full flex flex-row -space-x-6 sm:-space-x-12 justify-center items-center">
                <M className="M" />
                <O className="O" />
                <V className="V" />
                <E className="E" />
            </div>
            <h2 className="typing-26 block box-border text-center text-lg sm:text-2xl font-bold text-[#9DA3AF] whitespace-nowrap w-[27ch] font-mono border-r-4 overflow-hidden">
                Aprende<span className="text-[#A3A3DC]"> ciencias </span>de
                manera
            </h2>
            <h2 className="typing-23 block box-border text-center text-lg sm:text-2xl font-bold text-[#9DA3AF] whitespace-nowrap w-[24ch] font-mono border-r-4 overflow-hidden mb-32 sm:mb-0">
                <span className="text-[#A2DCA2]"> interactiva </span>y
                <span className="text-[#F79C6E]"> divertida </span>
            </h2>
            <Aureola className="absolute top-1/2 left-1/2 -translate-1/2 min-w-[90rem] w-full h-auto z-100 pointer-events-none animate-fade-in animate-duration-[1.4s]" />
            <Line className="absolute top-0 bottom-0 left-0 right-0 w-full h-full -z-1 animate-fade-in animate-duration-[1.4s]" />
            <img
                src="/Stars.avif"
                alt="stars"
                className="absolute top-1/2 left-1/2 -translate-1/2 min-w-6xl w-full max-w-none h-auto -z-2 opacity-60 animate-pulse animate-iteration-count-infinite"
            />
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-20 justify-center items-center absolute bottom-8 sm:static sm:my-12 font-medium animate-fade-in animate-duration-400 animate-delay-400">
                <Link
                    href="/simulations/"
                    className="flex p-0.5 rounded-lg border border-[#302D55] hover:scale-120 transition-all duration-300 ease-in"
                >
                    <button className="flex flex-row w-fit gap-1 sm:gap-2 p-2 sm:p-3 bg-[#5646ED] border border-[#5848EE] rounded-md justify-between items-center shadow-inset-double text-sm sm:text-md">
                        <IconSearch className="size-4 sm:size-5" />
                        Busca una simulación
                        <IconChevronRight className="size-4 sm:size-5" />
                    </button>
                </Link>
                <Link href="/docs/guide/" className="w-full sm:w-fit">
                    <button className="flex flex-row w-full sm:w-fit gap-1 sm:gap-2 p-2 sm:p-3 backdrop-blur-sm border border-[#302D55] rounded-md justify-between items-center hover:shadow-inset-double hover:scale-120 transition-all duration-300 ease-in text-sm md:text-md">
                        <IconBook className="size-4 sm:size-5" />
                        Lee la guía
                        <IconChevronRight className="size-4 sm:size-5" />
                    </button>
                </Link>
            </div>
        </section>
    );
}

export default Hero;
