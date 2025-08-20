'use client';
import { useDisplayStore } from '../../stores/useDisplayStore';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { compressDisplay } from '../../utils/encodeAndDecodeDisplay';
import {
    Icon3dCubeSphere,
    IconChevronDown,
    IconVector,
    IconArrowRight,
    IconActivity,
    IconSettings,
} from '@tabler/icons-react';
import styles from '../../consts/styles';
import { useState, useMemo, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useURL } from '../../hooks/useURL';

interface OptionConfig {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    toggle: () => void;
}

interface SectionConfig {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    options: OptionConfig[];
}

function DisplayOptionsSelector() {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('position');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { setURLParams } = useURL();

    // Ref para prevenir re-animaciones innecesarias
    const lastActiveSectionRef = useRef(activeSection);
    const shouldAnimate = activeSection !== lastActiveSectionRef.current;

    // Actualizar la referencia cuando cambia la sección
    if (activeSection !== lastActiveSectionRef.current) {
        lastActiveSectionRef.current = activeSection;
    }

    const variants = {
        open: { rotate: 180 },
        closed: { rotate: 0 },
    };

    const {
        position,
        velocity,
        acceleration,
        trajectory,
        coordinates,
        axes,
        fps,
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
        toggleFps,
    } = useDisplayStore();

    const updateURL = useCallback(() => {
        setURLParams({
            o: compressDisplay(useDisplayStore.getState().toProps()),
        });
    }, [setURLParams]);

    const createToggleHandler = useCallback(
        (toggleFn: () => void) => () => {
            toggleFn();
            updateURL();
        },
        [updateURL],
    );

    const sections: SectionConfig[] = useMemo(
        () => [
            {
                id: 'position',
                title: 'Posición',
                icon: <IconVector className="w-4 h-4" />,
                description:
                    'Configura la visualización de vectores de posición',
                options: [
                    {
                        id: 'position.resultant',
                        label: 'Vector Resultante',
                        description:
                            'Muestra el vector de posición desde el origen',
                        checked: position.resultant,
                        toggle: createToggleHandler(togglePositionResultant),
                    },
                    {
                        id: 'position.components',
                        label: 'Componentes',
                        description:
                            'Muestra las componentes X e Y del vector posición',
                        checked: position.components,
                        toggle: createToggleHandler(togglePositionComponents),
                    },
                    {
                        id: 'position.angle',
                        label: 'Ángulo',
                        description: 'Muestra el ángulo del vector de posición',
                        checked: position.angle,
                        toggle: createToggleHandler(togglePositionAngle),
                    },
                ],
            },
            {
                id: 'velocity',
                title: 'Velocidad',
                icon: <IconArrowRight className="w-4 h-4" />,
                description:
                    'Configura la visualización de vectores de velocidad',
                options: [
                    {
                        id: 'velocity.resultant',
                        label: 'Vector Resultante',
                        description:
                            'Muestra el vector de velocidad instantánea',
                        checked: velocity.resultant,
                        toggle: createToggleHandler(toggleVelocityResultant),
                    },
                    {
                        id: 'velocity.components',
                        label: 'Componentes',
                        description:
                            'Muestra las componentes X e Y del vector velocidad',
                        checked: velocity.components,
                        toggle: createToggleHandler(toggleVelocityComponents),
                    },
                    {
                        id: 'velocity.angle',
                        label: 'Ángulo',
                        description:
                            'Muestra el ángulo del vector de velocidad',
                        checked: velocity.angle,
                        toggle: createToggleHandler(toggleVelocityAngle),
                    },
                ],
            },
            {
                id: 'acceleration',
                title: 'Aceleración',
                icon: <IconActivity className="w-4 h-4" />,
                description:
                    'Configura la visualización de vectores de aceleración',
                options: [
                    {
                        id: 'acceleration.resultant',
                        label: 'Vector Resultante',
                        description:
                            'Muestra el vector de aceleración instantánea',
                        checked: acceleration.resultant,
                        toggle: createToggleHandler(
                            toggleAccelerationResultant,
                        ),
                    },
                    {
                        id: 'acceleration.components',
                        label: 'Componentes',
                        description:
                            'Muestra las componentes X e Y del vector aceleración',
                        checked: acceleration.components,
                        toggle: createToggleHandler(
                            toggleAccelerationComponents,
                        ),
                    },
                    {
                        id: 'acceleration.angle',
                        label: 'Ángulo',
                        description:
                            'Muestra el ángulo del vector de aceleración',
                        checked: acceleration.angle,
                        toggle: createToggleHandler(toggleAccelerationAngle),
                    },
                ],
            },
            {
                id: 'display',
                title: 'Visualización',
                icon: <IconSettings className="w-4 h-4" />,
                description: 'Opciones generales de visualización',
                options: [
                    {
                        id: 'trajectory',
                        label: 'Trayectoria',
                        description: 'Muestra la trayectoria del movimiento',
                        checked: trajectory,
                        toggle: createToggleHandler(toggleTrajectory),
                    },
                    {
                        id: 'coordinates',
                        label: 'Coordenadas',
                        description:
                            'Muestra las coordenadas del objeto en tiempo real',
                        checked: coordinates,
                        toggle: createToggleHandler(toggleCoordinates),
                    },
                    {
                        id: 'axes',
                        label: 'Ejes de Coordenadas',
                        description:
                            'Muestra los ejes X e Y del sistema de coordenadas',
                        checked: axes,
                        toggle: createToggleHandler(toggleAxes),
                    },
                    {
                        id: 'fps',
                        label: 'FPS',
                        description: 'Muestra el FPS del simulador',
                        checked: fps,
                        toggle: createToggleHandler(toggleFps),
                    },
                ],
            },
        ],
        [
            position,
            velocity,
            acceleration,
            trajectory,
            coordinates,
            axes,
            createToggleHandler,
        ],
    );

    const activeConfig =
        sections.find((s) => s.id === activeSection) || sections[0];

    const SidebarItem = ({
        section,
        isActive,
        onActivate,
    }: {
        section: SectionConfig;
        isActive: boolean;
        onActivate?: () => void;
    }) => {
        // Stable classes to avoid reflow on hover
        const base =
            'flex items-center space-x-3 p-3 rounded-lg text-left transition-all';
        const activeCls =
            'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        const inactiveCls =
            'text-stone-400 hover:bg-stone-800/50 hover:text-stone-300';

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                    setActiveSection(section.id);
                    if (onActivate) onActivate();
                }}
                className={`${base} ${
                    isActive ? activeCls : inactiveCls
                } w-full`}
            >
                <div
                    className={`flex items-center justify-center w-8 h-8 rounded-md ${
                        isActive ? 'bg-blue-500/30' : 'bg-stone-800'
                    }`}
                >
                    {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                        {section.title}
                    </div>
                    <div className="text-xs opacity-70 truncate">
                        {section.description}
                    </div>
                </div>
            </motion.button>
        );
    };

    const OptionItem = ({
        option,
        delay = 0,
        animate = true,
    }: {
        option: OptionConfig;
        delay?: number;
        animate?: boolean;
    }) => (
        <motion.div
            initial={animate ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={animate ? { delay } : { duration: 0 }}
            className="bg-stone-800/30 rounded-lg p-4 space-y-3"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                    <Label
                        htmlFor={option.id}
                        className="text-base font-medium cursor-pointer text-stone-100"
                    >
                        {option.label}
                    </Label>
                    {option.description && (
                        <p className="text-sm text-stone-400 leading-relaxed">
                            {option.description}
                        </p>
                    )}
                </div>
                <Switch
                    id={option.id}
                    onCheckedChange={option.toggle}
                    checked={option.checked}
                    className="ml-4 data-[state=checked]:bg-blue-600"
                />
            </div>
        </motion.div>
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                setMobileNavOpen(false);
            }}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.button}
                        >
                            <Icon3dCubeSphere className={styles.icon} />
                            <motion.div
                                animate={open ? 'open' : 'closed'}
                                variants={variants}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-center w-5 h-5"
                            >
                                <IconChevronDown
                                    className={styles.iconSecondary}
                                />
                            </motion.div>
                        </motion.button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Opciones de visualización</TooltipContent>
            </Tooltip>

            <AnimatePresence>
                {open && (
                    <DialogContent className="max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl w-full h-[92vh] sm:h-[85vh] p-0 gap-0 bg-stone-900 border-stone-700">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex h-full flex-col md:flex-row"
                        >
                            {/* Sidebar area - on mobile replaced by a button that toggles an absolute dropdown */}
                            <motion.nav
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-full md:w-80 border-b md:border-r border-stone-700 bg-stone-900/50 p-4 md:p-6 relative"
                                aria-label="Secciones de visualización"
                            >
                                <div className="mb-4 md:mb-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg md:text-xl font-bold text-stone-100 mb-1">
                                            Configuración de Visualización
                                        </h2>
                                        <p className="text-xs md:text-sm text-stone-400">
                                            Personaliza qué elementos mostrar en
                                            la simulación
                                        </p>
                                    </div>
                                </div>

                                {/* MOBILE: show a button that toggles the sections dropdown (absolute) */}
                                <div className="md:hidden">
                                    <button
                                        onClick={() =>
                                            setMobileNavOpen((v) => !v)
                                        }
                                        aria-expanded={mobileNavOpen}
                                        className="w-full flex items-center justify-between p-3 rounded-md bg-stone-800/30 hover:bg-stone-800/40"
                                    >
                                        <span className="text-sm font-medium text-stone-100">
                                            Secciones
                                        </span>
                                        <IconChevronDown
                                            className={`w-4 h-4 transform ${
                                                mobileNavOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            } text-stone-300`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {mobileNavOpen && (
                                            // absolute panel so it doesn't push layout and cause overflow
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scaleY: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scaleY: 1,
                                                }}
                                                exit={{ opacity: 0, scaleY: 0 }}
                                                transition={{ duration: 0.16 }}
                                                style={{
                                                    transformOrigin: 'top',
                                                }}
                                                className="absolute left-4 right-4 top-[64px] bg-stone-900/95 rounded-md p-2 shadow-lg z-50 max-h-[48vh] overflow-auto"
                                            >
                                                <div className="space-y-2">
                                                    {sections.map((s) => (
                                                        <SidebarItem
                                                            key={s.id}
                                                            section={s}
                                                            isActive={
                                                                activeSection ===
                                                                s.id
                                                            }
                                                            onActivate={() =>
                                                                setMobileNavOpen(
                                                                    false,
                                                                )
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* DESKTOP: regular vertical sidebar */}
                                <div className="hidden md:block space-y-2">
                                    {sections.map((s) => (
                                        <SidebarItem
                                            key={s.id}
                                            section={s}
                                            isActive={activeSection === s.id}
                                        />
                                    ))}
                                </div>
                            </motion.nav>

                            {/* Main Content */}
                            <main
                                className="flex-1 flex flex-col"
                                role="region"
                                aria-live="polite"
                            >
                                {/* Header */}
                                <motion.header
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="border-b border-stone-700 p-4 md:p-6 bg-stone-900/30 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400">
                                            {activeConfig.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-base md:text-lg font-semibold text-stone-100">
                                                {activeConfig.title}
                                            </h3>
                                            <p className="text-xs md:text-sm text-stone-400">
                                                {activeConfig.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* No extra close/save buttons — shadcn Dialog provides them */}
                                </motion.header>

                                {/* Content Area */}
                                <motion.section
                                    initial={
                                        shouldAnimate
                                            ? { opacity: 0, x: 20 }
                                            : false
                                    }
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={
                                        shouldAnimate
                                            ? { duration: 0.2 }
                                            : { duration: 0 }
                                    }
                                    className="flex-1 overflow-auto p-4 md:p-6"
                                >
                                    <div className="max-w-2xl space-y-4">
                                        {activeConfig.options.map(
                                            (option, index) => (
                                                <OptionItem
                                                    key={option.id}
                                                    option={option}
                                                    delay={
                                                        shouldAnimate
                                                            ? index * 0.05
                                                            : 0
                                                    }
                                                    animate={shouldAnimate}
                                                />
                                            ),
                                        )}
                                    </div>
                                </motion.section>
                            </main>
                        </motion.div>
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>
    );
}

export default DisplayOptionsSelector;
