import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";

function SearchFilter() {
    return (
        <div className="flex flex-row items-center gap-2 rounded-md bg-stone-900 focus-visible:ring-stone-800 focus-visible:border-stone-700 px-4 py-2">
            <IconSearch className="stroke-stone-400 hover:stroke-white hover:scale-110 transition-all" />
            <Input
                placeholder="Buscar simuladores..."
                className="border-0 rounded-md focus-visible:ring-0 focus-visible:border-0"
            />
        </div>
    )
}

export { SearchFilter };