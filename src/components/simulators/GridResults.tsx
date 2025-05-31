import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";
import type { CollectionEntry } from "astro:content";

function GridResults({data}: {data: CollectionEntry<"simulators">[]}) {
    const hasData = data.length > 0;
    return (
        <section className="flex w-full h-full overflow-scroll">
            {hasData
                ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.map((simulator) => (
                            <a href={simulator.data.href} className="flex flex-col gap-2 bg-stone-950 border border-stone-800 rounded-md p-4 shadow-md shadow-[rgba(0,0,0,0.5)] h-fit" key={simulator.data.name}>
                                <span className="flex flex-row justify-between">
                                    <h2 className="font-bold text-xl">{simulator.data.name}</h2>
                                    <Badge>{simulator.data.area}</Badge>
                                </span>
                                <AspectRatio ratio={16 / 9} className="rounded-md bg-stone-900">
                                    <img
                                        src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt={simulator.data.name}
                                        className="h-full w-full rounded-md object-cover"
                                    />
                                </AspectRatio>
                                <p>{simulator.data.description}</p>
                            </a>
                        ))}
                    </ul>
                )
                : (
                <p>No hay resultados</p>
            )}
        </section>
    )
}

export { GridResults };