import { IconArrowRight, IconBook } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

function Ready() {
    return (
        <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para explorar?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Descubre cómo la física puede ser divertida y fácil de entender con nuestras simulaciones interactivas
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/simulations/">
                        <Button className="bg-white text-blue-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                            Comenzar ahora
                            <IconArrowRight size={24} />
                        </Button>
                    </Link>
                    <Link href="/paper/">
                        <Button className="border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2">
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