import { create } from 'zustand';

// Tipos base
type Var = number;
type MathOperator = '==' | '>' | '<' | '>=' | '<=' | '!=';
type LogicOperator = 'and' | 'or' | 'not';

// Interfaz para una comparación básica
interface Unit {
    id: string;
    var1: Var;
    mathOperator: MathOperator;
    var2: Var;
}

// Interfaz para operaciones lógicas que puede contener anidamiento
interface LogicExpression {
    id: string;
    operator: LogicOperator;
    operands: ConditionalExpression[];
}

// Unión de tipos para expresiones condicionales
type ConditionalExpression = Unit | LogicExpression;

// Interfaz principal para condiciones
interface Condition {
    id: string;
    name?: string;
    expression: ConditionalExpression;
    result?: boolean;
    isValid: boolean;
    error?: string;
}

// Utilidades para trabajar con expresiones
class ExpressionUtils {
    // Verifica si una expresión es una Unit
    static isUnit(expression: ConditionalExpression): expression is Unit {
        return 'mathOperator' in expression;
    }

    // Verifica si una expresión es una LogicExpression
    static isLogicExpression(
        expression: ConditionalExpression,
    ): expression is LogicExpression {
        return 'operator' in expression && 'operands' in expression;
    }

    // Evalúa una Unit
    static evaluateUnit(unit: Unit): boolean {
        try {
            const { var1, mathOperator, var2 } = unit;

            switch (mathOperator) {
                case '==':
                    return Math.abs(var1 - var2) < 1e-10;
                case '!=':
                    return Math.abs(var1 - var2) >= 1e-10;
                case '>':
                    return var1 > var2;
                case '<':
                    return var1 < var2;
                case '>=':
                    return var1 >= var2;
                case '<=':
                    return var1 <= var2;
                default:
                    throw new Error(
                        `Operador matemático desconocido: ${mathOperator}`,
                    );
            }
        } catch (error) {
            console.error('Error evaluando Unit:', error);
            return false;
        }
    }

    // Evalúa una expresión completa (recursiva para anidamiento)
    static evaluateExpression(expression: ConditionalExpression): boolean {
        if (this.isUnit(expression)) {
            return this.evaluateUnit(expression);
        }

        if (this.isLogicExpression(expression)) {
            const { operator, operands } = expression;

            switch (operator) {
                case 'and':
                    return (
                        operands.length > 0 &&
                        operands.every((op) => this.evaluateExpression(op))
                    );
                case 'or':
                    return (
                        operands.length > 0 &&
                        operands.some((op) => this.evaluateExpression(op))
                    );
                case 'not':
                    if (operands.length !== 1) {
                        throw new Error(
                            'El operador NOT debe tener exactamente un operando',
                        );
                    }
                    return !this.evaluateExpression(operands[0]);
                default:
                    throw new Error(`Operador lógico desconocido: ${operator}`);
            }
        }

        throw new Error('Expresión desconocida');
    }

    // Valida una expresión
    static validateExpression(expression: ConditionalExpression): {
        isValid: boolean;
        error?: string;
    } {
        try {
            if (this.isUnit(expression)) {
                const { var1, var2, mathOperator } = expression;

                // Validar que las variables sean números válidos
                if (
                    typeof var1 !== 'number' ||
                    typeof var2 !== 'number' ||
                    isNaN(var1) ||
                    isNaN(var2)
                ) {
                    return {
                        isValid: false,
                        error: 'Las variables deben ser números válidos',
                    };
                }

                // Validar operador
                const validOperators: MathOperator[] = [
                    '==',
                    '!=',
                    '>',
                    '<',
                    '>=',
                    '<=',
                ];
                if (!validOperators.includes(mathOperator)) {
                    return {
                        isValid: false,
                        error: `Operador matemático inválido: ${mathOperator}`,
                    };
                }

                return { isValid: true };
            }

            if (this.isLogicExpression(expression)) {
                const { operator, operands } = expression;

                // Validar operador lógico
                const validLogicOperators: LogicOperator[] = [
                    'and',
                    'or',
                    'not',
                ];
                if (!validLogicOperators.includes(operator)) {
                    return {
                        isValid: false,
                        error: `Operador lógico inválido: ${operator}`,
                    };
                }

                // Validar número de operandos
                if (operator === 'not' && operands.length !== 1) {
                    return {
                        isValid: false,
                        error: 'El operador NOT debe tener exactamente un operando',
                    };
                }

                if (
                    (operator === 'and' || operator === 'or') &&
                    operands.length < 2
                ) {
                    return {
                        isValid: false,
                        error: `El operador ${operator.toUpperCase()} debe tener al menos dos operandos`,
                    };
                }

                // Validar recursivamente cada operando
                for (const operand of operands) {
                    const validation = this.validateExpression(operand);
                    if (!validation.isValid) {
                        return validation;
                    }
                }

                return { isValid: true };
            }

            return { isValid: false, error: 'Tipo de expresión desconocido' };
        } catch (error) {
            return {
                isValid: false,
                error: `Error de validación: ${
                    error instanceof Error ? error.message : 'Error desconocido'
                }`,
            };
        }
    }

