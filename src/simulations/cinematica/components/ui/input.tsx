import React, { forwardRef } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import styles from '../../consts/styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    textPrefix?: string;
    textSuffix?: string;
    tooltip?: string;
    className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ textPrefix, textSuffix, tooltip, className = '', ...props }, ref) => {
        const inputElement = (
            <div className={`${styles.input} ${className}`.trim()}>
                {textPrefix && (
                    <span className={styles.prefix}>{textPrefix}</span>
                )}
                <input
                    ref={ref}
                    className="flex grow w-full h-5 bg-transparent p-0 text-start text-sm text-[#D3DFD8] font-mono focus:outline-none"
                    {...props}
                />
                {textSuffix && (
                    <span className={styles.suffix}>{textSuffix}</span>
                )}
            </div>
        );

        if (!tooltip) return inputElement;

        return (
            <Tooltip>
                <TooltipTrigger asChild>{inputElement}</TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
        );
    },
);

Input.displayName = 'Input';

export default Input;
