'use client';
import React, { memo, useState } from 'react';
import { useTimeStore } from '../../stores/useTimeStore';
import styles from '../../consts/styles';
import { IconChevronDown } from '@tabler/icons-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { AnimatePresence, motion } from 'motion/react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface TimeSpeedSelectorProps {
    className?: string;
}

const speeds = [0.25, 0.5, 1, 2, 3];

const variants = {
    open: {
        rotate: 180,
    },
    closed: {
        rotate: 0,
    },
};

const useTimeSpeedSelector = () => {
    const speed = useTimeStore((s) => s.speed);
    const updateSpeed = useTimeStore((s) => s.updateSpeed);
    const [open, setOpen] = useState(false);

    const changeOpen = () => {
        setOpen(!open);
    };

    return { speed, open, changeOpen, updateSpeed };
};

const TimeSpeedSelector = memo(
    function TimeSelectorInput({}: TimeSpeedSelectorProps) {
        const { speed, open, changeOpen, updateSpeed } = useTimeSpeedSelector();

        return (
            <Popover open={open} onOpenChange={changeOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <motion.button
                                onClick={changeOpen}
                                whileHover={{ scale: 1.25 }}
                                whileTap={{ scale: 0.75 }}
                                className={styles.button}
                            >
                                <span className="w-[5ch] overflow-hidden font-mono text-[12px] text-[#89A996]">
                                    x{speed}
                                </span>
                                <motion.div
                                    animate={open ? 'open' : 'closed'}
                                    variants={variants}
                                    className="flex items-center justify-center w-5 h-5"
                                >
                                    <IconChevronDown
                                        className={styles.iconSecondary}
                                    />
                                </motion.div>
                            </motion.button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Velocidad de reproducción</TooltipContent>
                </Tooltip>
                <AnimatePresence>
                    {open && (
                        <PopoverContent
                            className="bg-[#202C25] w-fit h-fit p-0 gap-0 border-0"
                            asChild
                        >
                            <motion.div
                                initial={{ opacity: 0.8, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-2 p-2 w-fit bg-[#202C25] rounded-md text-[#89A996] text-[12px] font-mono"
                            >
                                {speeds.map((speed, index) => (
                                    <motion.button
                                        key={speed}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{
                                            delay:
                                                (speeds.length - index - 1) *
                                                0.05,
                                        }}
                                        whileTap={{
                                            scale: 0.75,
                                            transition: { delay: 0 },
                                        }}
                                        whileHover={{
                                            scale: 1.1,
                                            transition: { delay: 0 },
                                        }}
                                        className={styles.button}
                                        onClick={() => {
                                            updateSpeed(speed);
                                        }}
                                    >
                                        x{speed}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </PopoverContent>
                    )}
                </AnimatePresence>
            </Popover>
        );
    },
);

TimeSpeedSelector.displayName = 'TimeSpeedSelector';

export default TimeSpeedSelector;
