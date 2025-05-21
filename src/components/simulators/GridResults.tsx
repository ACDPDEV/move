function GridResults({simulators}: {simulators: {
    name: string;
    description: string;
    href: string;
    area: string;
    image: string;
}[]}) {
    const hasSimulators = simulators.length > 0;
    return (
        <section>
            {hasSimulators
                ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {simulators.map((simulator) => (
                            <a href={simulator.href} className="flex flex-col gap-2 bg-stone-950 border border-stone-800 rounded-md p-4 shadow-md shadow-[rgba(0,0,0,0.5)]">
                                <h2 className="font-bold text-xl">{simulator.name}</h2>
                                <img src={simulator.image} alt={simulator.name} />
                                <p>{simulator.area}</p>
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