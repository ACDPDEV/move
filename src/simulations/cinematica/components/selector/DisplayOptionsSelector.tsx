import { Button } from '@/components/ui/button';
import { IconSettings } from '@tabler/icons-react';
import { useDisplayStore } from '../../stores/useDisplayStore';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function DisplayOptionsSelector() {
    const {
        position,
        velocity,
        acceleration,
        trajectory,
        coordinates,
        axes,
        togglePositionResultant,
        togglePositionComponents,
        togglePositionAngle,
        toggleVelocityResultant,
        toggleVelocityComponents,
        toggleVelocityAngle,
        toggleAccelerationResultant,
        toggleAccelerationComponents,
        toggleAccelerationAngle,
        toggleTrajectory,
        toggleCoordinates,
        toggleAxes,
    } = useDisplayStore();

    return (
        <Popover>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            className="text-stone-300 border-stone-300 hover:text-white hover:scale-125 p-2 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-400 flex"
                            type="button"
                            title="Opciones de visualización"
                            variant="outline"
                        >
                            <IconSettings
                                className="stroke-stone-900 dark:stroke-stone-100"
                                size={20}
                            />
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Opciones de visualización</TooltipContent>
            </Tooltip>
            <PopoverContent
                className="w-56 dark:bg-stone-800 bg-stone-100 border-stone-700"
                align="end"
            >
                <div className="space-y-3">
                    {/* Position */}
                    <div>
                        <h4 className="text-xs dark:text-stone-400 text-stone-700 mb-2 font-medium">
                            Posición
                        </h4>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="position.resultant"
                                    onCheckedChange={togglePositionResultant}
                                    checked={position.resultant}
                                />
                                <Label htmlFor="position.resultant">
                                    Resultante
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="postion.compontents"
                                    onCheckedChange={togglePositionComponents}
                                    checked={position.components}
                                />
                                <Label htmlFor="postion.compontents">
                                    Componentes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="position.angle"
                                    onCheckedChange={togglePositionAngle}
                                    checked={position.angle}
                                />
                                <Label htmlFor="position.angle">Ángulo</Label>
                            </div>
                        </div>
                    </div>

                    {/* Velocity */}
                    <div>
                        <h4 className="text-xs dark:text-stone-400 text-stone-700 mb-2 font-medium">
                            Velocidad
                        </h4>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="velocity.resultant"
                                    onCheckedChange={toggleVelocityResultant}
                                    checked={velocity.resultant}
                                />
                                <Label htmlFor="velocity.resultant">
                                    Resultante
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="velocity.compontets"
                                    onCheckedChange={toggleVelocityComponents}
                                    checked={velocity.components}
                                />
                                <Label htmlFor="velocity.compontets">
                                    Componentes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="velocity.angle"
                                    onCheckedChange={toggleVelocityAngle}
                                    checked={velocity.angle}
                                />
                                <Label htmlFor="velocity.angle">Ángulo</Label>
                            </div>
                        </div>
                    </div>

                    {/* Acceleration */}
                    <div>
                        <h4 className="text-xs text-stone-400 mb-2 font-medium">
                            Aceleración
                        </h4>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="acceleration.resultant"
                                    onCheckedChange={
                                        toggleAccelerationResultant
                                    }
                                    checked={acceleration.resultant}
                                />
                                <Label htmlFor="acceleration.resultant">
                                    Resultante
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="acceleration.components"
                                    onCheckedChange={
                                        toggleAccelerationComponents
                                    }
                                    checked={acceleration.components}
                                />
                                <Label htmlFor="acceleration.components">
                                    Componentes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="acceleration.angle"
                                    onCheckedChange={toggleAccelerationAngle}
                                    checked={acceleration.angle}
                                />
                                <Label htmlFor="acceleration.angle">
                                    Ángulo
                                </Label>
                            </div>
                        </div>
                    </div>

                    <Separator className="dark:bg-stone-700 bg-stone-400" />

                    {/* Additional options */}
                    <div>
                        <h4 className="text-xs dark:text-stone-400 mb-2 font-medium">
                            Otros
                        </h4>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="trajectories"
                                    onCheckedChange={toggleTrajectory}
                                    checked={trajectory}
                                />
                                <Label htmlFor="trajectories">
                                    Trayectoria
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="coordinates"
                                    onCheckedChange={toggleCoordinates}
                                    checked={coordinates}
                                />
                                <Label htmlFor="coordinates">Coordenadas</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="axes"
                                    onCheckedChange={toggleAxes}
                                    checked={axes}
                                />
                                <Label htmlFor="axes">Ejes</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default DisplayOptionsSelector;
