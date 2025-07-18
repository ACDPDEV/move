import Link from "next/link";
import { Button } from "../ui/button";
import { IconArrowRight, IconBook, IconSearch } from "@tabler/icons-react";
import { Badge } from "../ui/badge";

function Hero() {
    return (
        <section className="w-full h-screen md:h-[calc(100vh-76px)] relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 rounded-t-xl">
            {/*Animated background elements*/}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-32 w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-pulse" ></div>
                <div className="absolute bottom-40 left-1/3 w-20 h-20 bg-cyan-500 rounded-full blur-2xl animate-pulse" ></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[radial-gradient(circle_800px_at_50%_300px,rgba(56,189,248,0.3),transparent)]"></div>
            </div>

            <div className="relative z-10 flex flex-col w-full h-full gap-8 justify-center items-center px-6 animate-fade-in">
                {/* Badge */}
                <Badge className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
                    <IconSearch size={24} />
                    FENCYT 2025 - Colegio San Juan
                </Badge>

                {/* Main heading */}
                <div className="text-center space-y-4">
                    <h1 className="font-black text-8xl md:text-9xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-fade-in">
                        MOVE
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-300 text-center max-w-3xl leading-relaxed">
                    Aprender ciencias de manera <span className="text-blue-400 font-semibold">interactiva</span> y <span className="text-purple-400 font-semibold">divertida</span>
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/simulations/">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                            Explorar simulaciones
                            <IconArrowRight size={24} />
                        </Button>
                    </Link>
                    <Link href="/paper/">
                        <Button size="lg" className="border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-semibold px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2">
                            Leer documentación
                            <IconBook size={24} />
                        </Button>
                    </Link>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bouncing animate-iteration-count-infinite">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;