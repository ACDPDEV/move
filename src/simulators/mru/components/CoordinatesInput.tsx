import { Movil, type IMovilProps } from "../entities/Movil";


function AxisCoordinateInput(
    {typeVector, axis, entity, handleInputChange}: {
        typeVector: 'position' | 'velocity' | 'acceleration',
        axis: 'x' | 'y',
        entity: Movil,
        handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void
    }
) {
    return (
        <div class="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-1">
            <label class="text-sm font-medium text-stone-300 bg-black px-2 py-1.5 border border-stone-600 rounded-l-md">
                {axis.toUpperCase()}
            </label>
            <input
                type="number"
                value={entity[typeVector]?.[axis]?.toFixed(1) || '0'}
                onChange={(e) => handleInputChange(
                    entity.id!, 
                    typeVector, 
                    parseFloat((e.target as HTMLInputElement).value) || 0,
                    axis
                )}
                class="px-2 py-1 bg-stone-700 border border-stone-600 rounded-r-md text-white text-sm focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
                step="0.1"
            />
        </div>
    )    
}

function AxisVectorInput(
    {typeVector, entity, handleInputChange}: {
        typeVector: 'position' | 'velocity' | 'acceleration',
        entity: Movil,
        handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void
    }
) {
    return (
        <div class="flex flex-row h-fit w-full items-center gap-2">
            <label class="text-sm font-medium text-stone-300">
                {typeVector.charAt(0).toUpperCase() + typeVector.slice(1)}:
            </label>
            <div class="grid grid-cols-2 grid-rows-1 gap-1">
                <AxisCoordinateInput typeVector={typeVector} axis="x" entity={entity} handleInputChange={handleInputChange} />
                <AxisCoordinateInput typeVector={typeVector} axis="y" entity={entity} handleInputChange={handleInputChange} />
            </div>
        </div>
    )
}

export { AxisCoordinateInput, AxisVectorInput };