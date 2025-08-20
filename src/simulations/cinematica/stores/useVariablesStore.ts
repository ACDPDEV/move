import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Vector2D } from '@/simulations/lib/utils';

type Variable = {
    id: string;
    name: string;
    type: 'velocity' | 'acceleration';
    value: Vector2D;
    active: boolean;
};

type VariablesStore = {
    variables: Variable[];
    addVariable: (
        name: string,
        type: 'velocity' | 'acceleration',
        value: { x: number; y: number },
    ) => void;
    updateVariable: (
        id: string,
        updates: Partial<Omit<Variable, 'id' | 'value'>> & {
            value?: { x: number; y: number };
        },
    ) => void;
    toggleVariable: (id: string) => void;
    deleteVariable: (id: string) => void;
    getVariableById: (id: string) => Variable | undefined;
    getVariablesByType: (type: 'velocity' | 'acceleration') => Variable[];
    getActiveVariables: () => Variable[];
};

const useVariablesStore = create<VariablesStore>((set, get) => ({
    variables: [],

    addVariable: (
        name: string,
        type: 'velocity' | 'acceleration',
        value: { x: number; y: number },
    ) => {
        // Validación básica
        if (!name.trim()) {
            throw new Error('El nombre de la variable no puede estar vacío');
        }

        // Verificar si ya existe una variable con el mismo nombre
        const { variables } = get();
        if (
            variables.some((v) => v.name.toLowerCase() === name.toLowerCase())
        ) {
            throw new Error('Ya existe una variable con ese nombre');
        }

        set((state) => ({
            variables: [
                ...state.variables,
                {
                    id: uuidv4(),
                    name: name.trim(),
                    type,
                    value: new Vector2D(value.x, value.y),
                    active: true,
                },
            ],
        }));
    },

    updateVariable: (
        id: string,
        updates: Partial<Omit<Variable, 'id' | 'value'>> & {
            value?: { x: number; y: number };
        },
    ) => {
        const { variables } = get();

        // Verificar que la variable existe
        if (!variables.find((v) => v.id === id)) {
            throw new Error('Variable no encontrada');
        }

        // Si se actualiza el nombre, verificar que no existe otro con el mismo nombre
        if (updates.name) {
            const trimmedName = updates.name.trim();
            if (!trimmedName) {
                throw new Error('El nombre no puede estar vacío');
            }

            const existingVariable = variables.find(
                (v) =>
                    v.id !== id &&
                    v.name.toLowerCase() === trimmedName.toLowerCase(),
            );
            if (existingVariable) {
                throw new Error('Ya existe una variable con ese nombre');
            }
            updates.name = trimmedName;
        }

        set((state) => ({
            variables: state.variables.map((variable) =>
                variable.id === id
                    ? {
                          ...variable,
                          ...updates,
                          // Convertir value a Vector2D si se proporciona
                          value: updates.value
                              ? new Vector2D(updates.value.x, updates.value.y)
                              : variable.value,
                      }
                    : variable,
            ),
        }));
    },

    toggleVariable: (id: string) => {
        const { variables } = get();

        if (!variables.find((v) => v.id === id)) {
            throw new Error('Variable no encontrada');
        }

        set((state) => ({
            variables: state.variables.map((variable) =>
                variable.id === id
                    ? { ...variable, active: !variable.active }
                    : variable,
            ),
        }));
    },

    deleteVariable: (id: string) => {
        const { variables } = get();

        if (!variables.find((v) => v.id === id)) {
            throw new Error('Variable no encontrada');
        }

        set((state) => ({
            variables: state.variables.filter((variable) => variable.id !== id),
        }));
    },

    // Métodos de consulta útiles
    getVariableById: (id: string) => {
        return get().variables.find((v) => v.id === id);
    },

    getVariablesByType: (type: 'velocity' | 'acceleration') => {
        return get().variables.filter((v) => v.type === type);
    },

    getActiveVariables: () => {
        return get().variables.filter((v) => v.active);
    },
}));

// Hook personalizado para inicializar variables por defecto
export const useInitializeDefaultVariables = () => {
    const addVariable = useVariablesStore((state) => state.addVariable);
    const variables = useVariablesStore((state) => state.variables);

    const initializeDefaults = () => {
        // Solo inicializar si no hay variables
        if (variables.length === 0) {
            addVariable('gravedad', 'acceleration', { x: 0, y: -9.81 });
        }
    };

    return initializeDefaults;
};

export { useVariablesStore, type VariablesStore, type Variable };
