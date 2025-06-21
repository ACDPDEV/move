import { useState, useEffect } from 'preact/hooks';
import type { ComponentType } from 'preact';
import { Loader } from '@/components/simulators-renderer/Loader';
import { GraphicsAPIDetector, type BrowserSupport } from '@/lib/graphicsSupport';

const ComponentMap: Record<string, () => Promise<any>> = {
    "ley-de-ohm": () => import("@/simulators/ley-de-ohm/Simulator.tsx"),
    "leyes-de-newton": () => import("@/simulators/leyes-de-newton/Simulator.tsx"),
    "movimiento-parabolico": () => import("@/simulators/movimiento-parabolico/Simulator.tsx"),
    "mru": () => import("@/simulators/mru/Simulator"),
    "oscilador-armonico": () => import("@/simulators/oscilador-armonico/Simulator"),
    "radioactividad": () => import("@/simulators/radioactividad/Simulator"),
    "reflexion-de-la-luz": () => import("@/simulators/reflexion-de-la-luz/Simulator"),
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

    return <Component slug={slug} />;
}

export default SimulatorRenderer;