import { forwardRef } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ForwardRefComponent, HTMLMotionProps, motion } from 'motion/react';
import styles from '../../consts/styles';

interface ButtonProps extends ForwardRefComponent<HTMLButtonElement, HTMLMotionProps<'button'>> {
    children: React.ReactNode;
    tooltip?: string;
    className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    tooltip,
    className = '',
    ...props
}, ref) => {
    const buttonElement = (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.75 }}
            className={`${styles.button} ${className}`.trim()}
            {...props}
        >
            {children}
        </motion.button>
    );

    if (!tooltip) return buttonElement;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {buttonElement}
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
});

Button.displayName = 'Button';

export default Button;