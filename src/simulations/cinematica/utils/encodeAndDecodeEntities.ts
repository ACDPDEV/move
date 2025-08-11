import { Entity } from '@/simulations/cinematica/entities/Entity';

export function compressData(data: Entity[]): string {
    let a = [];
    for (const e of data) {
        let shape;
        switch (e.shape) {
            case 'circle':
                shape = 'c';
                break;
            case 'triangle':
                shape = 't';
                break;
            case 'square':
                shape = 's';
                break;
        }
        const arr = [
            Number(e.position.x.toFixed(2)),
            Number(e.position.y.toFixed(2)),
            Number(e.velocity.x.toFixed(2)),
            Number(e.velocity.y.toFixed(2)),
            Number(e.acceleration.x.toFixed(2)),
            Number(e.acceleration.y.toFixed(2)),
            Number(e.radius.toFixed(2)),
            shape,
            e.color,
        ];
        a.push(arr);
    }
    return JSON.stringify(a);
}

export function decompressData(data: string): Entity[] {
    if (!data) return [];
    try {
        const arr = JSON.parse(data);
        const entities: Entity[] = [];
        for (const e of arr) {
            let s: Entity['shape'] = 'circle';
            switch (e[7]) {
                case 'c':
                    s = 'circle';
                    break;
                case 't':
                    s = 'triangle';
                    break;
                case 's':
                    s = 'square';
                    break;
            }
            const props = {
                position: { x: e[0], y: e[1] },
                velocity: { x: e[2], y: e[3] },
                acceleration: { x: e[4], y: e[5] },
                radius: e[6],
                shape: s,
                color: e[8],
            };
            entities.push(new Entity(props));
        }
        return entities;
    } catch (e) {
        return [];
    }
}
