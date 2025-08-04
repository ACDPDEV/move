import { Link } from 'next-view-transitions';
import { Button } from '../ui/button';
import {
    IconPlayerPlay,
    IconEye,
    IconClock,
    IconStar,
    IconUsers,
} from '@tabler/icons-react';
import { Badge } from '../ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '../ui/card';
import { AspectRatio } from '../ui/aspect-ratio';
import { Simulation } from '@/data/simulations';

function PreviewCard({
    simulation,
    getDifficultyColor,
    getDifficultyDots,
}: Readonly<{
    simulation: Simulation;
    getDifficultyColor: (difficulty: string) => string;
    getDifficultyDots: (difficulty: string) => React.ReactNode;
}>) {
    return (
        <Link href={simulation.previewLink} key={simulation.slug}>
            <Card className="group overflow-hidden border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1">
                {/* Layout: Vertical en desktop, Horizontal en mobile */}
                <div className="flex flex-row md:flex-col">
                    {/* Imagen - Cuadrada en mobile, rectangular en desktop */}
                    <div className="w-24 h-24 md:w-full md:h-auto flex-shrink-0">
                        {/* Desktop: Imagen rectangular con AspectRatio */}
                        <div className="hidden md:block">
                            <AspectRatio
                                ratio={16 / 10}
                                className="relative overflow-hidden"
                                style={{
                                    viewTransitionName: `CardImage-${simulation.slug}`,
                                }}
                            >
                                <img
                                    src={simulation.image}
                                    alt={simulation.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 dark:from-blue-600/40 dark:via-purple-600/30 dark:to-pink-600/40" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Status indicator */}
                                <div className="absolute top-4 left-4">
                                    <div
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm ${
                                            simulation.isAvaible
                                                ? 'bg-emerald-500/20 border border-emerald-500/30'
                                                : 'bg-amber-500/20 border border-amber-500/30'
                                        }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                simulation.isAvaible
                                                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                                                    : 'bg-amber-400 shadow-lg shadow-amber-400/50'
                                            }`}
                                        />
                                        <span className="text-xs font-medium text-white">
                                            {simulation.isAvaible
                                                ? 'Disponible'
                                                : 'Próximamente'}
                                        </span>
                                    </div>
                                </div>

                                {/* Difficulty indicator */}
                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                        {getDifficultyDots(
                                            simulation.difficulty,
                                        )}
                                    </div>
                                </div>

                                {/* Action buttons overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex gap-2">
                                        {simulation.isAvaible ? (
                                            <>
                                                <Link
                                                    href={simulation.playLink}
                                                >
                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                                                    >
                                                        <IconPlayerPlay className="w-4 h-4 mr-1" />
                                                        Jugar
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={
                                                        simulation.previewLink
                                                    }
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                                                    >
                                                        <IconEye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                disabled
                                                className="bg-white/20 text-white/60 backdrop-blur-sm"
                                            >
                                                <IconClock className="w-4 h-4 mr-1" />
                                                Pronto
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </AspectRatio>
                        </div>

                        {/* Mobile: Imagen cuadrada */}
                        <div className="md:hidden w-full h-full relative overflow-hidden rounded-l-lg">
                            <img
                                src={simulation.image}
                                alt={simulation.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient overlay mobile */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 dark:from-blue-600/40 dark:via-purple-600/30 dark:to-pink-600/40" />

                            {/* Mobile indicators */}
                            <div className="absolute top-1 left-1">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        simulation.isAvaible
                                            ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                            : 'bg-amber-400 shadow-sm shadow-amber-400/50'
                                    }`}
                                />
                            </div>
                            <div className="absolute top-1 right-1 flex items-center gap-0.5">
                                {getDifficultyDots(simulation.difficulty)}
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Header */}
                        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
                            <div className="flex flex-col gap-1">
                                {/* Mobile: Status inline */}
                                <div className="md:hidden">
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            simulation.isAvaible
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}
                                    >
                                        {simulation.isAvaible
                                            ? 'Disponible'
                                            : 'Próximamente'}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-sm md:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {simulation.name}
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400 mt-0.5 text-xs md:text-sm line-clamp-1">
                                        {simulation.area.join(' • ')}
                                    </CardDescription>
                                </div>

                                {simulation.isAvaible && (
                                    <div className="hidden md:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        <div className="flex items-center gap-1">
                                            <IconStar className="w-3 h-3 text-yellow-500" />
                                            <span>?</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IconUsers className="w-3 h-3 text-blue-500" />
                                            <span>?</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        {/* Content */}
                        <CardContent className="flex-1 px-3 md:px-6 pb-3 md:pb-6 pt-0">
                            <div className="flex flex-col h-full justify-between gap-2">
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {simulation.description}
                                </p>

                                {/* Mobile: Botones de acción */}
                                <div className="md:hidden flex gap-1 mt-2">
                                    {simulation.isAvaible ? (
                                        <>
                                            <Link
                                                href={simulation.playLink}
                                                className="flex-1"
                                            >
                                                <Button
                                                    size="sm"
                                                    className="w-full text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                                                >
                                                    <IconPlayerPlay className="w-3 h-3 mr-1" />
                                                    Jugar
                                                </Button>
                                            </Link>
                                            <Link href={simulation.previewLink}>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="px-2"
                                                >
                                                    <IconEye className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            disabled
                                            className="w-full text-xs"
                                        >
                                            <IconClock className="w-3 h-3 mr-1" />
                                            Pronto
                                        </Button>
                                    )}
                                </div>

                                {/* Tags y dificultad */}
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex flex-wrap gap-1">
                                        {simulation.area
                                            .slice(0, 1)
                                            .map((area, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                                >
                                                    {area}
                                                </Badge>
                                            ))}
                                        {simulation.area.length > 1 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                                            >
                                                +{simulation.area.length - 1}
                                            </Badge>
                                        )}
                                    </div>

                                    <Badge
                                        className={`text-xs font-medium ${getDifficultyColor(
                                            simulation.difficulty,
                                        )}`}
                                    >
                                        {simulation.difficulty}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

export default PreviewCard;
