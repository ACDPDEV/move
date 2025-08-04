import Hero from '@/components/index/Hero';
import Features from '@/components/index/Features';
import Logos from '@/components/index/Logos';
import About from '@/components/index/About';
import Ready from '@/components/index/Ready';
import Footer from '@/components/index/Footer';

function Home() {
    return (
        <main className="flex flex-col w-full h-full justify-center items-center text-[#FCFCFD]">
            <article className="relative w-full max-w-3xl h-full flex flex-col items-center justify-center">
                <Hero />
                <div className="relative flex flex-col w-full h-fit">
                    <div className="fixed top-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-gradient-to-t from-transparent via-[#4329AC] to-transparent z-1" />
                    <div className="w-full h-fit flex flex-col p-px gap-px z-2">
                        <Features />
                        <Logos />
                        <About />
                        <Ready />
                    </div>
                    <div className="absolute w-full h-full bg-[#222326]" />
                </div>
            </article>
            <Footer />
        </main>
    );
}

export default Home;
