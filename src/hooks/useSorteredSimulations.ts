import type { CollectionEntry } from "astro:content";

function useSortedSimulations(
    simulationsPreviews: CollectionEntry<"simulationsDescription">[], 
    simulationsComponents: CollectionEntry<"simulationsComponent">[]
) {
    const sortedSimulations = simulationsPreviews.map((simulation) => {
        const isComponentAvailable = simulationsComponents.find(component => component.slug === simulation.slug) !== undefined;
        return {
            id: simulation.id,
            slug: simulation.slug,
            name: simulation.data.name,
            description: simulation.data.description,
            area: simulation.data.area,
            image: simulation.data.image,
            isAviable: isComponentAvailable
        };
    });
    
    sortedSimulations.sort((a, b) => {
        if (a.isAviable && !b.isAviable) return -1;
        if (!a.isAviable && b.isAviable) return 1;
        return a.name.localeCompare(b.name);
    });
    
    return sortedSimulations;
}

export { useSortedSimulations };