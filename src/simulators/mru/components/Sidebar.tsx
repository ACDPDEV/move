import { Vector2D } from '@/lib/physicsUtils';
import { Movil, type IMovilProps } from '@/simulators/mru/entities/Movil';
import { IconLayoutSidebarLeftCollapseFilled, IconLayoutSidebarRightCollapseFilled, IconPlus, IconTrash } from '@tabler/icons-preact';
import { useState } from 'preact/hooks';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    entities: Movil[];
    onEntityChange?: (id: string, updates: Partial<IMovilProps>) => void;
    onEntityDelete?: (id: string) => void;
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

    /**
     * Maneja la adición de una nueva entidad
     */
    const handleAddEntity = () => {
        if (!onEntityChange) return;
        
        const newEntityId = `movil-${Date.now()}`;
        const newEntity = new Movil({
            id: newEntityId,
            position: new Vector2D(100, 300 + entities.length * 80), // Posición escalonada
            velocity: new Vector2D(Math.random() * 50 + 10, 0), // Velocidad aleatoria
            acceleration: new Vector2D(0, 0),
            radius: 15,
            color: Math.floor(Math.random() * 0xFFFFFF) // Color aleatorio
        });
        
        onEntityChange(newEntityId, {
            position: newEntity.position,
            velocity: newEntity.velocity,
            acceleration: newEntity.acceleration,
            radius: newEntity.radius,
            color: newEntity.color
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
        value: number,
        vectorComponent?: 'x' | 'y'
    ) => {
        if (!onEntityChange) return;

        const entity = entities.find(e => e.id === entityId);
        if (!entity) return;

        let updates: Partial<IMovilProps> = {};

        if (vectorComponent && (property === 'position' || property === 'velocity' || property === 'acceleration')) {
            const currentVector = entity[property] as Vector2D;
            const newVector = new Vector2D(
                vectorComponent === 'x' ? value : currentVector.x,
                vectorComponent === 'y' ? value : currentVector.y
            );
            updates[property] = newVector;
        } else if (property === 'radius' || property === 'color') {
            updates[property] = value as number;
        }

        onEntityChange(entityId, updates);
    };

    /**
     * Convierte un número hexadecimal a string hex para input color
     */
    const colorToHex = (color: number): string => {
        return `#${color.toString(16).padStart(6, '0')}`;
    };

    /**
     * Convierte un string hex a número hexadecimal
     */
    const hexToColor = (hex: string): number => {
        return parseInt(hex.replace('#', ''), 16);
    };

    return (
        <>
            {/* Botón de toggle */}
            <button 
                onClick={onToggle}
                class="p-2 rounded-full hover:bg-stone-800 transition-colors absolute top-4 right-4 z-10"
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
                class={`fixed top-0 right-0 h-full bg-stone-900 border-l border-stone-700 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ width: '400px' }}
            >
                <div class="p-4 h-full overflow-y-auto">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-white">Control de Móviles</h2>
                        <button 
                            onClick={handleAddEntity}
                            class="p-2 rounded-full hover:bg-stone-700 transition-colors bg-stone-800 text-white"
                            aria-label="Añadir móvil"
                            title="Agregar nuevo móvil"
                        >
                            <IconPlus size={20} />
                        </button>
                    </div>

                    {entities.length > 0 ? (
                        <div class="space-y-4">
                            {entities.map((entity, index) => (
                                <div key={entity.id || index} class="bg-stone-800 p-4 rounded-lg border border-stone-700">
                                    {/* Header de la entidad */}
                                    <div class="flex justify-between items-center mb-4">
                                        <h3 class="text-lg font-semibold text-white">
                                            Móvil {index + 1}
                                        </h3>
                                        {onEntityDelete && (
                                            <button
                                                onClick={() => handleDeleteEntity(entity.id!)}
                                                class="p-1 rounded hover:bg-red-600 transition-colors text-red-400 hover:text-white"
                                                aria-label="Eliminar móvil"
                                                title="Eliminar móvil"
                                            >
                                                <IconTrash size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div class="space-y-4">
                                        {/* Posición */}
                                        <div>
                                            <label class="block text-sm font-medium text-stone-300 mb-2">
                                                Posición (x, y)
                                            </label>
                                            <div class="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={entity.position?.x?.toFixed(1) || '0'}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'position', 
                                                        parseFloat((e.target as HTMLInputElement).value) || 0,
                                                        'x'
                                                    )}
                                                    class="flex-1 px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500"
                                                    step="0.1"
                                                />
                                                <input
                                                    type="number"
                                                    value={entity.position?.y?.toFixed(1) || '0'}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'position', 
                                                        parseFloat((e.target as HTMLInputElement).value) || 0,
                                                        'y'
                                                    )}
                                                    class="flex-1 px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500"
                                                    step="0.1"
                                                />
                                            </div>
                                        </div>

                                        {/* Velocidad */}
                                        <div>
                                            <label class="block text-sm font-medium text-stone-300 mb-2">
                                                Velocidad (vx, vy)
                                            </label>
                                            <div class="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={entity.velocity?.x?.toFixed(1) || '0'}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'velocity', 
                                                        parseFloat((e.target as HTMLInputElement).value) || 0,
                                                        'x'
                                                    )}
                                                    class="flex-1 px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500"
                                                    step="0.1"
                                                />
                                                <input
                                                    type="number"
                                                    value={entity.velocity?.y?.toFixed(1) || '0'}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'velocity', 
                                                        parseFloat((e.target as HTMLInputElement).value) || 0,
                                                        'y'
                                                    )}
                                                    class="flex-1 px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500"
                                                    step="0.1"
                                                />
                                            </div>
                                        </div>

                                        {/* Aceleración */}
                                        <div>
                                            <label class="block text-sm font-medium text-stone-300 mb-2">
                                                Aceleración (ax, ay)
                                            </label>
                                            <div class="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={entity.acceleration?.x?.toFixed(1) || '0'}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'acceleration', 
                                                        parseFloat((e.target as HTMLInputElement).value) || 0,
                                                        'x'
                                                    )}
                                                    class="flex-1 px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500"
                                                    step="0.1"
                                                />
                                                <input
                                                    type="number"
                                                    value={entity.acceleration?.y?.toFixed(1) || '0'}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'acceleration', 
                                                        parseFloat((e.target as HTMLInputElement).value) || 0,
                                                        'y'
                                                    )}
                                                    class="flex-1 px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500"
                                                    step="0.1"
                                                />
                                            </div>
                                        </div>

                                        {/* Radio y Color */}
                                        <div class="flex gap-4">
                                            <div class="flex-1">
                                                <label class="block text-sm font-medium text-stone-300 mb-2">
                                                    Radio
                                                </label>
                                                <input
                                                    type="number"
                                                    value={entity.radius || 10}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'radius', 
                                                        parseFloat((e.target as HTMLInputElement).value) || 10
                                                    )}
                                                    class="w-full px-2 py-1 bg-stone-700 border border-stone-600 rounded text-white text-sm focus:outline-none focus:border-stone-500"
                                                    min="5"
                                                    max="50"
                                                    step="1"
                                                />
                                            </div>
                                            <div class="flex-1">
                                                <label class="block text-sm font-medium text-stone-300 mb-2">
                                                    Color
                                                </label>
                                                <input
                                                    type="color"
                                                    value={colorToHex(entity.color || 0xFFFFFF)}
                                                    onChange={(e) => handleInputChange(
                                                        entity.id!, 
                                                        'color', 
                                                        hexToColor((e.target as HTMLInputElement).value)
                                                    )}
                                                    class="w-full h-8 bg-stone-700 border border-stone-600 rounded cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Información de estado */}
                                        <div class="mt-3 pt-3 border-t border-stone-700">
                                            <div class="text-xs text-stone-400 space-y-1">
                                                <div>ID: {entity.id}</div>
                                                <div>
                                                    Velocidad: {Math.sqrt(
                                                        (entity.velocity?.x || 0) ** 2 + 
                                                        (entity.velocity?.y || 0) ** 2
                                                    ).toFixed(2)} u/s
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div class="text-center py-8">
                            <div class="text-stone-400 mb-4">
                                No hay móviles en la simulación
                            </div>
                            <button 
                                onClick={handleAddEntity}
                                class="flex items-center justify-center gap-2 w-full bg-stone-800 border border-stone-600 hover:bg-stone-700 transition-colors rounded-lg p-4 text-white"
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