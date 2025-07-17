'use client';
import SearchInput from "@/components/simulations/SearchInput";
import GridResults from "@/components/simulations/GridResults";
import { simulations } from "@/data/simulations";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp, IconFilter, IconSortDescending } from "@tabler/icons-react";

function SimulationsForm() {
  const [inputQuery, setInputQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!inputQuery.trim()) return simulations;

    return simulations.filter(simulation => {
      const query = inputQuery.toLowerCase();
      const name = simulation.name.toLowerCase();
      const description = simulation.description.toLowerCase();
      const areas = simulation.area || [];

      return (
        name.includes(query) ||
        description.includes(query) ||
        areas.some((area: string) => area.toLowerCase().includes(query))
      );
    });
  }, [inputQuery]);

  const stats = useMemo(() => {
    const total = simulations.length;
    const available = simulations.filter(s => s.isAvaible).length;
    const areas = ['Mecánica/Cinemática'];
    
    return { total, available, areas: areas.length };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Simulaciones
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explora nuestra colección de simulaciones interactivas para potenciar tu aprendizaje
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Simuladores totales
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {stats.available}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Disponibles ahora
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {stats.areas}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Áreas de estudio
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchInput input={inputQuery} setInput={setInputQuery} />
        </div>

        {/* Results Info */}
        {inputQuery && (
          <div className="mb-6">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-lg">
              <CardContent >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconTrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''} para "{inputQuery}"
                    </span>
                  </div>
                  {filteredData.length > 0 && (
                    <Badge 
                      variant="outline" 
                      className="text-xs border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                    >
                      {filteredData.filter(s => s.isAvaible).length} disponible{filteredData.filter(s => s.isAvaible).length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Grid */}
        <GridResults simulations={filteredData} />
      </div>
    </div>
  );
}

export default SimulationsForm;
