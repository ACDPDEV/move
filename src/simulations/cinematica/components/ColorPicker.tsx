'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const PRESET_COLORS = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#64748b', // slate-500
    '#000000', // black
    '#ffffff', // white
    '#6b7280', // gray-500
];

interface ColorPickerProps {
    className?: string;
    value: string;
    onChange: (color: string) => void;
    disabled?: boolean;
    ref?: React.Ref<HTMLInputElement | null>;
}

export function ColorPicker({
    className,
    value,
    onChange,
    disabled,
    ref,
}: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [customColor, setCustomColor] = useState(value || '#000000');

    const handleColorSelect = (color: string) => {
        onChange(color);
        setCustomColor(color);
        setIsOpen(false);
    };

    const handleCustomColorChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newColor = e.target.value;
        setCustomColor(newColor);
        onChange(newColor);
    };

    const isValidHexColor = (color: string) => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={className}
                >
                    <div
                        className="w-4 h-4 rounded-sm border border-gray-300"
                        style={{
                            backgroundColor: isValidHexColor(value)
                                ? value
                                : '#000000',
                        }}
                    />
                    <span className="flex-1 text-left">
                        {value || 'Seleccionar color'}
                    </span>
                    <Palette className="h-4 w-4 text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
                <div className="space-y-4">
                    {/* Colores predefinidos */}
                    <div>
                        <p className="text-sm font-medium mb-3">
                            Colores predefinidos
                        </p>
                        <div className="grid grid-cols-6 gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => handleColorSelect(color)}
                                    className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                    type="button"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Selector de color personalizado */}
                    <div>
                        <p className="text-sm font-medium mb-3">
                            Color personalizado
                        </p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    value={customColor}
                                    onChange={handleCustomColorChange}
                                    placeholder="#000000"
                                    className="pr-10"
                                />
                                <div
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded border border-gray-300"
                                    style={{
                                        backgroundColor: isValidHexColor(
                                            customColor,
                                        )
                                            ? customColor
                                            : '#ffffff',
                                    }}
                                />
                            </div>
                            <Input
                                type="color"
                                value={
                                    isValidHexColor(customColor)
                                        ? customColor
                                        : '#000000'
                                }
                                onChange={(e) => handleCustomColorChange(e)}
                                className="w-12 h-10 p-1 border rounded"
                            />
                        </div>
                        {!isValidHexColor(customColor) &&
                            customColor !== '' && (
                                <p className="text-xs text-red-500 mt-1">
                                    Formato de color inválido. Use formato hex
                                    (#000000)
                                </p>
                            )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => handleColorSelect(customColor)}
                            size="sm"
                            className="flex-1"
                            disabled={!isValidHexColor(customColor)}
                            type="button"
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
