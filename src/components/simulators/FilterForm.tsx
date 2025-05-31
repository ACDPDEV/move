import { SearchFilter } from "@/components/simulators/SearchFilter";
import { GridResults } from "@/components/simulators/GridResults";
import { useState } from "react";
import type { CollectionEntry } from "astro:content";

function FilterForm(
    {data}: {data: CollectionEntry<"simulators">[]}
) {
    const [ inputQuery, setInputQuery ] = useState("");
    const filterData = (data: CollectionEntry<"simulators">[]) => 
            data.filter(simulator => (
                simulator.data.name.toLowerCase().includes(inputQuery.toLowerCase()) ||
                simulator.data.description.toLowerCase().includes(inputQuery.toLowerCase()) ||
                simulator.data.area.toLowerCase().includes(inputQuery.toLowerCase())
            )
    );
    const filteredData = filterData(data);
    
    return (
        <article className="grid grid-rows-[auto_1fr] w-full h-[calc(100vh-76px)] gap-4">
            <SearchFilter getInput={inputQuery} setInput={setInputQuery} />
            <GridResults data={filteredData} />
        </article>
    )
}

export default FilterForm;