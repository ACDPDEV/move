
import { Movil, type IMovilProps } from "../entities/Movil";
import { useRef } from 'react';

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
        <div className="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-1">
            <label className="text-sm font-medium text-stone-300 bg-black px-2 py-1.5 border border-stone-600 rounded-l-md">
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
                className="px-2 py-1 bg-stone-700 border border-stone-600 rounded-r-md text-white text-sm focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
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
        <div className="flex flex-row h-fit w-full items-center gap-2">
            <label className="text-sm font-medium text-stone-300">
                {
                    typeVector === 'position' ? 'Posición' :
                    typeVector === 'velocity' ? 'Velocidad' :
                    typeVector === 'acceleration' ? 'Acceleración' :
                    'Vector'
                }:
            </label>
            <div className="grid grid-cols-2 grid-rows-1 gap-1">
                <AxisCoordinateInput typeVector={typeVector} axis="x" entity={entity} handleInputChange={handleInputChange} vectorInputs={vectorInputs} onBlurVector={onBlurVector} />
                <AxisCoordinateInput typeVector={typeVector} axis="y" entity={entity} handleInputChange={handleInputChange} vectorInputs={vectorInputs} onBlurVector={onBlurVector} />
            </div>
        </div>
    );
}

export { AxisCoordinateInput, AxisVectorInput };