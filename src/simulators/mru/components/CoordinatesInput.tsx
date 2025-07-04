
import { Movil, type IMovilProps } from "../entities/Movil";
import { useRef } from 'preact/hooks';

function AxisCoordinateInput({
    typeVector,
    axis,
    entity,
    handleInputChange,
    vectorInputs,
    onBlurVector
}: {
    typeVector: 'position' | 'velocity' | 'acceleration',
    axis: 'x' | 'y',
    entity: Movil,
    handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void,
    vectorInputs?: { x?: string; y?: string },
    onBlurVector?: (id: string, property: keyof IMovilProps, value: string, vectorComponent: 'x' | 'y') => void
}) {
    const inputValue =
        vectorInputs?.[axis] !== undefined
            ? vectorInputs[axis]
            : entity[typeVector]?.[axis]?.toString() ?? '';
    return (
        <div class="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-1">
            <label class="text-sm font-medium text-stone-300 bg-black px-2 py-1.5 border border-stone-600 rounded-l-md">
                {axis.toUpperCase()}
            </label>
            <input
                type="number"
                value={Number(inputValue).toFixed(1)}
                onInput={e => {
                    const val = (e.target as HTMLInputElement).value;
                    handleInputChange(entity.id!, typeVector, val, axis);
                }}
                onBlur={e => {
                    const val = (e.target as HTMLInputElement).value;
                    if (onBlurVector) {
                        onBlurVector(entity.id!, typeVector, val, axis);
                    }
                }}
                class="px-2 py-1 bg-stone-700 border border-stone-600 rounded-r-md text-white text-sm focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
                step="0.1"
            />
        </div>
    );
}

function AxisVectorInput({
    typeVector,
    entity,
    handleInputChange,
    vectorInputs,
    onBlurVector
}: {
    typeVector: 'position' | 'velocity' | 'acceleration',
    entity: Movil,
    handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void,
    vectorInputs?: { x?: string; y?: string },
    onBlurVector?: (id: string, property: keyof IMovilProps, value: string, vectorComponent: 'x' | 'y') => void
}) {
    return (
        <div class="flex flex-row h-fit w-full items-center gap-2">
            <label class="text-sm font-medium text-stone-300">
                {typeVector.charAt(0).toUpperCase() + typeVector.slice(1)}:
            </label>
            <div class="grid grid-cols-2 grid-rows-1 gap-1">
                <AxisCoordinateInput typeVector={typeVector} axis="x" entity={entity} handleInputChange={handleInputChange} vectorInputs={vectorInputs} onBlurVector={onBlurVector} />
                <AxisCoordinateInput typeVector={typeVector} axis="y" entity={entity} handleInputChange={handleInputChange} vectorInputs={vectorInputs} onBlurVector={onBlurVector} />
            </div>
        </div>
    );
}

export { AxisCoordinateInput, AxisVectorInput };