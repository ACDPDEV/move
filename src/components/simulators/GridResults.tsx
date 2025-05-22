import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";

function GridResults({simulators}: {simulators: {
    name: string;
    description: string;
    href: string;
    area: string;
    image: string;
}[]}) {
    const hasSimulators = simulators.length > 0;
    return (
        <section className="flex w-full h-full overflow-scroll">
            {hasSimulators
                ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {simulators.map((simulator) => (
                            <a href={simulator.href} className="flex flex-col gap-2 bg-stone-950 border border-stone-800 rounded-md p-4 shadow-md shadow-[rgba(0,0,0,0.5)] h-fit" key={simulator.name}>
                                <span className="flex flex-row justify-between">
                                    <h2 className="font-bold text-xl">{simulator.name}</h2>
                                    <Badge>{simulator.area}</Badge>
                                </span>
                                <AspectRatio ratio={16 / 9} className="rounded-md bg-stone-900">
                                    <img
                                        src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt={simulator.name}
                                        className="h-full w-full rounded-md object-cover"
                                    />
                                </AspectRatio>
                                <p>{simulator.description}</p>
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