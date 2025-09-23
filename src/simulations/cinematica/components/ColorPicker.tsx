'use client';

import React, { forwardRef, useEffect, useState, memo } from 'react';
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

export interface ColorPickerProps {
    className?: string;
    value: string; // hex color, e.g. "#ff0000"
    onChange: (color: string) => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

const isValidHexColor = (color: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

const ColorPickerInner = forwardRef<HTMLInputElement, ColorPickerProps>(
    ({ className, value, onChange, disabled, size = 'sm' }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [customColor, setCustomColor] = useState(
            isValidHexColor(value) ? value : '#000000',
        );

        // Mantener sincronizado si value cambia desde fuera
        useEffect(() => {
            if (isValidHexColor(value)) setCustomColor(value);
        }, [value]);

        const applyColor = (color: string) => {
            if (!isValidHexColor(color)) return;
            onChange(color);
            setCustomColor(color);
            setIsOpen(false);
        };

        const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setCustomColor(v);
            // no llamar onChange hasta que sea válido; pero permitir tipo color tambien
        };

        const handleColorInputChange = (
            e: React.ChangeEvent<HTMLInputElement>,
        ) => {
            const v = e.target.value;
            setCustomColor(v);
            if (isValidHexColor(v)) onChange(v);
        };

        const triggerClass =
            size === 'sm'
                ? 'px-2 py-1 text-sm h-8'
                : 'px-3 py-2 text-base h-10';

        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        disabled={disabled}
                        className={`${triggerClass} ${
                            className ?? ''
                        } flex items-center gap-2`}
                        aria-label="Seleccionar color"
                        title={value || 'Seleccionar color'}
                    >
                        <div
                            aria-hidden
                            className="w-4 h-4 rounded-sm border border-gray-300 shrink-0"
                            style={{
                                backgroundColor: isValidHexColor(value)
                                    ? value
                                    : '#000000',
                            }}
                        />
                        <span className="truncate max-w-[6rem]">
                            {isValidHexColor(value) ? value : '—'}
                        </span>
                        <Palette className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-64 p-3" align="start">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium mb-2">
                                Colores predefinidos
                            </p>
                            <div className="grid grid-cols-6 gap-2">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => applyColor(color)}
                                        className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                        type="button"
                                        aria-label={`Seleccionar ${color}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">
                                Color personalizado
                            </p>
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1">
                                    <Input
                                        ref={ref}
                                        type="text"
                                        value={customColor}
                                        onChange={handleCustomInput}
                                        onBlur={() => {
                                            if (isValidHexColor(customColor)) {
                                                onChange(customColor);
                                            } else {
                                                // revertir a último value válido
                                                setCustomColor(
                                                    isValidHexColor(value)
                                                        ? value
                                                        : '#000000',
                                                );
                                            }
                                        }}
                                        placeholder="#000000"
                                        aria-label="Color hexadecimal"
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
                                        aria-hidden
                                    />
                                </div>

                                <Input
                                    type="color"
                                    value={
                                        isValidHexColor(customColor)
                                            ? customColor
                                            : '#000000'
                                    }
                                    onChange={handleColorInputChange}
                                    className="w-12 h-10 p-1 border rounded"
                                    aria-label="Selector de color"
                                />
                            </div>

                            {!isValidHexColor(customColor) &&
                                customColor !== '' && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Formato inválido — usa hex (p. ej.
                                        #0f0f0f).
                                    </p>
                                )}
                        </div>

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
                                onClick={() => applyColor(customColor)}
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
    },
);

ColorPickerInner.displayName = 'ColorPicker';
export const ColorPicker = memo(ColorPickerInner);
export default ColorPicker;
