'use client';
import React, { useMemo, useState } from 'react';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useEntityStore } from '@/simulations/cinematica/stores/useEntityStore';
import { useVariablesStore } from '@/simulations/cinematica/stores/useVariablesStore';
import type { Variable } from '@/simulations/cinematica/stores/useVariablesStore';
import { Separator } from '@/components/ui/separator';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { scientificNotation } from '@/simulations/lib/math';

interface EntityChartsProps {
    entityId: string;
    color: string;
}

function Graph({
    type,
    chartData,
    gradientId,
    color,
    formatTick,
    axisXName,
    axisYName,
}: {
    type: 'position' | 'velocity' | 'acceleration';
    chartData: Record<string, number>[];
    gradientId: string;
    color: string;
    formatTick: (value: number) => string;
    axisXName: string;
    axisYName: string;
}) {
    return (
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
                                id={`${gradientId}-${type}`}
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
                            dataKey={`${type}mag`}
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#${gradientId}-${type})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 text-center pl-8">
                {axisXName}
            </div>
            <div className="absolute left-0 top-24 transform -rotate-90 text-xs text-stone-500 dark:text-stone-400 origin-center whitespace-nowrap">
                {axisYName}
            </div>
        </div>
    );
}

const EntityCharts = ({ entityId, color }: EntityChartsProps) => {
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const entity = useEntityStore((state) =>
        state.entities.find((e) => e.id === entityId),
    );
    const variables = useVariablesStore((state) => state.variables);

    const activeVariables = useMemo(
        () => variables.filter((v: Variable) => v.active),
        [variables],
    );

    // Calcular las resultantes (velocidad y aceleración) aplicando variables activas
    const resultantValues = useMemo(() => {
        if (!entity) return null;

        // Usamos copias para no mutar el estado original del store/entity
        let resultingVelocity = entity.velocity.copy();
        let resultingAcceleration = entity.acceleration.copy();

        activeVariables.forEach((variable: Variable) => {
            if (variable.type === 'velocity') {
                resultingVelocity = resultingVelocity.add(variable.value);
            }
            if (variable.type === 'acceleration') {
                resultingAcceleration = resultingAcceleration.add(
                    variable.value,
                );
            }
        });

        return {
            resultingVelocity,
            resultingAcceleration,
        };
    }, [activeVariables, entity]);

    // Generar datos de predicción para las gráficas
    const chartData = useMemo(() => {
        if (!entity || !resultantValues) return [];

        const timePoints: Array<Record<string, number>> = [];
        const maxTime = 10;
        const steps = 50;

        const { resultingVelocity, resultingAcceleration } = resultantValues;

        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * maxTime;

            const positionX =
                entity.position.x +
                resultingVelocity.x * t +
                0.5 * resultingAcceleration.x * t * t;
            const positionY =
                entity.position.y +
                resultingVelocity.y * t +
                0.5 * resultingAcceleration.y * t * t;

            const velocityX = resultingVelocity.x + resultingAcceleration.x * t;
            const velocityY = resultingVelocity.y + resultingAcceleration.y * t;

            const accelerationX = resultingAcceleration.x;
            const accelerationY = resultingAcceleration.y;

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
    }, [resultantValues, entity]);

    // Análisis de la función (vértices, ceros, etc.)
    const analysis = useMemo(() => {
        if (!entity || !resultantValues || chartData.length === 0) return null;

        const { resultingVelocity, resultingAcceleration } = resultantValues;

        const posAnalysis = {
            vertex: null as { t: number; value: number } | null,
            roots: [] as number[],
            domain: 'ℝ (todos los reales)',
            range: 'ℝ (todos los reales)',
            stopsX: null as number | null,
            stopsY: null as number | null,
        };

        // Analizamos magnitudes para posición (componente radial)
        const accMag = resultingAcceleration.mag();
        const velMag = resultingVelocity.mag();
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

        if (resultingAcceleration.x !== 0) {
            const stopTimeX = -resultingVelocity.x / resultingAcceleration.x;
            if (stopTimeX >= 0) posAnalysis.stopsX = stopTimeX;
        }

        if (resultingAcceleration.y !== 0) {
            const stopTimeY = -resultingVelocity.y / resultingAcceleration.y;
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
            resultingVelocity,
            resultingAcceleration,
        };
    }, [entity, resultantValues, chartData]);

    if (!entity || !resultantValues) return null;

    const gradientId = `gradient-${entityId}`;
    const formatTick = (value: number) => scientificNotation(value);

    return (
        <div
            className="border-2 rounded-lg p-6 space-y-6 dark:bg-stone-900"
            style={{ borderColor: color }}
        >
            {/* Gráfica de Posición */}
            <Graph
                type="position"
                chartData={chartData}
                gradientId={gradientId}
                color={color}
                formatTick={formatTick}
                axisXName="Tiempo (s)"
                axisYName="Posición"
            />

            <Separator className="my-6" />

            {/* Gráfica de Velocidad */}
            <Graph
                type="velocity"
                chartData={chartData}
                gradientId={gradientId}
                color={color}
                formatTick={formatTick}
                axisXName="Tiempo (s)"
                axisYName="Velocidad"
            />

            <Separator className="my-6" />

            {/* Gráfica de Aceleración */}
            <Graph
                type="acceleration"
                chartData={chartData}
                gradientId={gradientId}
                color={color}
                formatTick={formatTick}
                axisXName="Tiempo (s)"
                axisYName="Aceleración"
            />

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
                                            {scientificNotation(
                                                analysis.resultingVelocity.x,
                                            )}
                                            ,{' '}
                                            {scientificNotation(
                                                analysis.resultingVelocity.y,
                                            )}
                                            ) m/s
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Aceleración resultante:</span>
                                        <span>
                                            (
                                            {scientificNotation(
                                                analysis.resultingAcceleration
                                                    .x,
                                            )}
                                            ,{' '}
                                            {scientificNotation(
                                                analysis.resultingAcceleration
                                                    .y,
                                            )}
                                            ) m/s²
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Magnitud vel. resultante:</span>
                                        <span>
                                            {scientificNotation(
                                                analysis.resultingVelocity.mag(),
                                            )}{' '}
                                            m/s
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Magnitud accel. resultante:</span>
                                        <span>
                                            {scientificNotation(
                                                analysis.resultingAcceleration.mag(),
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
                                                {scientificNotation(
                                                    analysis.position.vertex.t,
                                                )}
                                                s, pos ={' '}
                                                {scientificNotation(
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
                                                {scientificNotation(
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
                                                {scientificNotation(
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
                                            {scientificNotation(
                                                analysis.velocity.slope,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Intersección Y:</span>
                                        <span>
                                            {scientificNotation(
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
                                                {scientificNotation(
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
                                            {scientificNotation(
                                                analysis.resultingAcceleration.mag(),
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
                                            {scientificNotation(
                                                analysis.resultingAcceleration.mag(),
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
