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
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { compressDisplay } from '../../utils/encodeAndDecodeDisplay';

function DisplayOptionsSelector() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

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

    const display = {
        position: {
            resultant: position.resultant,
            components: position.components,
            angle: position.angle,
        },
        velocity: {
            resultant: velocity.resultant,
            components: velocity.components,
            angle: velocity.angle,
        },
        acceleration: {
            resultant: acceleration.resultant,
            components: acceleration.components,
            angle: acceleration.angle,
        },
        trajectory,
        coordinates,
        axes,
    };

    const onCheckedChangePR = (checked: boolean) => {
        togglePositionResultant();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangePC = (checked: boolean) => {
        togglePositionComponents();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangePA = (checked: boolean) => {
        togglePositionAngle();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeVR = (checked: boolean) => {
        toggleVelocityResultant();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeVC = (checked: boolean) => {
        toggleVelocityComponents();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeVA = (checked: boolean) => {
        toggleVelocityAngle();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeAR = (checked: boolean) => {
        toggleAccelerationResultant();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeAC = (checked: boolean) => {
        toggleAccelerationComponents();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeAA = (checked: boolean) => {
        toggleAccelerationAngle();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeTR = (checked: boolean) => {
        toggleTrajectory();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeCR = (checked: boolean) => {
        toggleCoordinates();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

    const onCheckedChangeAX = (checked: boolean) => {
        toggleAxes();
        const params = new URLSearchParams(searchParams);
        params.set('o', compressDisplay(useDisplayStore.getState().toProps()));
        replace(`${pathname}?${params.toString()}`);
    };

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
                                    onCheckedChange={onCheckedChangePR}
                                    checked={position.resultant}
                                />
                                <Label htmlFor="position.resultant">
                                    Resultante
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="postion.compontents"
                                    onCheckedChange={onCheckedChangePC}
                                    checked={position.components}
                                />
                                <Label htmlFor="postion.compontents">
                                    Componentes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="position.angle"
                                    onCheckedChange={onCheckedChangePA}
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
                                    onCheckedChange={onCheckedChangeVR}
                                    checked={velocity.resultant}
                                />
                                <Label htmlFor="velocity.resultant">
                                    Resultante
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="velocity.compontets"
                                    onCheckedChange={onCheckedChangeVC}
                                    checked={velocity.components}
                                />
                                <Label htmlFor="velocity.compontets">
                                    Componentes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="velocity.angle"
                                    onCheckedChange={onCheckedChangeVA}
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
                                    onCheckedChange={onCheckedChangeAR}
                                    checked={acceleration.resultant}
                                />
                                <Label htmlFor="acceleration.resultant">
                                    Resultante
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="acceleration.components"
                                    onCheckedChange={onCheckedChangeAC}
                                    checked={acceleration.components}
                                />
                                <Label htmlFor="acceleration.components">
                                    Componentes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="acceleration.angle"
                                    onCheckedChange={onCheckedChangeAA}
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
                                    onCheckedChange={onCheckedChangeTR}
                                    checked={trajectory}
                                />
                                <Label htmlFor="trajectories">
                                    Trayectoria
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="coordinates"
                                    onCheckedChange={onCheckedChangeCR}
                                    checked={coordinates}
                                />
                                <Label htmlFor="coordinates">Coordenadas</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="axes"
                                    onCheckedChange={onCheckedChangeAX}
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
