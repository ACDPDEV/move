'use client';
import SearchInput from "@/components/simulations/SearchInput";
import GridResults from "@/components/simulations/GridResults";
import { simulations } from "@/data/simulations";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTrendingUp, IconFilter, IconSortDescending } from "@tabler/icons-react";
import Description from "./Description";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <Description />

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
