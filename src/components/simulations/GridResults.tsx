import type { CollectionEntry } from "astro:content";
import { useSortedSimulations } from "@/hooks/useSorteredSimulations";

function GridResults({simulationsPreviews, simulationsComponents}: {
    simulationsPreviews: CollectionEntry<"simulationsDescription">[],
    simulationsComponents: CollectionEntry<"simulationsComponent">[]
}) {
    const sortedSimulations = useSortedSimulations(simulationsPreviews, simulationsComponents);
    const hasData = sortedSimulations.length > 0;

    return (
        <section className="flex w-full h-full overflow-auto">
            {hasData ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {sortedSimulations.map((simulation) => {
                        return(
                        <li key={simulation.id}>
                            <a 
                                href={`/simulations/preview/${simulation.slug}/`}
                                className="flex flex-col gap-2 bg-stone-950 border border-stone-800 rounded-md p-4 shadow-md shadow-[rgba(0,0,0,0.5)] h-fit hover:bg-stone-900 transition-colors"
                            >
                                <span className="flex flex-row justify-between items-start">
                                    <h2 className="font-bold text-xl">{simulation.name}</h2>
                                    <div 
                                        className="flex justify-center items-center px-2 py-1 rounded-md text-sm" 
                                        style={{backgroundColor: simulation.isAviable ? '#3FD5AF' : '#D53F3F', 
                                            color: simulation.isAviable ? '#333333' : '#FFFFFF'}}
                                    >
                                        {simulation.isAviable ? (simulation.area ? simulation.area.join("/") : "Sin categoría") : 'Próximamente'}
                                        {/* {simulator.area ? simulator.area.join("/") : "Sin categoría"} */}
                                    </div>
                                </span>
                                <div className="rounded-md bg-stone-900 aspect-video">
                                    <img
                                        src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                        alt={`Vista previa de ${simulation.name}`}
                                        className="h-full w-full rounded-md object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="text-stone-300">{simulation.description}</p>
                            </a>
                        </li>
                    )})}
                </ul>
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <p className="text-stone-400 text-lg">No hay resultados</p>
                </div>
            )}
        </section>
    )
}

export { GridResults };