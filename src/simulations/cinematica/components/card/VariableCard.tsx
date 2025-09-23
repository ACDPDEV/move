// VariableCard.tsx
'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
    useVariablesStore,
    type Variable,
} from '../../stores/useVariablesStore';
import styles from '../../consts/styles';
import Button from '@/components/ui/better-button';
import { IconTrash } from '@tabler/icons-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Input from '@/components/ui/better-input';
import VectorLetterIcon from '../svgs/VectorSymbol';
import { Switch } from '@/components/ui/switch';
import { useOptionsStore } from '../../stores/useOptionsStore';
import { useURL } from '../../hooks/useURL';
import { compressVars } from '../../utils/encodeAndDecodeVariables';

type Props = {
    variable: Variable;
};

const toDeg = (rad: number) => (rad * 180) / Math.PI;
const toRad = (deg: number) => (deg * Math.PI) / 180;

function cartesianToPolar(x: number, y: number) {
    const angleRad = Math.atan2(y, x);
    const mag = Math.hypot(x, y);
    return { angleDeg: toDeg(angleRad), mag };
}

function polarToCartesian(angleDeg: number, mag: number) {
    const a = toRad(angleDeg);
    return { x: mag * Math.cos(a), y: mag * Math.sin(a) };
}

// parsea número o devuelve null si es inválido
const parseNum = (s: string): number | null => {
    if (s.trim() === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
};

export default function VariableCard({ variable }: Readonly<Props>) {
    const storeVariable = useVariablesStore((s) =>
        s.variables.find((v) => v.id === variable.id),
    );

    const updateVariable = useVariablesStore((s) => s.updateVariable);
    const deleteVariable = useVariablesStore((s) => s.deleteVariable);
    const acceleration = useOptionsStore((s) => s.inputs.acceleration);
    const { setURLParams } = useURL();

    const [error, setError] = useState<string>('');
    const [mode, setMode] = useState<'components' | 'polar'>('components');

    // estado local controlado
    const [nameText, setNameText] = useState<string>(variable.name);
    const [typeValue, setTypeValue] = useState<'velocity' | 'acceleration'>(
        variable.type,
    );

    const [xText, setXText] = useState<string>(String(variable.value.x));
    const [yText, setYText] = useState<string>(String(variable.value.y));

    const initialPolar = useMemo(() => {
        const { angleDeg, mag } = cartesianToPolar(
            variable.value.x,
            variable.value.y,
        );
        return {
            angleText: String(Number(angleDeg.toFixed(2))),
            magText: String(Number(mag.toFixed(2))),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // solo al montar

    const [angleText, setAngleText] = useState<string>(initialPolar.angleText);
    const [magText, setMagText] = useState<string>(initialPolar.magText);

    // sincroniza si cambia en el store (por otros componentes)
    useEffect(() => {
        if (!storeVariable) return;
        setNameText(storeVariable.name);
        setTypeValue(storeVariable.type);

        // cartesiano
        setXText(String(storeVariable.value.x));
        setYText(String(storeVariable.value.y));

        // polar derivado
        const { angleDeg, mag } = cartesianToPolar(
            storeVariable.value.x,
            storeVariable.value.y,
        );
        setAngleText(String(Number(angleDeg.toFixed(2))));
        setMagText(String(Number(mag.toFixed(2))));
    }, [storeVariable]);

    const safeUpdate = useCallback(
        (updates: {
            name?: string;
            type?: 'velocity' | 'acceleration';
            active?: boolean;
            value?: { x: number; y: number };
        }) => {
            try {
                updateVariable(variable.id, updates);
                setError('');
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Error desconocido',
                );
            }
        },
        [updateVariable, variable.id],
    );

    // ---- Handlers ----
    const handleNameChange = (v: string) => {
        setNameText(v);
        if (v.trim().length === 0)
            return setError('El nombre no puede estar vacío');
        if (v.length > 20)
            return setError('El nombre debe tener ≤ 20 caracteres');
        setError('');
        safeUpdate({ name: v });
    };

    const handleTypeChange = (val: 'velocity' | 'acceleration') => {
        setTypeValue(val);
        safeUpdate({ type: val });
    };

    // Actualiza store si x e y son válidos
    const pushCartesianIfValid = (xStr: string, yStr: string) => {
        const xNum = parseNum(xStr);
        const yNum = parseNum(yStr);
        if (xNum === null || yNum === null) {
            setError('x e y deben ser numéricos');
            return;
        }
        setError('');
        safeUpdate({ value: { x: xNum, y: yNum } });
    };

    const handleXChange = (v: string) => {
        setXText(v);
        pushCartesianIfValid(v, yText);
    };
    const handleYChange = (v: string) => {
        setYText(v);
        pushCartesianIfValid(xText, v);
    };

    // Actualiza store si ángulo y magnitud son válidos
    const pushPolarIfValid = (angStr: string, magStr: string) => {
        const a = parseNum(angStr);
        const m = parseNum(magStr);
        if (a === null || m === null) {
            setError('θ y m deben ser numéricos');
            return;
        }
        const { x, y } = polarToCartesian(a, m);
        setError('');
        safeUpdate({ value: { x, y } });
    };

    const handleAngleChange = (v: string) => {
        setAngleText(v);
        pushPolarIfValid(v, magText);
    };
    const handleMagChange = (v: string) => {
        setMagText(v);
        pushPolarIfValid(angleText, v);
    };

    const handleDelete = () => {
        try {
            deleteVariable(variable.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar');
        }
    };

    const handleBlur = () => {
        setURLParams({
            v: compressVars(useVariablesStore.getState().variables),
        });
    };

    return (
        <div className="flex flex-col gap-2 p-2 bg-[#202C25] rounded-lg">
            {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                    {error}
                </div>
            )}

            <div className="flex flex-row justify-between items-center gap-2">
                <Switch
                    checked={variable.active}
                    onCheckedChange={() =>
                        useVariablesStore.getState().toggleVariable(variable.id)
                    }
                />
                <input
                    type="text"
                    value={nameText}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nombre"
                    className={styles.input}
                    aria-label="Nombre de la variable"
                />

                <Select
                    value={typeValue}
                    onValueChange={(v) => {
                        handleTypeChange(v as 'velocity' | 'acceleration');
                        setURLParams({
                            v: compressVars(
                                useVariablesStore.getState().variables,
                            ),
                        });
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Tipo</SelectLabel>
                            <SelectItem value="velocity">Velocidad</SelectItem>
                            {acceleration && (
                                <SelectItem value="acceleration">
                                    Aceleración
                                </SelectItem>
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button
                    onClick={handleDelete}
                    tooltip="Eliminar Variable"
                    className="bg-[#712828]"
                    aria-label="Eliminar variable"
                >
                    <IconTrash
                        className={styles.icon + ' ' + 'text-[#CA6868]'}
                    />
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    onClick={() =>
                        setMode((m) =>
                            m === 'components' ? 'polar' : 'components',
                        )
                    }
                    tooltip={
                        mode === 'components'
                            ? 'Cambiar a entrada polar (θ°, m)'
                            : 'Cambiar a componentes (x, y)'
                    }
                    aria-label="Cambiar modo de entrada"
                >
                    <VectorLetterIcon
                        letter={nameText?.[0] ?? '?'}
                        className={styles.icon}
                    />
                </Button>

                {mode === 'components' ? (
                    <>
                        <Input
                            value={xText}
                            type="text"
                            prefix="x"
                            placeholder="0"
                            onChange={(e) => handleXChange(e.target.value)}
                            onBlur={handleBlur}
                            className="flex flex-1 w-full"
                        />
                        <Input
                            value={yText}
                            type="text"
                            prefix="y"
                            placeholder="0"
                            onChange={(e) => handleYChange(e.target.value)}
                            onBlur={handleBlur}
                            className="flex flex-1 w-full"
                        />
                    </>
                ) : (
                    <>
                        <Input
                            value={angleText}
                            type="text"
                            textPrefix="θ"
                            textSuffix="°"
                            placeholder="0"
                            onChange={(e) => handleAngleChange(e.target.value)}
                            onBlur={handleBlur}
                            className="flex flex-1 w-full"
                        />
                        <Input
                            value={magText}
                            type="text"
                            prefix="m"
                            placeholder="0"
                            onChange={(e) => handleMagChange(e.target.value)}
                            onBlur={handleBlur}
                            className="flex flex-1 w-full"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
