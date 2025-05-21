import { SearchFilter } from "@/components/simulators/SearchFilter";
import { GridResults } from "@/components/simulators/GridResults";
import response from "@/mock/response.json";

function FilterForm() {
    return (
        <article>
            <SearchFilter />
            <GridResults simulators={response} />
        </article>
    )
}

export default FilterForm;