import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import Button from '@/components/ui/better-button';
import {
    IconArrowDownRightCircle,
    IconComponents,
    IconPlus,
} from '@tabler/icons-react';
import styles from '@/simulations/cinematica/consts/styles';
import { useVariablesStore } from '@/simulations/cinematica/stores/useVariablesStore';

const predefinedVariables = [
    {
        name: 'Gravedad de la Tierra',
        type: 'acceleration',
        value: { x: 0, y: -9.81 },
    },
    {
        name: 'Gravedad de Mercurio',
        type: 'acceleration',
        value: { x: 0, y: -3.7 },
    },
    {
        name: 'Gravedad de Venus',
        type: 'acceleration',
        value: { x: 0, y: -8.87 },
    },
    {
        name: 'Gravedad de Marte',
        type: 'acceleration',
        value: { x: 0, y: -3.71 },
    },
    {
        name: 'Gravedad de Júpiter',
        type: 'acceleration',
        value: { x: 0, y: -24.79 },
    },
    {
        name: 'Gravedad de Saturno',
        type: 'acceleration',
        value: { x: 0, y: -10.44 },
    },
    {
        name: 'Gravedad de Urano',
        type: 'acceleration',
        value: { x: 0, y: -8.69 },
    },
    {
        name: 'Gravedad de Neptuno',
        type: 'acceleration',
        value: { x: 0, y: -11.15 },
    },
    {
        name: 'Gravedad de la Luna',
        type: 'acceleration',
        value: { x: 0, y: -1.62 },
    },
];

type VariableType = 'velocity' | 'acceleration';

function PredefinedVariables() {
    const variables = useVariablesStore((s) => s.variables);
    const addVariable = useVariablesStore((s) => s.addVariable);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button tooltip="Variables predefinidas">
                    <IconComponents className={styles.icon} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" asChild>
                <div className="flex flex-col bg-[#202C25] w-16 h-fit max-h-72 overflow-y-scroll p-2 gap-2 border-0">
                    {predefinedVariables.map((variable) => {
                        const disabled = variables.find(
                            (v) => v.name === variable.name,
                        )
                            ? true
                            : false;
                        return (
                            <button
                                key={variable.name}
                                className="flex flex-row w-full items-center justify-between bg-[#202C25] p-2 gap-1 rounded-md"
                                onClick={() =>
                                    addVariable(
                                        variable.name,
                                        variable.type as VariableType,
                                        variable.value,
                                    )
                                }
                                disabled={disabled}
                            >
                                <span className="flex flex-row gap-3 items-center">
                                    <IconArrowDownRightCircle
                                        className={styles.icon}
                                    />
                                    <span
                                        className={
                                            disabled
                                                ? 'text-[#567663] font-mono text-sm'
                                                : 'text-[#89A996] font-mono text-sm'
                                        }
                                    >
                                        {variable.name}
                                    </span>
                                </span>
                                <IconPlus className={styles.iconSecondary} />
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default PredefinedVariables;
