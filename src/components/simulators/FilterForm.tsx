import { SearchFilter } from "@/components/simulators/SearchFilter";
import { GridResults } from "@/components/simulators/GridResults";
import { useSimulators } from "@/hooks/useSimulators";
import { useState } from "react";
import { type Simulator } from "@/types/Simulator";

function FilterForm() {
    const [ inputQuery, setInputQuery ] = useState("");
    const data = useSimulators();
    const filterData = (data: Simulator[]) => {
        return data.filter((simulator: Simulator) => {
            return(
                simulator.name.includes(inputQuery) ||
                simulator.description.includes(inputQuery) ||
                simulator.area.includes(inputQuery)
            )
        })
    }
    const filteredData = filterData(data);
    
    return (
        <article className="grid grid-rows-[auto_1fr] w-full h-[calc(100vh-76px)] gap-4">
            <SearchFilter getInput={inputQuery} setInput={setInputQuery} />
            <GridResults simulators={filteredData} />
        </article>
    )
}

export default FilterForm;