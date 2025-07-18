import { Card, CardContent } from "@/components/ui/card";
import { simulations } from "@/data/simulations";
import { useMemo } from "react";

function Description() {
    const stats = useMemo(() => {
        const total = simulations.length;
        const available = simulations.filter(s => s.isAvaible).length;
        const areas = ['Mecánica/Cinemática'];
        
        return { total, available, areas: areas.length };
    }, []);

    return (
        <section className="animate-fade-in px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 md:mb-4">
                    Simulaciones
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                    Explora nuestra colección de simulaciones interactivas para potenciar tu aprendizaje
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8 max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                            {stats.total}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Simuladores totales
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                            {stats.available}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Disponibles ahora
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-1 col-span-1">
                    <CardContent className="p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                            {stats.areas}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Áreas de estudio
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

export default Description;