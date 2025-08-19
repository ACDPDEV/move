import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import styles from '../../consts/styles';

function Input({
    prefix,
    suffix,
    tooltip,
    className,
    value,
    type,
    name,
    ref,
    onChange,
    onBlur,
    onSubmit,
}: {
    prefix?: string;
    suffix?: string;
    tooltip?: string;
    className?: string;
    value?: string | number;
    type?: string;
    name?: string;
    ref?: React.Ref<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onSubmit?: React.FormEventHandler<HTMLInputElement>;
}) {
    if (!tooltip)
        return (
            <div className={styles.input + ' ' + className}>
                {prefix && <span className={styles.prefix}>{prefix}</span>}
                <input
                    className="flex grow w-full h-5 bg-transparet p-0 text-start text-sm text-[#D3DFD8] font-mono focus:outline-none"
                    value={value}
                    type={type}
                    name={name}
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    onSubmit={onSubmit}
                />
                {suffix && <span className={styles.suffix}>{suffix}</span>}
            </div>
        );
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={styles.input + ' ' + className}>
                    {prefix && <span className={styles.prefix}>{prefix}</span>}
                    <input
                        className="flex grow w-full h-5 bg-transparet p-0 text-start text-sm text-[#D3DFD8] font-mono focus:outline-none"
                        value={value}
                        type={type}
                        name={name}
                        ref={ref}
                        onChange={onChange}
                        onBlur={onBlur}
                        onSubmit={onSubmit}
                    />
                    {suffix && <span className={styles.suffix}>{suffix}</span>}
                </div>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
}

export default Input;
