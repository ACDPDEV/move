import Link from 'next/link';
import PlayerBar from '@/components/index/PlayerBar';
import PageURL from '@/components/index/PageURL';
import PlanePreview from '@/components/index/PlanePreview';
import Colaborators from '@/components/index/Colaborators';

function Features() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 grid-rows-1 pt-16 w-full min-h-screen justify-center items-center bg-gradient-to-t from-[#222326] to-[#151618] px-px gap-px [&_h1]:font-semibold [&_h1]:text-xl [&_h1]:text-[#FCFCFD] [&_p]:text-sm [&_p]:font-medium [&_p]:text-[#9A9CAC] [&>div>div]:bg-[#151618] [&>div>div]:p-10 [&>div>div]:flex [&>div>div]:flex-col [&>div>div]:gap-2 [&>div>div]:overflow-hidden [&>div]:flex [&>div]:flex-col [&>div>div]:min-h-84 [&>div]:gap-px [&>div]:h-full">
            <div>
                <div>
                    <h1>Renderizado en tiempo real</h1>
                    <p>
                        Visualiza los cálculos físicos al instante, actualizando
                        posiciones, velocidades y colisiones sin recargar la
                        página.
                    </p>
                    <div className="relative flex grow w-full h-50 overflow-visible">
                        <PlanePreview className="absolute bottom-0 left-1/2 -translate-x-1/2" />
                    </div>
                </div>
                <div>
                    <h1>Código Abierto y Extensible</h1>
                    <p>
                        Repositorio público en{' '}
                        <Link
                            href="https://github.com/acdpdev/move"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#7a74a5] hover:underline"
                        >
                            GitHub
                        </Link>
                        , bajo licencia GPL-3.0. Si quieres contribuir, ¡eres
                        bienvenido!, crea una issue o pull request.
                    </p>
                    <div className="relative flex grow w-full h-24 overflow-visible">
                        <Colaborators className="absolute top-1/2 left-1/2 -translate-1/2" />
                    </div>
                </div>
                <span className="flex-1 bg-[#151618]" />
            </div>
            <div>
                <div>
                    <h1>100% Interactivo</h1>
                    <p>
                        Controla los parámetros que quieras, y mira al momento
                        cómo cambian los resultados. Puedes realizar múltiples
                        acciones en una simulación.
                    </p>
                    <div className="relative flex grow w-full h-24 overflow-visible">
                        <PlayerBar className="absolute bottom-0 left-1/2 -translate-x-1/2" />
                    </div>
                </div>
                <div>
                    <h1>Comparte tus resultados</h1>
                    <p>
                        Copia la URL de tu simulación y comparte con tus amigos,
                        colegas o compañeros de clase. Tus datos se guardarán
                        automáticamente.
                    </p>
                    <div className="relative flex grow w-full h-50 overflow-visible">
                        <PageURL className="absolute bottom-0 right-0 scale-150" />
                    </div>
                </div>
                <span className="flex-1 bg-[#151618]" />
            </div>
        </section>
    );
}

export default Features;
