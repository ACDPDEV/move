'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/stores/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import ColorPicker from '@/simulations/cinematica/components/ColorPicker';

interface ColorInputProps {
    className?: string;
    entityId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const isValidHexColor = (color: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

const ColorInput = memo(function ColorInput({
    className,
    entityId,
    setError,
}: ColorInputProps) {
    const hexInputRef = useRef<HTMLInputElement | null>(null);
    const lastConfirmedRef = useRef<string>('#000000'); // último valor confirmado en store
    const [localHex, setLocalHex] = useState<string>(lastConfirmedRef.current);

    // updater desde el store
    const updateProp = useEntityStore((s) => s.updateSpecificPropOfEntity);

    // Suscripción: sincroniza cambios externos en la entidad (sin pisar si el input está enfocado)
    useEffect(() => {
        const subscriber = (state: EntityStore) => {
            const entity: Entity | undefined = state.entities.find(
                (e) => e.id === entityId,
            );
            if (!entity) return;
            const newColor = (entity.color as string) ?? '#000000';

            // Si el usuario está editando, no forzar el valor
            const el = hexInputRef.current;
            if (el && document.activeElement === el) return;

            if (newColor !== lastConfirmedRef.current) {
                lastConfirmedRef.current = newColor;
                setLocalHex(newColor);
            }
        };

        const unsubscribe = useEntityStore.subscribe(subscriber);

        // Inicializar valor
        const initEntity = useEntityStore
            .getState()
            .entities.find((e) => e.id === entityId);
        if (initEntity) {
            const c = (initEntity.color as string) ?? '#000000';
            lastConfirmedRef.current = c;
            setLocalHex(c);
        }

        return unsubscribe;
    }, [entityId]);

    // Aplicar un hex válido a la store
    const applyHexToStore = (hex: string) => {
        if (!isValidHexColor(hex)) {
            setError('Formato de color inválido. Usa #RRGGBB o #RGB.');
            // opcional: revertir a último confirmado
            setLocalHex(lastConfirmedRef.current);
            return;
        }
        lastConfirmedRef.current = hex;
        updateProp(entityId, 'color', hex);
        setError('');
    };

    // Cuando el usuario escribe en el campo hex
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalHex(e.target.value);
    };

    // Al perder foco aplicamos (si es válido)
    const handleHexBlur = () => {
        const cleaned = localHex.trim();
        if (cleaned === '') {
            // no permitimos vacío: revertir a último confirmado
            setLocalHex(lastConfirmedRef.current);
            setError('');
            return;
        }
        applyHexToStore(cleaned);
    };

    // Enter aplica inmediatamente
    const handleHexKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur(); // dispara blur -> apply
        }
    };

    // Cuando el ColorPicker selecciona un color (aplica inmediatamente)
    const handlePickerChange = (color: string) => {
        if (!isValidHexColor(color)) return;
        lastConfirmedRef.current = color;
        setLocalHex(color);
        updateProp(entityId, 'color', color);
        setError('');
    };

    return (
        <div className={`flex gap-2 items-center ${className ?? ''}`}>
            {/* ColorPicker (botón + popover) */}
            <ColorPicker
                value={lastConfirmedRef.current}
                onChange={handlePickerChange}
                size="sm"
            />
        </div>
    );
});

ColorInput.displayName = 'ColorInput';

export default ColorInput;
