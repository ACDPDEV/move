import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import Button from '../ui/button';
import {
    Icon3dCubeSphere,
    IconAngle,
    IconChevronDown,
    IconChevronRight,
    IconFlame,
    IconMapPin,
    IconRotateDot,
    IconArrowDownRightCircle,
    IconVectorSpline,
    IconForms,
} from '@tabler/icons-react';
import styles from '../../consts/styles';
import { Switch } from '@/components/ui/switch';
import { Display, Inputs, useOptionsStore } from '../../stores/useOptionsStore';
import { useURL } from '../../hooks/useURL';
import { compressOptions } from '../../utils/encodeAndDecodeOptions';
import { booleanToBinary } from '../../utils/boleanAndBinaryConversion';

const displayOptions = {
    key: 'display',
    label: 'Visualización',
    description: 'Opciones de visualización sobre el plano',
    icon: <Icon3dCubeSphere className={styles.icon} />,
    type: 'section',
    options: [
        {
            key: 'positionVectorResultant',
            label: 'Resultante del vector posición',
            description:
                'Mostrar la resultante del vector posición en el plano',
            icon: <IconArrowDownRightCircle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'positionVectorComponents',
            label: 'Componentes del vector posición',
            description:
                'Mostrar los componentes del vector posición en el plano',
            icon: <IconArrowDownRightCircle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'positionVectorAngle',
            label: 'Ángulo del vector posición',
            description: 'Mostrar el ángulo del vector posición en el plano',
            icon: <IconAngle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'velocityVectorResultant',
            label: 'Resultante del vector velocidad',
            description:
                'Mostrar la resultante del vector velocidad en el plano',
            icon: <IconArrowDownRightCircle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'velocityVectorComponents',
            label: 'Componentes del vector velocidad',
            description:
                'Mostrar los componentes del vector velocidad en el plano',
            icon: <IconArrowDownRightCircle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'velocityVectorAngle',
            label: 'Ángulo del vector velocidad',
            description: 'Mostrar el ángulo del vector velocidad en el plano',
            icon: <IconAngle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'accelerationVectorResultant',
            label: 'Resultante del vector aceleración',
            description:
                'Mostrar la resultante del vector aceleración en el plano',
            icon: <IconArrowDownRightCircle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'accelerationVectorComponents',
            label: 'Componentes del vector aceleración',
            description:
                'Mostrar los componentes del vector aceleración en el plano',
            icon: <IconArrowDownRightCircle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'accelerationVectorAngle',
            label: 'Ángulo del vector aceleración',
            description: 'Mostrar el ángulo del vector aceleración en el plano',
            icon: <IconAngle className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'trajectory',
            label: 'Trayectoria',
            description: 'Mostrar la trayectoria en el plano',
            icon: <IconVectorSpline className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'coordinates',
            label: 'Coordenadas',
            description: 'Mostrar las coordenadas del móvil en el plano',
            icon: <IconMapPin className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'spin',
            label: 'Spin',
            description: 'Mostrar los spins de cada móvil en el plano',
            icon: <IconRotateDot className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'fps',
            label: 'FPS',
            description: 'Mostrar el FPS de la simulación',
            icon: <IconFlame className={styles.icon} />,
            type: 'toggle',
        },
    ],
};

const inputOptions = {
    key: 'inputs',
    label: 'Entradas',
    description: 'Opciones de entrada',
    icon: <IconForms className={styles.icon} />,
    type: 'section',
    options: [
        {
            key: 'position',
            label: 'Posición',
            description: 'Mostrar la posición del móvil',
            icon: <IconForms className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'velocity',
            label: 'Velocidad',
            description: 'Mostrar la velocidad del móvil',
            icon: <IconForms className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'acceleration',
            label: 'Aceleración',
            description: 'Mostrar la aceleración del móvil',
            icon: <IconForms className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'radius',
            label: 'Radio',
            description: 'Mostrar el radio del móvil',
            icon: <IconForms className={styles.icon} />,
            type: 'toggle',
        },
        {
            key: 'color',
            label: 'Color',
            description: 'Mostrar el color del móvil',
            icon: <IconForms className={styles.icon} />,
            type: 'toggle',
        },
    ],
};

