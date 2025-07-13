import { useState, useEffect } from 'preact/hooks';
import type { ComponentType } from 'preact';
import { Loader } from '@/components/simulations-renderer/Loader';

const ComponentMap: Record<string, () => Promise<any>> = {
    "ley-de-ohm": () => import("@/simulations/ley-de-ohm/Simulator"),
    "leyes-de-newton": () => import("@/simulations/leyes-de-newton/Simulator"),
    "movimiento-parabolico": () => import("@/simulations/movimiento-parabolico/Simulator"),
    "cinematica": () => import("@/simulations/cinematica/SimulationPage"),
    "oscilador-armonico": () => import("@/simulations/oscilador-armonico/Simulator"),
    "radioactividad": () => import("@/simulations/radioactividad/Simulator"),
    "reflexion-de-la-luz": () => import("@/simulations/reflexion-de-la-luz/Simulator"),
}

function SimulationRenderer({ slug }: { slug: string }) {
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

export default SimulationRenderer;