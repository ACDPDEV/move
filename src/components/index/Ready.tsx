import { IconArrowRight, IconBook } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Ready() {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-900 dark:to-purple-900 transition-colors duration-300">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para explorar?</h2>
                <p className="text-xl text-blue-50 dark:text-blue-100 mb-8 max-w-2xl mx-auto">
                    Descubre cómo la física puede ser divertida y fácil de entender con nuestras simulaciones interactivas
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/simulations/">
                        <Button className="bg-white dark:bg-gray-100 text-blue-900 dark:text-blue-800 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0 flex items-center gap-2">
                            Comenzar ahora
                            <IconArrowRight size={24} />
                        </Button>
                    </Link>
                    <Link href="/paper/">
                        <Button className="border-2 border-white dark:border-gray-200 text-white dark:text-gray-100 bg-transparent hover:bg-white/10 dark:hover:bg-gray-100/10 font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
                            Ver documentación
                            <IconBook size={24} />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Ready;