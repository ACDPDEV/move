import { IconStereoGlasses } from "@tabler/icons-react";
import Link from "next/link";

function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-slate-950 py-12 border-t border-gray-300 dark:border-white/10 rounded-b-xl transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold gradient-text mb-4">Simuladores Educativos</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                            Proyecto desarrollado por estudiantes del Colegio San Juan para FENCYT 2025, 
                            con el objetivo de hacer la ciencia más accesible y divertida.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Desarrollado en Trujillo, Perú
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Simulaciones</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Movimiento Rectilíneo</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Movimiento Acelerado</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Caída Libre</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Movimiento Parabólico</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recursos</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li><Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Documentación</Link></li>
                            <li><Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Guías de Uso</Link></li>
                            <li><Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Marco Teórico</Link></li>
                            <li><Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Código Fuente</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-300 dark:border-white/10 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-500 dark:text-gray-500 text-sm mb-4 md:mb-0">
                            © 2025 Simuladores Educativos - Colegio San Juan. Proyecto FENCYT.
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-2">
                                <IconStereoGlasses size={16} className="text-red-500 dark:text-red-400" />
                                Hecho con fines educativos
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;