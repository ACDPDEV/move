import About from '@/components/index/About';
import Features from '@/components/index/Features';
import Footer from '@/components/index/Footer';
import Hero from '@/components/index/Hero';
import PlayerBar from '@/components/index/PlayerBar';
import Ready from '@/components/index/Ready';
import Link from 'next/link';

function Home() {
    return (
        <main className="flex flex-col w-full h-full justify-center items-center text-[#FCFCFD]">
            <article className="w-full max-w-3xl h-full flex flex-col items-center justify-center">
                <Hero />
                <section className="grid grid-cols-1 sm:grid-cols-2 grid-rows-1 pt-16 w-full min-h-screen justify-center items-center bg-gradient-to-t from-[#222326] to-[#151618] px-px gap-px [&_h1]:font-semibold [&_h1]:text-xl [&_h1]:text-[#FCFCFD] [&_p]:text-sm [&_p]:font-medium [&_p]:text-[#9A9CAC] [&>div>div]:bg-[#151618] [&>div>div]:p-10 [&>div>div]:flex [&>div>div]:flex-col [&>div>div]:gap-2 [&>div>div]:relative [&>div>div]:overflow-hidden [&>div]:grid [&>div]:grid-rows-2 [&>div>div]:min-h-84 [&>div]:gap-px [&>div]:h-full">
                    <div>
                        <div>
                            <h1>Renderizado en tiempo real</h1>
                            <p>
                                Visualiza los cálculos físicos al instante,
                                actualizando posiciones, velocidades y
                                colisiones sin recargar la página.
                            </p>
                        </div>
                        <div>
                            <h1>Código Abierto y Extensible</h1>
                            <p>
                                Repositorio público en{' '}
                                <Link
                                    href="https://github.com/acdpdev/move"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#675dbe] hover:underline"
                                >
                                    GitHub
                                </Link>
                                , bajo licencia GPL-3.0. Si quieres contribuir,
                                ¡eres bienvenido!, crea una issue o pull
                                request.
                            </p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1>100% Interactivo</h1>
                            <p>
                                Controla los parámetros que quieras, y mira al
                                momento cómo cambian los resultados. Puedes
                                realizar múltiples acciones en una simulación.
                            </p>
                            <PlayerBar className="absolute bottom-12 left-1/2 -translate-x-1/2" />
                        </div>
                        <div>
                            <h1>Comparte tus resultados</h1>
                            <p>
                                Copia la URL de tu simulación y comparte con tus
                                amigos, colegas o compañeros de clase. Tus datos
                                se guardarán automáticamente.
                            </p>
                        </div>
                    </div>
                </section>
            </article>
        </main>
    );
}

export default Home;
