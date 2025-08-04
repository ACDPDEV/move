import { Link } from 'next-view-transitions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    IconPlayerPlay,
    IconClock,
    IconArrowLeft,
    IconExternalLink,
    IconEye,
    IconBookmark,
    IconShare,
    IconStar,
    IconUsers,
    IconTrendingUp,
} from '@tabler/icons-react';
import { Simulation } from '@/data/simulations';

function SimulationCard({
    simulation,
    showBackButton = false,
}: {
    simulation: Simulation | undefined;
    showBackButton?: boolean;
}) {
    if (!simulation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-2xl">
                    <CardContent className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                            Simulador no encontrado
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            No pudimos encontrar el simulador que buscas.
                        </p>
                        <Link href="/simulations/">
                            <Button variant="outline" className="group">
                                <IconArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Volver
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Básico':
                return 'bg-green-500 shadow-green-500/50';
            case 'Intermedio':
                return 'bg-yellow-500 shadow-yellow-500/50';
            case 'Avanzado':
                return 'bg-red-500 shadow-red-500/50';
            default:
                return 'bg-gray-500 shadow-gray-500/50';
        }
    };

    const getDifficultyDots = (difficulty: string) => {
        const dots = [];
        const activeCount =
            difficulty === 'Básico' ? 1 : difficulty === 'Intermedio' ? 2 : 3;

        for (let i = 0; i < 3; i++) {
            dots.push(
                <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                        i < activeCount
                            ? 'bg-blue-500 shadow-sm shadow-blue-500/50'
                            : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                />,
            );
        }
        return dots;
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
                {/* Header con navegación */}
                {showBackButton && (
                    <div className="mb-6 sm:mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
                        >
                            <IconArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm sm:text-base">
                                Volver a simuladores
                            </span>
                        </Link>
                    </div>
                )}

                {/* CTA Principal - Móvil */}
                <div className="lg:hidden mb-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 shadow-xl">
                        <CardContent className="p-4 sm:p-6">
                            <div className="text-center space-y-4">
                                <div className="text-3xl sm:text-4xl">🚀</div>
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                                    {simulation.isAvaible
                                        ? '¿Listo para comenzar?'
                                        : 'Próximamente'}
                                </h2>

                                <div className="space-y-3">
                                    {simulation.isAvaible ? (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Link
                                                href={simulation.playLink}
                                                className="flex-1"
                                            >
                                                <Button
                                                    size="lg"
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                                                >
                                                    <IconPlayerPlay className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                    <span className="text-sm sm:text-base">
                                                        Iniciar simulación
                                                    </span>
                                                    <IconExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={simulation.previewLink}
                                                className="flex-1"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                                                >
                                                    <IconEye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                    <span className="text-sm sm:text-base">
                                                        Vista previa
                                                    </span>
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Button
                                                size="lg"
                                                disabled
                                                className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                            >
                                                <IconClock className="w-4 h-4 mr-2" />
                                                <span className="text-sm sm:text-base">
                                                    Próximamente disponible
                                                </span>
                                            </Button>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                                Estamos trabajando en este
                                                simulador
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid Layout Principal */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    {/* Imagen Hero - 2 columnas de 3 en desktop */}
                    <div className="xl:col-span-2">
                        <Card className="group overflow-hidden border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                            <CardContent className="p-0">
                                <AspectRatio
                                    ratio={16 / 10}
                                    className="relative overflow-hidden"
                                >
                                    {/* Imagen con efecto de degradado */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={simulation.image}
                                            alt={simulation.name}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Degradado superpuesto */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 dark:from-blue-600/40 dark:via-purple-600/30 dark:to-pink-600/40" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    {/* Contenido superpuesto */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                                        <div className="space-y-3 sm:space-y-4">
                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                {simulation.area.map(
                                                    (area, index) => (
                                                        <Badge
                                                            key={index}
                                                            className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors text-xs sm:text-sm px-2 py-1"
                                                        >
                                                            {area}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>

                                            {/* Título */}
                                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                                                {simulation.name}
                                            </h1>

                                            {/* Descripción */}
                                            <p className="text-white/90 text-sm sm:text-base lg:text-lg xl:text-xl max-w-2xl leading-relaxed">
                                                {simulation.description}
                                            </p>
                                        </div>
                                    </div>
                                </AspectRatio>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Información lateral - 1 columna de 3 en desktop */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* CTA Principal - Visible solo en desktop/tablet */}
                        <div className="hidden lg:block">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 shadow-xl">
                                <CardContent className="p-4 xl:p-6">
                                    <div className="text-center space-y-3 xl:space-y-4">
                                        <div className="text-3xl xl:text-4xl">
                                            🚀
                                        </div>
                                        <h2 className="text-lg xl:text-xl font-semibold text-slate-900 dark:text-slate-100">
                                            {simulation.isAvaible
                                                ? '¿Listo para comenzar?'
                                                : 'Próximamente'}
                                        </h2>

                                        <div className="space-y-2 xl:space-y-3">
                                            {simulation.isAvaible ? (
                                                <div className="flex flex-col gap-3">
                                                    <Link
                                                        href={
                                                            simulation.playLink
                                                        }
                                                    >
                                                        <Button
                                                            size="lg"
                                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 text-sm xl:text-base"
                                                        >
                                                            <IconPlayerPlay className="w-4 h-4 xl:w-5 xl:h-5 mr-2" />
                                                            <span className="hidden xl:inline">
                                                                Iniciar
                                                                simulación
                                                            </span>
                                                            <span className="xl:hidden">
                                                                Iniciar
                                                            </span>
                                                            <IconExternalLink className="w-3 h-3 xl:w-4 xl:h-4 ml-2" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={
                                                            simulation.previewLink
                                                        }
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="lg"
                                                            className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-sm xl:text-base"
                                                        >
                                                            <IconEye className="w-3 h-3 xl:w-4 xl:h-4 mr-2" />
                                                            <span className="hidden xl:inline">
                                                                Vista previa
                                                            </span>
                                                            <span className="xl:hidden">
                                                                Preview
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Button
                                                        size="lg"
                                                        disabled
                                                        className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm xl:text-base"
                                                    >
                                                        <IconClock className="w-4 h-4 mr-2" />
                                                        <span className="hidden xl:inline">
                                                            Próximamente
                                                            disponible
                                                        </span>
                                                        <span className="xl:hidden">
                                                            Próximamente
                                                        </span>
                                                    </Button>
                                                    <p className="text-xs xl:text-sm text-slate-600 dark:text-slate-400">
                                                        Estamos trabajando en
                                                        este simulador
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Estadísticas rápidas - Solo si está disponible */}
                        {simulation.isAvaible && (
                            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-4 xl:p-6">
                                    <div className="grid grid-cols-2 gap-3 xl:gap-4 text-center">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center">
                                                <IconStar className="w-4 h-4 xl:w-5 xl:h-5 text-yellow-500 mr-1" />
                                                <span className="text-lg xl:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                    ?
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Valoración
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center">
                                                <IconUsers className="w-4 h-4 xl:w-5 xl:h-5 text-blue-500 mr-1" />
                                                <span className="text-lg xl:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                    ?
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Usuarios
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Información del simulador */}
                        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="pb-3 xl:pb-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base xl:text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Detalles
                                    </h3>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 h-8 w-8 p-0"
                                        >
                                            <IconBookmark className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 h-8 w-8 p-0"
                                        >
                                            <IconShare className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 xl:space-y-4 pt-0">
                                {/* Estado */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Estado
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-3 h-3 rounded-full ${
                                                simulation.isAvaible
                                                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                                    : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                                            }`}
                                        />
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {simulation.isAvaible
                                                ? 'Disponible'
                                                : 'En desarrollo'}
                                        </span>
                                    </div>
                                </div>

                                <Separator className="bg-slate-200 dark:bg-slate-700" />

                                {/* Áreas */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Áreas de estudio
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {simulation.area.map((area, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs px-2 py-1"
                                            >
                                                {area}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-slate-200 dark:bg-slate-700" />

                                {/* Dificultad */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Dificultad
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {getDifficultyDots(
                                                simulation.difficulty,
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {simulation.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Grid de características */}
                <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Características */}
                    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader className="pb-3 lg:pb-4">
                            <h3 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Características
                            </h3>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-1 gap-3">
                                {simulation.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contenido descriptivo */}
                    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader className="pb-3 lg:pb-4">
                            <h3 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100">
                                Acerca de este simulador
                            </h3>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                                {simulation.content}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default SimulationCard;
