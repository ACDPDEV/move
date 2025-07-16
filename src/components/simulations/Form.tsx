import { SearchFilter } from "@/components/simulations-searching-page/SearchFilter";
import { GridResults } from "@/components/simulations-searching-page/GridResults";
import { useState, useMemo } from "preact/hooks";
import type { CollectionEntry } from "astro:content";

function FilterForm({simulationsPreviews, simulationsComponents}: {
    simulationsPreviews: CollectionEntry<"simulationsDescription">[], 
    simulationsComponents: CollectionEntry<"simulationsComponent">[]
}) {
    const [inputQuery, setInputQuery] = useState("");

    const filteredData = useMemo(() => {
        if (!inputQuery.trim()) return simulationsPreviews;
        
        return simulationsPreviews.filter(simulationPreview => {
            const query = inputQuery.toLowerCase();
            const name = simulationPreview.data.name.toLowerCase();
            const description = simulationPreview.data.description.toLowerCase();
            const areas = simulationPreview.data.area || [];
            
            return (
                name.includes(query) ||
                description.includes(query) ||
                areas.some((area: string) => area.toLowerCase().includes(query))
            );
        });
    }, [simulationsPreviews, inputQuery]);
    
    return (
        <article className="grid grid-rows-[auto_1fr] w-full h-[calc(100vh-76px)] gap-4">
            <SearchFilter getInput={inputQuery} setInput={setInputQuery} />
            <GridResults simulationsPreviews={filteredData} simulationsComponents={simulationsComponents} />
        </article>
    )
}

export default FilterForm;