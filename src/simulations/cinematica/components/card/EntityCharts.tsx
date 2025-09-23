'use client';
import React, { useMemo, useState } from 'react';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useEntityStore } from '../../stores/useEntityStore';
import { useVariablesStore } from '../../stores/useVariablesStore';
import type { Variable } from '../../stores/useVariablesStore';
import { Vector2D } from '@/simulations/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface EntityChartsProps {
    entityId: string;
    color: string;
}

// Formateo de números (notación científica cuando conviene)
const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.001 && num !== 0) {
        return num.toExponential(2);
    }
    if (Math.abs(num) > 10000) {
        return num.toExponential(2);
    }
    return num.toFixed(2);
};

const EntityCharts = ({ entityId, color }: EntityChartsProps) => {
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

    // Entidad objetivo (puede ser undefined si no existe)
    const entity = useEntityStore((state) =>
        state.entities.find((e) => e.id === entityId),
    );

    // 1) Leemos el array completo de variables desde el store (un solo argumento)
    const variables = useVariablesStore((state) => state.variables);

    // 2) Derivamos activeVariables con useMemo (tipado claro gracias a `Variable`)
    const activeVariables = useMemo(
        () => variables.filter((v: Variable) => v.active),
        [variables],
    );

    // Calcular las resultantes (velocidad y aceleración) aplicando variables activas
    const resultantValues = useMemo(() => {
        if (!entity) return null;

        // Usamos copias para no mutar el estado original del store/entity
        let velocityResultant: Vector2D = entity.velocity.copy();
        let accelerationResultant: Vector2D = entity.acceleration.copy();

        activeVariables.forEach((variable: Variable) => {
            if (variable.type === 'velocity') {
                // Si add muta el objeto, estamos operando sobre las copias
                velocityResultant = velocityResultant.add(variable.value);
            }
            if (variable.type === 'acceleration') {
                accelerationResultant = accelerationResultant.add(
                    variable.value,
                );
            }
        });

        return {
            velocity: velocityResultant,
            acceleration: accelerationResultant,
        };
    }, [entity?.velocity, entity?.acceleration, activeVariables, entity]);

    // Generar datos de predicción para las gráficas
    const chartData = useMemo(() => {
        if (!entity || !resultantValues) return [];

        const timePoints: Array<Record<string, number>> = [];
        const maxTime = 10;
        const steps = 50;

        const {
            velocity: resultantVelocity,
            acceleration: resultantAcceleration,
        } = resultantValues;

        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * maxTime;

            const positionX =
                entity.position.x +
                resultantVelocity.x * t +
                0.5 * resultantAcceleration.x * t * t;
            const positionY =
                entity.position.y +
                resultantVelocity.y * t +
                0.5 * resultantAcceleration.y * t * t;

            const velocityX = resultantVelocity.x + resultantAcceleration.x * t;
            const velocityY = resultantVelocity.y + resultantAcceleration.y * t;

            const accelerationX = resultantAcceleration.x;
            const accelerationY = resultantAcceleration.y;

            timePoints.push({
                time: t,
                positionX,
                positionY,
                velocityX,
                velocityY,
                accelerationX,
                accelerationY,
                positionmag: Math.sqrt(positionX ** 2 + positionY ** 2),
                velocitymag: Math.sqrt(velocityX ** 2 + velocityY ** 2),
                accelerationmag: Math.sqrt(
                    accelerationX ** 2 + accelerationY ** 2,
                ),
            });
        }

        return timePoints;
    }, [entity?.position, resultantValues, entity]);

    // Análisis de la función (vértices, ceros, etc.)
    const analysis = useMemo(() => {
        if (!entity || !resultantValues || chartData.length === 0) return null;

        const {
            velocity: resultantVelocity,
            acceleration: resultantAcceleration,
        } = resultantValues;

        const posAnalysis = {
            vertex: null as { t: number; value: number } | null,
            roots: [] as number[],
            domain: 'ℝ (todos los reales)',
            range: 'ℝ (todos los reales)',
            stopsX: null as number | null,
            stopsY: null as number | null,
        };

        // Analizamos magnitudes para posición (componente radial)
        const accMag = resultantAcceleration.mag();
        const velMag = resultantVelocity.mag();
        if (accMag !== 0) {
            const tVertex = -velMag / accMag;
            // solo consideramos vértice en t >= 0
            if (tVertex >= 0) {
                const posMag = entity.position.mag();
                const vertexValue =
                    posMag +
                    velMag * tVertex +
                    0.5 * accMag * tVertex * tVertex;
                posAnalysis.vertex = { t: tVertex, value: vertexValue };
            }
        }

        if (resultantAcceleration.x !== 0) {
            const stopTimeX = -resultantVelocity.x / resultantAcceleration.x;
            if (stopTimeX >= 0) posAnalysis.stopsX = stopTimeX;
        }

        if (resultantAcceleration.y !== 0) {
            const stopTimeY = -resultantVelocity.y / resultantAcceleration.y;
            if (stopTimeY >= 0) posAnalysis.stopsY = stopTimeY;
        }

        const velAnalysis = {
            slope: accMag,
            yIntercept: velMag,
            domain: 'ℝ (todos los reales)',
            range: 'ℝ (todos los reales)',
            zeroTime: null as number | null,
        };

        if (accMag !== 0) {
            const zeroTime = -velMag / accMag;
            if (zeroTime >= 0) velAnalysis.zeroTime = zeroTime;
        }

        return {
            position: posAnalysis,
            velocity: velAnalysis,
            resultantVelocity,
            resultantAcceleration,
        };
    }, [entity, resultantValues, chartData]);

    if (!entity || !resultantValues) return null;

    const gradientId = `gradient-${entityId}`;
    const formatTick = (value: number) => formatNumber(value);

    return (
        <div
            className="border-2 rounded-lg p-6 space-y-6 dark:bg-stone-900"
            style={{ borderColor: color }}
        >
            {/* Gráfica de Posición */}
            <div className="space-y-3 relative mb-8">
                <div
                    className="h-48 w-full pl-8"
                    style={{ width: '350px', height: '192px' }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id={`${gradientId}-position`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={color}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={color}
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                tickFormatter={formatTick}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                tickFormatter={formatTick}
                                width={40}
                            />
                            <Area
                                type="monotone"
                                dataKey="positionmag"
                                stroke={color}
                                strokeWidth={2}
                                fill={`url(#${gradientId}-position)`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 text-center pl-8">
                    Tiempo (s)
                </div>
                <div className="absolute left-0 top-24 transform -rotate-90 text-xs text-stone-500 dark:text-stone-400 origin-center whitespace-nowrap">
                    Posición
                </div>
            </div>

            <Separator className="my-6" />

            {/* Gráfica de Velocidad */}
            <div className="space-y-3 relative mb-8">
                <div
                    className="h-48 w-full pl-8"
                    style={{ width: '350px', height: '192px' }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id={`${gradientId}-velocity`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={color}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={color}
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                tickFormatter={formatTick}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                tickFormatter={formatTick}
                                width={40}
                            />
                            <Area
                                type="monotone"
                                dataKey="velocitymag"
                                stroke={color}
                                strokeWidth={2}
                                fill={`url(#${gradientId}-velocity)`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 text-center pl-8">
                    Tiempo (s)
                </div>
                <div className="absolute left-0 top-24 transform -rotate-90 text-xs text-stone-500 dark:text-stone-400 origin-center whitespace-nowrap">
                    Velocidad
                </div>
            </div>

            <Separator className="my-6" />

            {/* Gráfica de Aceleración */}
            <div className="space-y-2 relative">
                <div
                    className="h-40 w-full"
                    style={{ width: '350px', height: '192px' }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 60, bottom: 35 }}
                        >
                            <defs>
                                <linearGradient
                                    id={`${gradientId}-acceleration`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor={color}
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={color}
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                tickFormatter={formatTick}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: 'currentColor' }}
                                tickFormatter={formatTick}
                                width={50}
                            />
                            <Area
                                type="monotone"
                                dataKey="accelerationmag"
                                stroke={color}
                                strokeWidth={2}
                                fill={`url(#${gradientId}-acceleration)`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Tiempo (s)
                </div>
                <div className="absolute left-2 top-20 transform -rotate-90 text-xs text-gray-500 dark:text-gray-400 origin-center">
                    Aceleración
                </div>
            </div>

            <Separator className="my-6" />

            {/* Análisis de función desplegable */}
            <Collapsible open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
                <CollapsibleTrigger className="flex items-center space-x-2 text-sm font-medium hover:text-opacity-80 dark:text-white w-full justify-start">
                    {isAnalysisOpen ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                    <span>Análisis de Función</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                    {analysis && (
                        <>
                            {/* Valores Resultantes */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                <h5 className="text-sm font-semibold mb-2 text-green-800 dark:text-green-200">
                                    Valores Resultantes (con variables)
                                </h5>
                                <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                                    <div className="flex justify-between">
                                        <span>Velocidad resultante:</span>
                                        <span>
                                            (
                                            {formatNumber(
                                                analysis.resultantVelocity.x,
                                            )}
                                            ,{' '}
                                            {formatNumber(
                                                analysis.resultantVelocity.y,
                                            )}
                                            ) m/s
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Aceleración resultante:</span>
                                        <span>
                                            (
                                            {formatNumber(
                                                analysis.resultantAcceleration
                                                    .x,
                                            )}
                                            ,{' '}
                                            {formatNumber(
                                                analysis.resultantAcceleration
                                                    .y,
                                            )}
                                            ) m/s²
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Magnitud vel. resultante:</span>
                                        <span>
                                            {formatNumber(
                                                analysis.resultantVelocity.mag(),
                                            )}{' '}
                                            m/s
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Magnitud accel. resultante:</span>
                                        <span>
                                            {formatNumber(
                                                analysis.resultantAcceleration.mag(),
                                            )}{' '}
                                            m/s²
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Posición */}
                            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-3">
                                <h5 className="text-sm font-semibold mb-2 dark:text-white">
                                    Posición
                                </h5>
                                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                                    <div className="flex justify-between">
                                        <span>Dominio:</span>
                                        <span>{analysis.position.domain}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Rango:</span>
                                        <span>{analysis.position.range}</span>
                                    </div>
                                    {analysis.position.vertex && (
                                        <div className="flex justify-between">
                                            <span>Vértice:</span>
                                            <span>
                                                t ={' '}
                                                {formatNumber(
                                                    analysis.position.vertex.t,
                                                )}
                                                s, pos ={' '}
                                                {formatNumber(
                                                    analysis.position.vertex
                                                        .value,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {analysis.position.stopsX !== null && (
                                        <div className="flex justify-between">
                                            <span>Se detiene en X:</span>
                                            <span>
                                                t ={' '}
                                                {formatNumber(
                                                    analysis.position.stopsX,
                                                )}
                                                s
                                            </span>
                                        </div>
                                    )}
                                    {analysis.position.stopsY !== null && (
                                        <div className="flex justify-between">
                                            <span>Se detiene en Y:</span>
                                            <span>
                                                t ={' '}
                                                {formatNumber(
                                                    analysis.position.stopsY,
                                                )}
                                                s
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Velocidad */}
                            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-3">
                                <h5 className="text-sm font-semibold mb-2 dark:text-white">
                                    Velocidad
                                </h5>
                                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                                    <div className="flex justify-between">
                                        <span>Pendiente:</span>
                                        <span>
                                            {formatNumber(
                                                analysis.velocity.slope,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Intersección Y:</span>
                                        <span>
                                            {formatNumber(
                                                analysis.velocity.yIntercept,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Dominio:</span>
                                        <span>{analysis.velocity.domain}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Rango:</span>
                                        <span>{analysis.velocity.range}</span>
                                    </div>
                                    {analysis.velocity.zeroTime !== null && (
                                        <div className="flex justify-between">
                                            <span>Velocidad = 0:</span>
                                            <span>
                                                t ={' '}
                                                {formatNumber(
                                                    analysis.velocity.zeroTime,
                                                )}
                                                s
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Aceleración */}
                            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-3">
                                <h5 className="text-sm font-semibold mb-2 dark:text-white">
                                    Aceleración
                                </h5>
                                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                                    <div className="flex justify-between">
                                        <span>Valor constante:</span>
                                        <span>
                                            {formatNumber(
                                                analysis.resultantAcceleration.mag(),
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tipo:</span>
                                        <span>Función constante</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Dominio:</span>
                                        <span>ℝ (todos los reales)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Rango:</span>
                                        <span>
                                            {formatNumber(
                                                analysis.resultantAcceleration.mag(),
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default EntityCharts;
