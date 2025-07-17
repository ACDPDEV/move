import { Vector2D } from '@/simulations/lib/utils';
import { useMemo, useState } from 'react';
import { Movil, type IMovilProps } from '@/simulations/cinematica/entities/Movil';
import { IconLayoutSidebarLeftCollapseFilled, IconLayoutSidebarRightCollapseFilled, IconPlus, IconTrash } from '@tabler/icons-react';
import { AxisVectorInput } from './CoordinatesInput';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    entities: Movil[];
    onEntityChange: (id: string, updates: Partial<Movil>) => void;
    onEntityDelete: (id: string) => void;
}

/**
 * Componente Sidebar para la configuración de entidades
 * Permite ver y editar las propiedades de los móviles en la simulación
 */
function Sidebar({
    isOpen,
    onToggle,
    entities,
    onEntityChange,
    onEntityDelete
}: SidebarProps) {
    // Estado local para los inputs de radio, color y vectoriales por entidad
    const [radiusInputs, setRadiusInputs] = useState<{ [id: string]: string }>({});
    const [colorInputs, setColorInputs] = useState<{ [id: string]: string }>({});
    type VectorInputsType = {
        [id: string]: {
            position?: { x?: string; y?: string };
            velocity?: { x?: string; y?: string };
            acceleration?: { x?: string; y?: string };
        };
    };
    const [vectorInputs, setVectorInputs] = useState<VectorInputsType>({});

    /**
     * Maneja la adición de una nueva entidad
     */
    const handleAddEntity = () => {
        if (!onEntityChange) return;
        
        const newEntityId = `movil-${Date.now()}`;
        
        // Llamar directamente a onEntityChange con las propiedades necesarias
        onEntityChange(newEntityId, {
            position: new Vector2D(Math.random() * 800, Math.random() * 600),
            velocity: new Vector2D(Math.random() * 800, Math.random() * 600),
            acceleration: new Vector2D(Math.random() * 800, Math.random() * 600),
            radius: 15,
            color: "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
        });
    };

    /**
     * Maneja la eliminación de una entidad
     */
    const handleDeleteEntity = (entityId: string) => {
        if (onEntityDelete) {
            onEntityDelete(entityId);
        }
    };

    /**
     * Maneja los cambios en los valores de entrada
     */
    const handleInputChange = (
        entityId: string, 
        property: keyof IMovilProps, 
        value: number | string,
        vectorComponent?: 'x' | 'y'
    ) => {
        if (!onEntityChange) return;

        const entity = entities.find(e => e.id === entityId);
        if (!entity) return;

        const updates: Partial<Movil> = {};

        if (vectorComponent && (property === 'position' || property === 'velocity' || property === 'acceleration')) {
            if (value === "") return;
            const currentVector = entity[property] as Vector2D;
            const newVector = new Vector2D(
                vectorComponent === 'x' ? Number(value) : currentVector.x,
                vectorComponent === 'y' ? Number(value) : currentVector.y
            );
            updates[property] = newVector;
        } else if (property === 'radius') {
            if (value === "") return;
            updates.radius = Number(value);
        } else if (property === 'color') {
            if (value === "") return;
            updates.color = String(value);
        }

        onEntityChange(entityId, updates);
    };

    const reverseEntities = useMemo(() => entities.slice().reverse(), [entities]);

    return (
        <>
            {/* Botón de toggle */}
            <button 
                onClick={onToggle}
                className="p-2 rounded-full hover:bg-stone-800 transition-colors absolute top-4 right-4 z-10"
                aria-label={isOpen ? "Ocultar panel" : "Mostrar panel"}
            >
                {isOpen ? (
                    <IconLayoutSidebarRightCollapseFilled size={24} />
                ) : (
                    <IconLayoutSidebarLeftCollapseFilled size={24} />
                )}
            </button>

            {/* Panel lateral */}
            <nav
                className={`fixed top-0 right-0 h-full bg-stone-900 border-l border-stone-700 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ width: '400px' }}
            >
                <div className="p-4 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Control de Móviles</h2>
                    </div>

                    <button 
                        onClick={handleAddEntity}
                        className="p-2 w-full rounded-md hover:bg-stone-700 border border-stone-600 transition-colors bg-stone-800 text-white mb-2"
                        aria-label="Añadir móvil"
                        title="Agregar nuevo móvil"
                    >
                        <span className="flex items-center gap-2">
                            <IconPlus />
                            Añadir Móvil
                        </span>
                    </button>
                    {reverseEntities.length > 0 ? (
                        <div className="space-y-4">
                            {reverseEntities.map((entity, index) => (
                                <div key={entity.id || index} className="bg-stone-800 p-4 rounded-lg border border-stone-700">
                                    {/* Header de la entidad */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-white">
                                            Móvil {reverseEntities.length - index}
                                        </h3>
                                        <button
                                            onClick={() => handleDeleteEntity(entity.id!)}
                                            className="p-1 rounded hover:bg-red-600 transition-colors text-red-400 hover:text-white"
                                            aria-label="Eliminar móvil"
                                            title="Eliminar móvil"
                                        >
                                            <IconTrash size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Posición */}
                                        {/* Posición */}
                                        <AxisVectorInput 
                                            typeVector="position" 
                                            entity={entity} 
                                            handleInputChange={(id, property, value, vectorComponent) => {
                                                // Guardar valor local SOLO para propiedades vectoriales
                                                if (property === 'position' || property === 'velocity' || property === 'acceleration') {
                                                    setVectorInputs(inputs => ({
                                                        ...inputs,
                                                        [id]: {
                                                            ...inputs[id],
                                                            [property]: {
                                                                ...((inputs[id]?.[property as 'position' | 'velocity' | 'acceleration']) ?? {}),
                                                                [vectorComponent!]: value === '' ? '' : String(value)
                                                            }
                                                        }
                                                    }));
                                                }
                                            }}
                                            vectorInputs={vectorInputs[entity.id!]?.position}
                                            onBlurVector={(id, property, value, vectorComponent) => {
                                                if (value !== '' && !isNaN(Number(value))) {
                                                    handleInputChange(id, property, Number(value), vectorComponent);
                                                }
                                                setVectorInputs(inputs => {
                                                    const copy = { ...inputs };
                                                    if (copy[id] && copy[id][property as 'position' | 'velocity' | 'acceleration']) {
                                                        copy[id][property as 'position' | 'velocity' | 'acceleration'] = {
                                                            ...copy[id][property as 'position' | 'velocity' | 'acceleration'],
                                                            [vectorComponent!]: undefined
                                                        };
                                                    }
                                                    return copy;
                                                });
                                            }}
                                        />
                                        {/* Velocidad */}
                                        <AxisVectorInput 
                                            typeVector="velocity" 
                                            entity={entity} 
                                            handleInputChange={(id, property, value, vectorComponent) => {
                                                if (property === 'position' || property === 'velocity' || property === 'acceleration') {
                                                    setVectorInputs(inputs => ({
                                                        ...inputs,
                                                        [id]: {
                                                            ...inputs[id],
                                                            [property]: {
                                                                ...((inputs[id]?.[property as 'position' | 'velocity' | 'acceleration']) ?? {}),
                                                                [vectorComponent!]: value === '' ? '' : String(value)
                                                            }
                                                        }
                                                    }));
                                                }
                                            }}
                                            vectorInputs={vectorInputs[entity.id!]?.velocity}
                                            onBlurVector={(id, property, value, vectorComponent) => {
                                                if (value !== '' && !isNaN(Number(value))) {
                                                    handleInputChange(id, property, Number(value), vectorComponent);
                                                }
                                                setVectorInputs(inputs => {
                                                    const copy = { ...inputs };
                                                    if (copy[id] && copy[id][property as 'position' | 'velocity' | 'acceleration']) {
                                                        copy[id][property as 'position' | 'velocity' | 'acceleration'] = {
                                                            ...copy[id][property as 'position' | 'velocity' | 'acceleration'],
                                                            [vectorComponent!]: undefined
                                                        };
                                                    }
                                                    return copy;
                                                });
                                            }}
                                        />
                                        {/* Aceleración */}
                                        <AxisVectorInput 
                                            typeVector="acceleration" 
                                            entity={entity} 
                                            handleInputChange={(id, property, value, vectorComponent) => {
                                                if (property === 'position' || property === 'velocity' || property === 'acceleration') {
                                                    setVectorInputs(inputs => ({
                                                        ...inputs,
                                                        [id]: {
                                                            ...inputs[id],
                                                            [property]: {
                                                                ...((inputs[id]?.[property as 'position' | 'velocity' | 'acceleration']) ?? {}),
                                                                [vectorComponent!]: value === '' ? '' : String(value)
                                                            }
                                                        }
                                                    }));
                                                }
                                            }}
                                            vectorInputs={vectorInputs[entity.id!]?.acceleration}
                                            onBlurVector={(id, property, value, vectorComponent) => {
                                                if (value !== '' && !isNaN(Number(value))) {
                                                    handleInputChange(id, property, Number(value), vectorComponent);
                                                }
                                                setVectorInputs(inputs => {
                                                    const copy = { ...inputs };
                                                    if (copy[id] && copy[id][property as 'position' | 'velocity' | 'acceleration']) {
                                                        copy[id][property as 'position' | 'velocity' | 'acceleration'] = {
                                                            ...copy[id][property as 'position' | 'velocity' | 'acceleration'],
                                                            [vectorComponent!]: undefined
                                                        };
                                                    }
                                                    return copy;
                                                });
                                            }}
                                        />

                                        {/* Radio y Color */}
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-stone-300 mb-2">
                                                    Radio
                                                </label>
                                                <input
                                                    type="number"
                                                    value={radiusInputs[entity.id!] ?? entity.radius ?? ""}
                                                    onInput={(e) => {
                                                        const val = (e.target as HTMLInputElement).value;
                                                        setRadiusInputs(inputs => ({ ...inputs, [entity.id!]: val }));
                                                    }}
                                                    onBlur={(e) => {
                                                        const val = (e.target as HTMLInputElement).value;
                                                        if (val !== "" && !isNaN(Number(val))) {
                                                            handleInputChange(entity.id!, 'radius', Number(val));
                                                        }
                                                        setRadiusInputs(inputs => {
                                                            const copy = { ...inputs };
                                                            delete copy[entity.id!];
                                                            return copy;
                                                        });
                                                    }}
                                                    className="w-full px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
                                                    min="5"
                                                    max="50"
                                                    step="1"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-stone-300 mb-2">
                                                    Color
                                                </label>
                                                <input
                                                    type="color"
                                                    value={colorInputs[entity.id!] ?? entity.color}
                                                    onInput={(e) => {
                                                        const val = (e.target as HTMLInputElement).value;
                                                        setColorInputs(inputs => ({ ...inputs, [entity.id!]: val }));
                                                    }}
                                                    onBlur={(e) => {
                                                        const val = (e.target as HTMLInputElement).value;
                                                        if (val !== "") {
                                                            handleInputChange(entity.id!, 'color', val);
                                                        }
                                                        setColorInputs(inputs => {
                                                            const copy = { ...inputs };
                                                            delete copy[entity.id!];
                                                            return copy;
                                                        });
                                                    }}
                                                    className="w-full h-8 bg-stone-700 border border-stone-600 rounded cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Información de estado */}
                                        <div className="mt-3 pt-3 border-t border-stone-700">
                                            <div className="text-xs text-stone-400 space-y-1">
                                                <div>ID: {entity.id}</div>
                                                <div>Pos: ({Math.sqrt(entity.position.x ** 2 + entity.position.y ** 2).toFixed(1)}, {(entity.position.angle() * (180 / Math.PI)).toFixed(1)}º)</div>
                                                <div>Vel: ({Math.sqrt(entity.velocity.x ** 2 + entity.velocity.y ** 2).toFixed(1)}, {(entity.velocity.angle() * (180 / Math.PI)).toFixed(1)}º)</div>
                                                <div>Acc: ({Math.sqrt(entity.acceleration.x ** 2 + entity.acceleration.y ** 2).toFixed(1)}, {(entity.acceleration.angle() * (180 / Math.PI)).toFixed(1)}º)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-stone-400 mb-4">
                                No hay móviles en la simulación
                            </div>
                            <button 
                                onClick={handleAddEntity}
                                className="flex items-center justify-center gap-2 w-full bg-stone-800 border border-stone-600 hover:bg-stone-700 transition-colors rounded-lg p-4 text-white"
                            >
                                <IconPlus size={24} />
                                Agregar primer móvil
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Sidebar;