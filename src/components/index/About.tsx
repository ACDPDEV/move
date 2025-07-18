function About() {
    return (
        <section className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-8">Sobre el Proyecto</h2>
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                            Somos un equipo de estudiantes del <strong className="text-blue-400">Colegio San Juan</strong> participando en 
                            <strong className="text-purple-400">FENCYT 2025</strong>. Nuestro objetivo es revolucionar la forma en que 
                            se aprenden las ciencias en el Perú.
                        </p>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                            Creemos que la educación debe ser <strong className="text-blue-400">interactiva</strong>, 
                            <strong className="text-purple-400">divertida</strong> y <strong className="text-cyan-400">accesible</strong> 
                            para todos los estudiantes, independientemente de su idioma o ubicación.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-400 mb-2">4</div>
                                <div className="text-gray-300">Simulaciones de Cinemática</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
                                <div className="text-gray-300">Interactivo</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">2025</div>
                                <div className="text-gray-300">FENCYT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;