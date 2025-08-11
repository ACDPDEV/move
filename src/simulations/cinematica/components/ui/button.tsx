import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'motion/react';
import styles from '../../consts/styles';

function Button({
    children,
    onClick,
    tooltip,
    className,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    tooltip?: string;
    className?: string;
}) {
    if (tooltip) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.button
                        onClick={onClick}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.75 }}
                        className={styles.button + ' ' + className}
                    >
                        {children}
                    </motion.button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
        );
    }
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.75 }}
            className={styles.button + ' ' + className}
        >
            {children}
        </motion.button>
    );
}

export default Button;
