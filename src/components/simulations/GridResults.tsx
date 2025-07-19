import type { Simulation } from "@/data/simulations";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import PreviewCard from "./PreviewCard";

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
            <PreviewCard
              key={simulation.slug} 
              simulation={simulation} 
              getDifficultyColor={getDifficultyColor} 
              getDifficultyDots={getDifficultyDots}
            />
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
