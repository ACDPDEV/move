'use client';
import TimeControls from '@/simulations/cinematica/components/TimeControls';
import Canvas from '@/simulations/cinematica/components/Canvas';
import FloatBar from './components/FloatBar';
import TimeIndicators from './components/TimeIndicators';
import { useSidebarStore } from './stores/useSidebarStore';
import SimulationSidebar from './components/SimulationSidebar';
import Button from '@/simulations/cinematica/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';
import OptionsSelect from './components/selector/OptionsSelect';
import { useTimeStore } from './stores/useTimeStore';
import { useEffect, useState } from 'react';
import { useEntityStore } from './stores/useEntityStore';
import { decompressData } from './utils/encodeAndDecodeEntities';
import { decompressOptions } from './utils/encodeAndDecodeOptions';
import { useURL } from './hooks/useURL';
import { AnimatePresence, motion } from 'motion/react';
import { useOptionsStore } from './stores/useOptionsStore';
import styles from './consts/styles';
import { useVariablesStore } from './stores/useVariablesStore';
import { decompressVars } from './utils/encodeAndDecodeVariables';

export default function CinematicaSimulation() {
    const { isOpen, toggleIsOpen } = useSidebarStore();
    const [fisrtInteraction, setFirstInteraction] = useState(true);

    const { getURLParams } = useURL();

    useEffect(() => {
        if (fisrtInteraction) {
            const setTime = useTimeStore.getState().updateTime;
            const setEntities = useEntityStore.getState().updateEntities;
            const setOptions = useOptionsStore.getState().setOptions;
            const addVariable = useVariablesStore.getState().addVariable;
            const deleteAllVariables = useVariablesStore.getState().deleteAllVariables;

            setEntities(decompressData(getURLParams('d') ?? ''));
            setTime(parseFloat(getURLParams('t') ?? '0'));
            if (getURLParams('o')) {
                setOptions(decompressOptions(getURLParams('o')!));
            }
            setFirstInteraction(false);
            deleteAllVariables();
            decompressVars(getURLParams('v') ?? '').forEach((v) =>
                addVariable(v.name, v.type, v.value),
            );
        }
    }, [getURLParams, fisrtInteraction]);

    return (
        <>
            <div
                className={`${
                    isOpen
                        ? 'w-0 hidden sm:w-[calc(100%-28rem)] sm:flex'
                        : 'w-full'
                } h-full relative`}
            >
                <Button
                    className={
                        'absolute top-4 right-4 z-50' +
                        ' ' +
                        `${isOpen ? 'hidden' : ''}`
                    }
                    onClick={toggleIsOpen}
                >
                    <IconLayoutSidebarLeftCollapseFilled
                        className={styles.icon}
                    />
                </Button>
                <Canvas className="bg-[#101713] w-full h-full" />
                <TimeIndicators
                    className={`absolute top-2 left-2 z-50 ${
                        isOpen ? 'hidden sm:flex' : ''
                    }`}
                />

                <div
                    className={`absolute top-1/2 translate-y-[-50%] right-4 z-50 ${
                        isOpen ? 'hidden' : 'flex flex-col gap-2'
                    }`}
                >
                    <FloatBar />
                    <div className="text-stone-900 dark:text-stone-100 dark:bg-stone-800/90 bg-stone-200 border dark:border-stone-700 border-stone-300 items-center justify-center p-3 gap-2 rounded-lg backdrop-blur-md shadow-lg sm:hidden flex flex-col">
                        <OptionsSelect />
                    </div>
                </div>
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.2 }}
                            className="absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center"
                        >
                            <TimeControls />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sidebar con ancho fijo */}
            <SimulationSidebar isOpen={isOpen} />
        </>
    );
}
