import { useState, useEffect } from 'preact/hooks';
import type { ComponentType } from 'preact';
import { Loader } from '@/components/simulators/Loader';
import { GraphicsAPIDetector, type BrowserSupport } from '@/lib/graphicsSupport';

const ComponentMap: Record<string, () => Promise<any>> = {
    "ley-de-ohm": () => import("@/components/simulators/ley-de-ohm/Simulator.tsx"),
    "leyes-de-newton": () => import("@/components/simulators/leyes-de-newton/Simulator.tsx"),
    "movimiento-parabolico": () => import("@/components/simulators/movimiento-parabolico/Simulator.tsx"),
    "mru": () => import("@/components/simulators/mru/Simulator"),
    "oscilador-armonico": () => import("@/components/simulators/oscilador-armonico/Simulator.tsx"),
    "radioactividad": () => import("@/components/simulators/radioactividad/Simulator.tsx"),
    "reflexion-de-la-luz": () => import("@/components/simulators/reflexion-de-la-luz/Simulator.tsx"),
}

function SimulatorRenderer({ slug }: { slug: string }) {
    const [Component, setComponent] = useState<ComponentType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadComponent = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const importFn = ComponentMap[slug];
                if (!importFn) {
                    setError('Simulador no encontrado');
                    return;
                }
                
                const module = await importFn();
                setComponent(() => module.default || module);
            } catch (error) {
                setError('Error al cargar el simulador');
                console.error('Error loading component:', error);
            } finally {
                setLoading(false);
            }
        };

        loadComponent();
    }, [slug]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!Component) {
        return <div>Simulador no disponible</div>;
    }

    return <Component />;
}

export default SimulatorRenderer;