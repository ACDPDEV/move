import { Variable } from '@/simulations/cinematica/stores/useVariablesStore';

export function compressVars(data: Variable[]): string {
    const a = [];
    for (const v of data) {
        let type;
        switch (v.type) {
            case 'velocity':
                type = 'v';
                break;
            case 'acceleration':
                type = 'a';
                break;
        }
        const arr = [
            v.name,
            type,
            Number(v.value.x.toFixed(2)),
            Number(v.value.y.toFixed(2)),
            Number(v.active),
        ];
        a.push(arr);
    }
    return JSON.stringify(a);
}

interface VariableWithoutId {
    name: string;
    type: 'velocity' | 'acceleration';
    value: { x: number; y: number };
    active: boolean;
}

export function decompressVars(data: string): VariableWithoutId[] {
    if (!data) return [];
    try {
        const arr = JSON.parse(data);
        const variables: VariableWithoutId[] = [];
        for (const v of arr) {
            let type: VariableWithoutId['type'] = 'velocity';
            switch (v[1]) {
                case 'v':
                    type = 'velocity';
                    break;
                case 'a':
                    type = 'acceleration';
                    break;
            }
            const props = {
                name: v[0],
                type,
                value: { x: v[2], y: v[3] },
                active: Boolean(v[4]),
            };
            variables.push(props);
        }
        return variables;
    } catch (e) {
        return [];
    }
}
