import { SearchFilter } from "@/components/simulations-searching-page/SearchFilter";
import { GridResults } from "@/components/simulations-searching-page/GridResults";
import { useState, useMemo } from "preact/hooks";
import type { CollectionEntry } from "astro:content";

function FilterForm(
    {data}: {data: CollectionEntry<"simulationsDescription">[]}
) {
    const [inputQuery, setInputQuery] = useState("");

    const filteredData = useMemo(() => {
        if (!inputQuery.trim()) return data;
        
        return data.filter(simulator => {
            const query = inputQuery.toLowerCase();
            const name = simulator.data.name.toLowerCase();
            const description = simulator.data.description.toLowerCase();
            const areas = simulator.data.area || [];
            
            return (
                name.includes(query) ||
                description.includes(query) ||
                areas.some((area: string) => area.toLowerCase().includes(query))
            );
        });
    }, [data, inputQuery]);
    
    return (
        <article className="grid grid-rows-[auto_1fr] w-full h-[calc(100vh-76px)] gap-4">
            <SearchFilter getInput={inputQuery} setInput={setInputQuery} />
            <GridResults data={filteredData} />
        </article>
    )
}

export default FilterForm;