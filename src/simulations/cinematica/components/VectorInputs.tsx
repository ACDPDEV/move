import { Movil, type IMovilProps } from '@/simulations/cinematica/entities/Movil';

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

function PositionVectorInput({
    entity,
    handleInputChange,
    vectorInputs,
    onBlurVector
}: {
    entity: Movil,
    handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void,
    vectorInputs?: { x?: string; y?: string },
    onBlurVector?: (id: string, property: keyof IMovilProps, value: string, vectorComponent: 'x' | 'y') => void
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-stone-300">
                    Posición
                </label>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <AxisCoordinateInput
                    typeVector="position"
                    axis="x"
                    entity={entity}
                    handleInputChange={handleInputChange}
                    vectorInputs={vectorInputs}
                    onBlurVector={onBlurVector}
                />
                <AxisCoordinateInput
                    typeVector="position"
                    axis="y"
                    entity={entity}
                    handleInputChange={handleInputChange}
                    vectorInputs={vectorInputs}
                    onBlurVector={onBlurVector}
                />
            </div>
        </div>
    );
}

function VelocityVectorInput({
    entity,
    handleInputChange,
    vectorInputs,
    onBlurVector
}: {
    entity: Movil,
    handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void,
    vectorInputs?: { x?: string; y?: string },
    onBlurVector?: (id: string, property: keyof IMovilProps, value: string, vectorComponent: 'x' | 'y') => void
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-stone-300">
                    Velocidad
                </label>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <AxisCoordinateInput
                    typeVector="velocity"
                    axis="x"
                    entity={entity}
                    handleInputChange={handleInputChange}
                    vectorInputs={vectorInputs}
                    onBlurVector={onBlurVector}
                />
                <AxisCoordinateInput
                    typeVector="velocity"
                    axis="y"
                    entity={entity}
                    handleInputChange={handleInputChange}
                    vectorInputs={vectorInputs}
                    onBlurVector={onBlurVector}
                />
            </div>
        </div>
    );
}

function AccelerationVectorInput({
    entity,
    handleInputChange,
    vectorInputs,
    onBlurVector
}: {
    entity: Movil,
    handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void,
    vectorInputs?: { x?: string; y?: string },
    onBlurVector?: (id: string, property: keyof IMovilProps, value: string, vectorComponent: 'x' | 'y') => void
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-stone-300">
                    Aceleración
                </label>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <AxisCoordinateInput
                    typeVector="acceleration"
                    axis="x"
                    entity={entity}
                    handleInputChange={handleInputChange}
                    vectorInputs={vectorInputs}
                    onBlurVector={onBlurVector}
                />
                <AxisCoordinateInput
                    typeVector="acceleration"
                    axis="y"
                    entity={entity}
                    handleInputChange={handleInputChange}
                    vectorInputs={vectorInputs}
                    onBlurVector={onBlurVector}
                />
            </div>
        </div>
    );
}

export { PositionVectorInput, VelocityVectorInput, AccelerationVectorInput };