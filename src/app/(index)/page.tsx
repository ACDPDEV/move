import About from '@/components/index/About';
import Features from '@/components/index/Features';
import Footer from '@/components/index/Footer';
import Hero from '@/components/index/Hero';
import Ready from '@/components/index/Ready';

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <About />
      <Ready />
      <Footer />
    </>
  );
}

export default Home;