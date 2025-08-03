import Hero from '@/components/index/Hero';
import Features from '@/components/index/Features';
import Logos from '@/components/index/Logos';
import About from '@/components/index/About';

function Home() {
    return (
        <main className="flex flex-col w-full h-full justify-center items-center text-[#FCFCFD]">
            <article className="w-full max-w-3xl h-full flex flex-col items-center justify-center">
                <Hero />
                <Features />
                <Logos />
                <About />
            </article>
        </main>
    );
}

export default Home;
