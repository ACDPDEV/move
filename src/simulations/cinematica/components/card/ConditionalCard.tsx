// ConditionalCard.tsx
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
    useConditionalsStore,
    type Condition,
    createUnit,
    createLogicExpression,
    ExpressionUtils,
} from '../../stores/useConditionalsStore';
import { useVariablesStore } from '../../stores/useVariablesStore';
import styles from '../../consts/styles';
import Button from '../ui/button';
import { IconTrash, IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Input from '../ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type Props = {
    condition: Condition;
};

const parseNum = (s: string): number | null => {
    if (s.trim() === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
};

export default function ConditionalCard({ condition }: Readonly<Props>) {
    const storeCondition = useConditionalsStore((s) =>
        s.conditionals.find((c) => c.id === condition.id),
    );

    const updateConditional = useConditionalsStore((s) => s.updateConditional);
    const removeConditional = useConditionalsStore((s) => s.removeConditional);
    const evaluateConditional = useConditionalsStore(
        (s) => s.evaluateConditional,
    );
    const variables = useVariablesStore((s) => s.variables);

    // Estado local
    const [error, setError] = useState<string>('');
    const [nameText, setNameText] = useState<string>(condition.name || '');
    const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

    // Estados para crear una expresión simple (Unit)
    const [var1Text, setVar1Text] = useState<string>('0');
    const [operatorValue, setOperatorValue] = useState<string>('==');
    const [var2Text, setVar2Text] = useState<string>('0');

    // Sincronizar con el store
    useEffect(() => {
        if (!storeCondition) return;
        setNameText(storeCondition.name || '');
        if (storeCondition.error) {
            setError(storeCondition.error);
        } else {
            setError('');
        }
    }, [storeCondition]);

    const safeUpdate = useCallback(
        (updates: Partial<Omit<Condition, 'id'>>) => {
            try {
                updateConditional(condition.id, updates);
                setError('');
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Error desconocido',
                );
            }
        },
        [updateConditional, condition.id],
    );

    // Handlers
    const handleNameChange = (v: string) => {
        setNameText(v);
        if (v.length > 30) {
            return setError('El nombre debe tener ≤ 30 caracteres');
        }
        setError('');
        safeUpdate({ name: v });
    };

    const handleDelete = () => {
        try {
            removeConditional(condition.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar');
        }
    };

    const handleEvaluate = async () => {
        setIsEvaluating(true);
        try {
            const result = evaluateConditional(condition.id);
            if (result === null) {
                setError('No se pudo evaluar la condición');
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Error en evaluación',
            );
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleCreateSimpleExpression = () => {
        const var1 = parseNum(var1Text);
        const var2 = parseNum(var2Text);

        if (var1 === null || var2 === null) {
            setError('Ambas variables deben ser números válidos');
            return;
        }

        const newExpression = createUnit(var1, operatorValue as any, var2);

        safeUpdate({ expression: newExpression });
        setError('');
    };

    const getResultBadge = () => {
        if (!storeCondition) return null;

        if (storeCondition.result === undefined) {
            return <Badge variant="secondary">No evaluado</Badge>;
        }

        return storeCondition.result ? (
            <Badge variant="default" className="bg-green-600">
                Verdadero
            </Badge>
        ) : (
            <Badge variant="destructive">Falso</Badge>
        );
    };

    const getValidationBadge = () => {
        if (!storeCondition) return null;

        return storeCondition.isValid ? (
            <Badge
                variant="outline"
                className="text-green-400 border-green-400"
            >
                Válido
            </Badge>
        ) : (
            <Badge variant="outline" className="text-red-400 border-red-400">
                Inválido
            </Badge>
        );
    };

    return (
        <div className="flex flex-col gap-3 p-3 bg-[#202C25] rounded-lg border border-stone-700">
            {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-row justify-between items-center gap-2">
                <input
                    type="text"
                    value={nameText}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nombre de la condición"
                    className={`${styles.input} flex-1`}
                    aria-label="Nombre de la condición"
                />

                <div className="flex gap-2">
                    {getValidationBadge()}
                    {getResultBadge()}
                </div>

                <Button
                    onClick={handleDelete}
                    tooltip="Eliminar Condición"
                    className="bg-[#712828]"
                    aria-label="Eliminar condición"
                >
                    <IconTrash className={`${styles.icon} text-[#CA6868]`} />
                </Button>
            </div>

            {/* Simple Expression Builder */}
            <div className="flex flex-col gap-2">
                <div className="text-sm text-stone-400">
                    Crear expresión simple:
                </div>

                <div className="flex items-center gap-2">
                    <Input
                        value={var1Text}
                        type="text"
                        placeholder="Variable 1"
                        onChange={(e) => setVar1Text(e.target.value)}
                        className="flex-1"
                    />

                    <Select
                        value={operatorValue}
                        onValueChange={setOperatorValue}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="==">=</SelectItem>
                                <SelectItem value="!=">≠</SelectItem>
                                <SelectItem value=">">&gt;</SelectItem>
                                <SelectItem value="<">&lt;</SelectItem>
                                <SelectItem value=">=">&gt;=</SelectItem>
                                <SelectItem value="<=">&lt;=</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Input
                        value={var2Text}
                        type="text"
                        placeholder="Variable 2"
                        onChange={(e) => setVar2Text(e.target.value)}
                        className="flex-1"
                    />

                    <Button
                        onClick={handleCreateSimpleExpression}
                        tooltip="Crear expresión"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Crear
                    </Button>
                </div>
            </div>

            {/* Expression Display */}
            {storeCondition?.expression && (
                <div className="bg-stone-800/50 p-2 rounded text-sm">
                    <div className="text-stone-400 mb-1">Expresión actual:</div>
                    <div className="font-mono text-stone-200">
                        {ExpressionUtils.isUnit(storeCondition.expression)
                            ? `${storeCondition.expression.var1} ${storeCondition.expression.mathOperator} ${storeCondition.expression.var2}`
                            : 'Expresión compleja'}
                    </div>
                </div>
            )}

            {/* Evaluate Button */}
            <div className="flex justify-center">
                <Button
                    onClick={handleEvaluate}
                    disabled={!storeCondition?.isValid || isEvaluating}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-stone-600"
                    tooltip="Evaluar condición"
                >
                    {isEvaluating ? (
                        <IconPlayerStop className={styles.icon} />
                    ) : (
                        <IconPlayerPlay className={styles.icon} />
                    )}
                    {isEvaluating ? 'Evaluando...' : 'Evaluar'}
                </Button>
            </div>
        </div>
    );
}

// Hook para comprimir condicionales (similar a variables)
export const compressConditionals = (conditionals: Condition[]): string => {
    try {
        return btoa(JSON.stringify(conditionals));
    } catch {
        return '';
    }
};

export const decompressConditionals = (compressed: string): Condition[] => {
    try {
        return JSON.parse(atob(compressed));
    } catch {
        return [];
    }
};
