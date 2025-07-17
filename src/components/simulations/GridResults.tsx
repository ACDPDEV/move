import type { Simulation } from "@/data/simulations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  IconPlayerPlay, 
  IconEye, 
  IconClock,
  IconStar,
  IconUsers,
  IconTrendingUp,
  IconExternalLink
} from "@tabler/icons-react";

function GridResults({ simulations }: Readonly<{ simulations: Simulation[] }>) {
  const hasData = simulations.length > 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25';
      case 'Intermedio':
        return 'bg-amber-500 text-white shadow-lg shadow-amber-500/25';
      case 'Avanzado':
        return 'bg-rose-500 text-white shadow-lg shadow-rose-500/25';
      default:
        return 'bg-slate-500 text-white shadow-lg shadow-slate-500/25';
    }
  };

  const getDifficultyDots = (difficulty: string) => {
    const dots = [];
    const activeCount = difficulty === 'Básico' ? 1 : difficulty === 'Intermedio' ? 2 : 3;
    
    for (let i = 0; i < 3; i++) {
      dots.push(
        <div 
          key={i} 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < activeCount 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/50' 
              : 'bg-slate-300 dark:bg-slate-600'
          }`} 
        />
      );
    }
    return dots;
  };

  return (
    <div className="w-full">
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((simulation) => (
            <Link href={simulation.previewLink} key={simulation.slug} >
              <Card 
                className="group overflow-hidden border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1"
              >
                <CardContent className="p-0">
                  <AspectRatio ratio={16 / 10} className="relative overflow-hidden">
                    <div className="absolute inset-0">
                      <Image
                        src={`/img/${simulation.image}`}
                        alt={simulation.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 dark:from-blue-600/40 dark:via-purple-600/30 dark:to-pink-600/40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                    
                    {/* Status indicator */}
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm ${
                        simulation.isAvaible 
                          ? 'bg-emerald-500/20 border border-emerald-500/30' 
                          : 'bg-amber-500/20 border border-amber-500/30'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          simulation.isAvaible 
                            ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' 
                            : 'bg-amber-400 shadow-lg shadow-amber-400/50'
                        }`} />
                        <span className="text-xs font-medium text-white">
                          {simulation.isAvaible ? 'Disponible' : 'Próximamente'}
                        </span>
                      </div>
                    </div>

                    {/* Difficulty indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        {getDifficultyDots(simulation.difficulty)}
                      </div>
                    </div>

                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        {simulation.isAvaible ? (
                          <>
                            <Link href={simulation.playLink}>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                              >
                                <IconPlayerPlay className="w-4 h-4 mr-1" />
                                Jugar
                              </Button>
                            </Link>
                            <Link href={simulation.previewLink}>
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
                </CardContent>

                <CardHeader className="pb-3">
                  <div className="flex flex-col items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {simulation.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                        {simulation.area.join(" • ")}
                      </CardDescription>
                    </div>
                    
                    {simulation.isAvaible && (
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <IconStar className="w-3 h-3 text-yellow-500" />
                          {/* <span>{simulation.rating}</span> */}
                          <span>?</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconUsers className="w-3 h-3 text-blue-500" />
                          {/* <span>{simulation.userCount}</span> */}
                          <span>?</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {simulation.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {simulation.area.slice(0, 2).map((area, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-300"
                        >
                          {area}
                        </Badge>
                      ))}
                      {simulation.area.length > 2 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                        >
                          +{simulation.area.length - 2}
                        </Badge>
                      )}
                    </div>

                    <Badge 
                      className={`text-xs font-medium ${getDifficultyColor(simulation.difficulty)}`}
                    >
                      {simulation.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Card className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-2xl">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                No hay resultados
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Intenta con otros términos de búsqueda
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default GridResults;
