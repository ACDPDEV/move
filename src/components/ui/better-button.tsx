import { forwardRef } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { HTMLMotionProps, motion } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<'button'> {
    children?: React.ReactNode;
    tooltip?: string;
    className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            tooltip,
            className = 'w-auto h-9 bg-[#2B3B31] rounded-md flex flex-row p-2 gap-1 items-center justify-center cursor-pointer',
            whileHover = { scale: 1.25 },
            whileTap = { scale: 0.75 },
            ...props
        },
        ref,
    ) => {
        const buttonElement = (
            <motion.button
                ref={ref}
                className={className.trim()}
                whileHover={whileHover}
                whileTap={whileTap}
                {...props}
            >
                {children}
            </motion.button>
        );

        if (!tooltip) return buttonElement;

        return (
            <Tooltip>
                <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
        );
    },
);

Button.displayName = 'Button';

export default Button;
