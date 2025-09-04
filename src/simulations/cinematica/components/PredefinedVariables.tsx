import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Button from "./ui/button";
import { IconArrowDownRightCircle, IconComponents, IconPlus } from "@tabler/icons-react";
import styles from "../consts/styles";
import { useVariablesStore } from "../stores/useVariablesStore";

const predefinedVariables = [
    {
        name: 'gravedad',
        type: 'acceleration',
        value: { x: 0, y: -9.81 },
    },
];

type VariableType = 'velocity' | 'acceleration';

function PredefinedVariables() {
    const variables = useVariablesStore((s) => s.variables);
    const addVariable = useVariablesStore((s) => s.addVariable);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    tooltip="Variables predefinidas"
                >
                    <IconComponents className={styles.icon} />
                </Button>
            </PopoverTrigger>
            <PopoverContent  className="p-0" asChild>
                <div className="bg-[#202C25] w-16 h-fit p-2 gap-2 border-0">
                {
                        predefinedVariables.map((variable) => { 
                        const disabled = variables.find((v) => v.name === variable.name) ? true : false;
                        return (
                        <button key={variable.name} className="flex flex-row w-full items-center justify-between bg-[#202C25] p-2 gap-1 rounded-md" onClick={() => addVariable(
                            variable.name,
                            variable.type as VariableType,
                            variable.value,
                        )}
                            disabled={disabled}
                        >
                            <span className="flex flex-row gap-3 items-center">
                                <IconArrowDownRightCircle className={styles.icon} />
                                <span className={disabled ? styles.suffix : styles.preffix}>
                                    {variable.name}
                                </span>
                            </span>
                            <IconPlus className={styles.iconSecondary} />
                        </button>
                        ) 
                    }
                    )
                }
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default PredefinedVariables;