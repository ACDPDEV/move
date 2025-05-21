import { SearchFilter } from "@/components/simulators/SearchFilter";
import { GridResults } from "@/components/simulators/GridResults";
import { useSimulators } from "@/hooks/useSimulators";

function FilterForm() {
    const data = useSimulators();
    return (
        <article className="grid grid-rows-[auto_1fr] w-full h-[calc(100vh-76px)] gap-4">
            <SearchFilter />
            <GridResults simulators={data} />
        </article>
    )
}

export default FilterForm;