const sections = {
    display: displayOptions,
    inputs: inputOptions,
};

type SectionKey = 'display' | 'inputs';

function OptionsSelect() {
    const [selected, setSelected] = useState<SectionKey>('display');
    const { display, inputs, toggleProperty } = useOptionsStore();
    const { setURLParams } = useURL();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button tooltip="Opciones de visualización">
                    <Icon3dCubeSphere className={styles.icon} />
                    <IconChevronDown className={styles.iconSecondary} />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] bg-[#151E19] grid grid-cols-[fit-content(100%)_1fr] p-0 gap-0">
                <div className="md:w-56 w-24 p-4 border-r border-green-900/20 flex flex-col gap-8">
                    <h1 className="md:text-xl text-sm font-bold text-white">
                        Opciones
                    </h1>
                    <nav className="flex flex-col gap-2">
                        {Object.values(sections).map((section) => (
                            <Button
                                key={section.key}
                                onClick={() =>
                                    setSelected(section.key as SectionKey)
                                }
                                defaultClassName={false}
                                className="w-auto h-fit bg-[#202c25] rounded-md flex flex-row p-2 gap-1 items-center justify-between cursor-pointer"
                            >
                                <span className="block md:hidden">
                                    {section.icon}
                                </span>
                                <div className="flex-row items-center gap-2 hidden md:flex">
                                    {section.icon}
                                    <span className="text-sm text-[#D3DFD8] font-bold">
                                        {section.label}
                                    </span>
                                </div>
                                {section.key === selected ? (
                                    <IconChevronRight
                                        className={styles.iconSecondary}
                                    />
                                ) : null}
                            </Button>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-col w-full h-full overflow-hidden">
                    <DialogTitle className="flex flex-col p-4 gap-2 border-b border-green-900/20">
                        <h1>{sections[selected].label}</h1>
                        <p className="text-sm font-thin">
                            {sections[selected].description}
                        </p>
                    </DialogTitle>
                    <div className="flex flex-col p-4 gap-4 w-full h-full overflow-y-scroll">
                        {selected === 'display' &&
                            displayOptions.options.map((option) => (
                                <div
                                    key={option.key}
                                    className="flex flex-row justify-between p-4 rounded-md bg-[#1c2620] text-sm text-[#D3DFD8]"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            {option.icon}
                                            <h2 className="font-bold text-md">
                                                {option.label}
                                            </h2>
                                        </div>
                                        <p>{option.description}</p>
                                    </div>
                                    {option.type === 'toggle' ? (
                                        <Switch
                                            checked={
                                                display[
                                                    option.key as keyof Display
                                                ]
                                            }
                                            onCheckedChange={() => {
                                                toggleProperty(
                                                    option.key as keyof Display,
                                                );
                                                const { display, inputs } =
                                                    useOptionsStore.getState();
                                                setURLParams({
                                                    o: booleanToBinary(
                                                        compressOptions(
                                                            display,
                                                            inputs,
                                                        ),
                                                    ).toString(),
                                                });
                                            }}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        {selected === 'inputs' &&
                            inputOptions.options.map((option) => (
                                <div
                                    key={option.key}
                                    className="flex flex-row justify-between p-4 rounded-md bg-[#1c2620] text-sm text-[#D3DFD8]"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            {option.icon}
                                            <h2 className="font-bold text-md">
                                                {option.label}
                                            </h2>
                                        </div>
                                        <p>{option.description}</p>
                                    </div>
                                    {option.type === 'toggle' ? (
                                        <Switch
                                            checked={
                                                inputs[
                                                    option.key as keyof Inputs
                                                ]
                                            }
                                            onCheckedChange={() => {
                                                toggleProperty(
                                                    option.key as keyof Inputs,
                                                );
                                                const { display, inputs } =
                                                    useOptionsStore.getState();
                                                setURLParams({
                                                    o: booleanToBinary(
                                                        compressOptions(
                                                            display,
                                                            inputs,
                                                        ),
                                                    ).toString(),
                                                });
                                            }}
                                        />
                                    ) : null}
                                </div>
                            ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default OptionsSelect;
