import { IconHeart } from "@tabler/icons-react";

function Footer() {
    return (
        <footer className="bg-slate-950 py-12 border-t border-white/10 rounded-b-xl">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold gradient-text mb-4">Simuladores Educativos</h3>
                        <p className="text-gray-400 mb-4 max-w-md">
                            Proyecto desarrollado por estudiantes del Colegio San Juan para FENCYT 2025, 
                            con el objetivo de hacer la ciencia más accesible y divertida.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Desarrollado en Trujillo, Perú
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Simulaciones</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Movimiento Rectilíneo</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Movimiento Acelerado</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Caída Libre</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Movimiento Parabólico</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Documentación</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Guías de Uso</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Marco Teórico</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Código Fuente</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-500 text-sm mb-4 md:mb-0">
                            © 2025 Simuladores Educativos - Colegio San Juan. Proyecto FENCYT.
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <IconHeart size={16} />
                                Hecho con pasión por la educación
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;