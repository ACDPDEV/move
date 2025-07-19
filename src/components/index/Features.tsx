import { IconBulb, IconCalculator, IconPlanet, IconWorld } from "@tabler/icons-react";

function Features() {
    return (
        <section className="py-20 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">¿Qué ofrecemos?</h2>
                    <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                        Simulaciones interactivas que transforman conceptos abstractos en experiencias visuales y comprensibles
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cinemática Card */}
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-300 dark:border-blue-500/30 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-blue-500/20 transition-all duration-300">
                        <div className="p-4 bg-blue-200 dark:bg-blue-500/20 rounded-full w-fit mb-6 shadow-md dark:shadow-none">
                            <IconCalculator size={36} className="text-blue-700 dark:text-blue-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Cinemática</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">4 simulaciones completas de movimiento que cubren desde conceptos básicos hasta aplicaciones avanzadas</p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Movimiento rectilíneo uniforme</li>
                            <li>• Movimiento uniformemente acelerado</li>
                            <li>• Caída libre y lanzamiento vertical</li>
                            <li>• Movimiento parabólico</li>
                        </ul>
                    </div>

                    {/* Física Aplicada Card */}
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-300 dark:border-purple-500/30 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-purple-500/20 transition-all duration-300">
                        <div className="p-4 bg-purple-200 dark:bg-purple-500/20 rounded-full w-fit mb-6 shadow-md dark:shadow-none">
                            <IconBulb size={36} className="text-purple-700 dark:text-purple-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Física Aplicada</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Conceptos complejos simplificados a través de visualizaciones interactivas y ejemplos prácticos</p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Gráficos interactivos en tiempo real</li>
                            <li>• Parámetros ajustables</li>
                            <li>• Ejemplos del mundo real</li>
                            <li>• Análisis paso a paso</li>
                        </ul>
                    </div>

                    {/* Lenguas Originarias Card */}
                    <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/20 dark:to-cyan-800/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-300 dark:border-cyan-500/30 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:shadow-cyan-500/20 transition-all duration-300">
                        <div className="p-4 bg-cyan-200 dark:bg-cyan-500/20 rounded-full w-fit mb-6 shadow-md dark:shadow-none">
                            <IconWorld size={36} className="text-cyan-700 dark:text-cyan-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Lenguas Originarias</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Próximamente disponible en quechua y otras lenguas del Perú para mayor accesibilidad</p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Quechua (en desarrollo)</li>
                            <li>• Términos científicos localizados</li>
                            <li>• Educación inclusiva</li>
                            <li>• Preservación cultural</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Features;