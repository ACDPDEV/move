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
                simulator.name.toLowerCase().includes(inputQuery.toLowerCase()) ||
                simulator.description.toLowerCase().includes(inputQuery.toLowerCase()) ||
                simulator.area.toLowerCase().includes(inputQuery.toLowerCase())
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