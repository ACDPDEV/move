import React, { forwardRef } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    textPrefix?: string;
    textSuffix?: string;
    tooltip?: string;
    className?: string;
    classNamePrefix?: string;
    classNameSuffix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            textPrefix,
            textSuffix,
            tooltip,
            className = '',
            classNamePrefix = 'text-[#89A996] w-3 h-5 text-sm font-mono',
            classNameSuffix = 'text-[#567663] w-3 h-5 text-sm font-mono',
            ...props
        },
        ref,
    ) => {
        const inputElement = (
            <div className={className.trim()}>
                {textPrefix && (
                    <span className={classNamePrefix}>{textPrefix}</span>
                )}
                <input
                    ref={ref}
                    className="flex grow w-full h-5 bg-transparent p-0 text-start text-sm text-[#D3DFD8] font-mono focus:outline-none"
                    {...props}
                />
                {textSuffix && (
                    <span className={classNameSuffix}>{textSuffix}</span>
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
