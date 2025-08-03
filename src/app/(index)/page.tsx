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
                <Features />
                <Logos />
                <About />
                <Ready />
            </article>
            <Footer />
        </main>
    );
}

export default Home;
