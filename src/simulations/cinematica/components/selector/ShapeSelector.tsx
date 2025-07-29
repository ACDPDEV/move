import React, { memo } from 'react';
import { useEntityStore } from '@/simulations/cinematica/stores/useEntityStore';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    IconCircle,
    IconCircleFilled,
    IconSquare,
    IconSquareFilled,
    IconTriangle,
    IconTriangleFilled,
} from '@tabler/icons-react';

interface ShapeSelectorProps {
    className?: string;
    entityId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const ShapeSelector = memo(function ShapeSelector({
    className,
    entityId,
    setError,
}: ShapeSelectorProps) {
    const shape = useEntityStore(
        (s) => s.entities.find((e) => e.id === entityId)?.shape,
    );
    const updateX = useEntityStore((s) => s.updateSpecificPropOfEntity);
    return (
        <Select
            onValueChange={(value) => updateX(entityId, 'shape', value)}
            defaultValue={shape}
        >
            <SelectTrigger className={`${className} w-[180px]`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Forma</SelectLabel>
                    <SelectItem value="circle">
                        {shape === 'circle' ? (
                            <IconCircleFilled />
                        ) : (
                            <IconCircle />
                        )}
                        Círculo
                    </SelectItem>
                    <SelectItem value="square">
                        {shape === 'square' ? (
                            <IconSquareFilled />
                        ) : (
                            <IconSquare />
                        )}
                        Cuadrado
                    </SelectItem>
                    <SelectItem value="triangle">
                        {shape === 'triangle' ? (
                            <IconTriangleFilled />
                        ) : (
                            <IconTriangle />
                        )}
                        Triángulo
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
});

ShapeSelector.displayName = 'ShapeSelector';

export default ShapeSelector;
