'use client';
import React, { useMemo, useState } from 'react';
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useEntityStore } from '../stores/useEntityStore';
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

// Función para formatear números en notación científica cuando es necesario
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
    const entity = useEntityStore((state) =>
        state.entities.find((e) => e.id === entityId),
    );

    // Generar datos de predicción para las gráficas
    const chartData = useMemo(() => {
        if (!entity) return [];

        const timePoints = [];
        const maxTime = 10;
        const steps = 50;

        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * maxTime;

            const positionX =
                entity.position.x +
                entity.velocity.x * t +
                0.5 * entity.acceleration.x * t * t;
            const positionY =
                entity.position.y +
                entity.velocity.y * t +
                0.5 * entity.acceleration.y * t * t;

            const velocityX = entity.velocity.x + entity.acceleration.x * t;
            const velocityY = entity.velocity.y + entity.acceleration.y * t;

            const accelerationX = entity.acceleration.x;
            const accelerationY = entity.acceleration.y;

            timePoints.push({
                time: t,
                positionX: positionX,
                positionY: positionY,
                velocityX: velocityX,
                velocityY: velocityY,
                accelerationX: accelerationX,
                accelerationY: accelerationY,
                positionMagnitude: Math.sqrt(
                    positionX * positionX + positionY * positionY,
                ),
                velocityMagnitude: Math.sqrt(
                    velocityX * velocityX + velocityY * velocityY,
                ),
                accelerationMagnitude: Math.sqrt(
                    accelerationX * accelerationX +
                        accelerationY * accelerationY,
                ),
            });
        }

        return timePoints;
    }, [entity]);

    // Análisis de la función
    const analysis = useMemo(() => {
        if (!entity || chartData.length === 0) return null;

        const { position, velocity, acceleration } = entity;

        // Cálculos para posición (función cuadrática)
        const posAnalysis = {
            vertex: null as { t: number; value: number } | null,
            roots: [] as number[],
            domain: 'ℝ (todos los reales)',
            range: 'ℝ (todos los reales)',
            stopsX: null as number | null,
            stopsY: null as number | null,
        };

        // Vértice para posición (si hay aceleración)
        if (acceleration.x !== 0 || acceleration.y !== 0) {
            const accMag = Math.sqrt(
                acceleration.x * acceleration.x +
                    acceleration.y * acceleration.y,
            );
            const velMag = Math.sqrt(
                velocity.x * velocity.x + velocity.y * velocity.y,
            );
            if (accMag !== 0) {
                const tVertex = -velMag / accMag;
                if (tVertex >= 0) {
                    const posMag = Math.sqrt(
                        position.x * position.x + position.y * position.y,
                    );
                    const vertexValue =
                        posMag +
                        velMag * tVertex +
                        0.5 * accMag * tVertex * tVertex;
                    posAnalysis.vertex = { t: tVertex, value: vertexValue };
                }
            }
        }

        // Cuándo se detiene en X
        if (acceleration.x !== 0) {
            const stopTimeX = -velocity.x / acceleration.x;
            if (stopTimeX >= 0) posAnalysis.stopsX = stopTimeX;
        }

        // Cuándo se detiene en Y
        if (acceleration.y !== 0) {
            const stopTimeY = -velocity.y / acceleration.y;
            if (stopTimeY >= 0) posAnalysis.stopsY = stopTimeY;
        }

        // Análisis para velocidad (función lineal)
        const velAnalysis = {
            slope: Math.sqrt(
                acceleration.x * acceleration.x +
                    acceleration.y * acceleration.y,
            ),
            yIntercept: Math.sqrt(
                velocity.x * velocity.x + velocity.y * velocity.y,
            ),
            domain: 'ℝ (todos los reales)',
            range: 'ℝ (todos los reales)',
            zeroTime: null as number | null,
        };

        // Cuándo la velocidad es cero
        const velMag = Math.sqrt(
            velocity.x * velocity.x + velocity.y * velocity.y,
        );
        const accMag = Math.sqrt(
            acceleration.x * acceleration.x + acceleration.y * acceleration.y,
        );
        if (accMag !== 0) {
            const zeroTime = -velMag / accMag;
            if (zeroTime >= 0) velAnalysis.zeroTime = zeroTime;
        }

        return { position: posAnalysis, velocity: velAnalysis };
    }, [entity, chartData]);

    if (!entity) return null;

    const gradientId = `gradient-${entityId}`;

    // Función personalizada para formatear ticks
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
                                dataKey="positionMagnitude"
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
                                dataKey="velocityMagnitude"
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

            <Separator className="my-4" />

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
                                dataKey="accelerationMagnitude"
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
                            {/* Análisis de Posición */}
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

                            {/* Análisis de Velocidad */}
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

                            {/* Análisis de Aceleración */}
                            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-3">
                                <h5 className="text-sm font-semibold mb-2 dark:text-white">
                                    Aceleración
                                </h5>
                                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                                    <div className="flex justify-between">
                                        <span>Valor constante:</span>
                                        <span>
                                            {formatNumber(
                                                Math.sqrt(
                                                    entity.acceleration.x *
                                                        entity.acceleration.x +
                                                        entity.acceleration.y *
                                                            entity.acceleration
                                                                .y,
                                                ),
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
                                                Math.sqrt(
                                                    entity.acceleration.x *
                                                        entity.acceleration.x +
                                                        entity.acceleration.y *
                                                            entity.acceleration
                                                                .y,
                                                ),
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
export { EntityCharts };
