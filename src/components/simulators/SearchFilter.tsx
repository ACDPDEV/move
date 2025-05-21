import { Input } from "@/components/ui/input";

function SearchFilter() {
    return (
        <Input
            placeholder="Buscar simuladores..."
            className="border border-stone-900 rounded-md focus-visible:ring-stone-800 focus-visible:border-stone-700"
        />
    )
}

export { SearchFilter };