    // Genera un ID único
    static generateId(): string {
        return `expr_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 11)}`;
    }
}

// Store
type ConditionalStore = {
    conditionals: Condition[];

    // Acciones básicas
    addConditional: (
        conditional: Omit<Condition, 'id' | 'isValid' | 'error'>,
    ) => string;
    removeConditional: (id: string) => void;
    updateConditional: (
        id: string,
        updates: Partial<Omit<Condition, 'id'>>,
    ) => void;

    // Acciones de evaluación
    evaluateConditional: (id: string) => boolean | null;
    evaluateAllConditionals: () => void;

    // Utilidades
    getConditional: (id: string) => Condition | undefined;
    getValidConditionals: () => Condition[];
    clearAllConditionals: () => void;
};

export const useConditionalsStore = create<ConditionalStore>((set, get) => ({
    conditionals: [],

    addConditional: (conditionalData) => {
        const id = ExpressionUtils.generateId();
        const validation = ExpressionUtils.validateExpression(
            conditionalData.expression,
        );

        const conditional: Condition = {
            ...conditionalData,
            id,
            isValid: validation.isValid,
            error: validation.error,
        };

        set((state) => ({
            conditionals: [...state.conditionals, conditional],
        }));

        return id;
    },

    removeConditional: (id: string) => {
        set((state) => ({
            conditionals: state.conditionals.filter((c) => c.id !== id),
        }));
    },

    updateConditional: (id: string, updates) => {
        set((state) => ({
            conditionals: state.conditionals.map((c) => {
                if (c.id !== id) return c;

                const updatedConditional = { ...c, ...updates };

                // Re-validar si se actualiza la expresión
                if (updates.expression) {
                    const validation = ExpressionUtils.validateExpression(
                        updates.expression,
                    );
                    updatedConditional.isValid = validation.isValid;
                    updatedConditional.error = validation.error;
                }

                return updatedConditional;
            }),
        }));
    },

    evaluateConditional: (id: string) => {
        const conditional = get().conditionals.find((c) => c.id === id);
        if (!conditional) return null;

        if (!conditional.isValid) {
            console.warn(`Intentando evaluar condicional inválido: ${id}`);
            return null;
        }

        try {
            const result = ExpressionUtils.evaluateExpression(
                conditional.expression,
            );

            // Actualizar el resultado en el store
            get().updateConditional(id, { result });

            return result;
        } catch (error) {
            console.error(`Error evaluando condicional ${id}:`, error);
            return null;
        }
    },

    evaluateAllConditionals: () => {
        const conditionals = get().conditionals;
        const updates: { id: string; result: boolean | undefined }[] = [];

        conditionals.forEach((conditional) => {
            if (conditional.isValid) {
                try {
                    const result = ExpressionUtils.evaluateExpression(
                        conditional.expression,
                    );
                    updates.push({ id: conditional.id, result });
                } catch (error) {
                    console.error(
                        `Error evaluando condicional ${conditional.id}:`,
                        error,
                    );
                    updates.push({ id: conditional.id, result: undefined });
                }
            }
        });

        // Aplicar todas las actualizaciones de una vez
        set((state) => ({
            conditionals: state.conditionals.map((c) => {
                const update = updates.find((u) => u.id === c.id);
                return update ? { ...c, result: update.result } : c;
            }),
        }));
    },

    getConditional: (id: string) => {
        return get().conditionals.find((c) => c.id === id);
    },

    getValidConditionals: () => {
        return get().conditionals.filter((c) => c.isValid);
    },

    clearAllConditionals: () => {
        set({ conditionals: [] });
    },
}));

// Exportar tipos y utilidades
export type {
    ConditionalStore,
    Condition,
    ConditionalExpression,
    Unit,
    LogicExpression,
    Var,
    MathOperator,
    LogicOperator,
};

export { ExpressionUtils };

// Funciones helper para crear expresiones más fácilmente
export const createUnit = (
    var1: Var,
    operator: MathOperator,
    var2: Var,
): Unit => ({
    id: ExpressionUtils.generateId(),
    var1,
    mathOperator: operator,
    var2,
});

export const createLogicExpression = (
    operator: LogicOperator,
    ...operands: ConditionalExpression[]
): LogicExpression => ({
    id: ExpressionUtils.generateId(),
    operator,
    operands,
});

// Ejemplo de uso:
/*
const store = useConditionalsStore.getState();

// Crear una expresión simple: 5 > 3
const simpleCondition = createUnit(5, '>', 3);

// Crear una expresión compleja anidada: (5 > 3) AND ((2 < 4) OR (1 == 1))
const complexCondition = createLogicExpression(
    'and',
    createUnit(5, '>', 3),
    createLogicExpression(
        'or',
        createUnit(2, '<', 4),
        createUnit(1, '==', 1)
    )
);

// Añadir al store
const id = store.addConditional({
    name: 'Condición Compleja',
    expression: complexCondition
});

// Evaluar
const result = store.evaluateConditional(id);
console.log(result); // true
*/
