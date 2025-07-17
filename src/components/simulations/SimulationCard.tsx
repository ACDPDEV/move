import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  IconPlayerPlay, 
  IconClock, 
  IconArrowLeft, 
  IconExternalLink,
  IconEye,
  IconBookmark,
  IconShare,
  IconStar,
  IconUsers,
  IconTrendingUp
} from "@tabler/icons-react";
import { Simulation } from "@/data/simulations";

function SimulationCard({ simulation, showBackButton = false }:{
    simulation: Simulation | undefined;
    showBackButton?: boolean;
}) {
  if (!simulation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-2xl">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Simulador no encontrado
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              No pudimos encontrar el simulador que buscas.
            </p>
            <Link href="/">
              <Button variant="outline" className="group">
                <IconArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-green-500 shadow-green-500/50';
      case 'Intermedio':
        return 'bg-yellow-500 shadow-yellow-500/50';
      case 'Avanzado':
        return 'bg-red-500 shadow-red-500/50';
      default:
        return 'bg-gray-500 shadow-gray-500/50';
    }
  };

  const getDifficultyDots = (difficulty: string) => {
    const dots = [];
    const activeCount = difficulty === 'Básico' ? 1 : difficulty === 'Intermedio' ? 2 : 3;
    
    for (let i = 0; i < 3; i++) {
      dots.push(
        <div 
          key={i} 
          className={`w-3 h-3 rounded-full ${
            i < activeCount 
              ? 'bg-blue-500 shadow-sm shadow-blue-500/50' 
              : 'bg-slate-300 dark:bg-slate-600'
          }`} 
        />
      );
    }
    return dots;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header con navegación */}
        {showBackButton && (
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
            >
              <IconArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver a simuladores
            </Link>
          </div>
        )}

        {/* CTA Principal - Visible solo en móvil */}
        <div className="lg:hidden mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-4xl">🚀</div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {simulation.isAvaible ? '¿Listo para comenzar?' : 'Próximamente'}
                </h2>
                
                <div className="space-y-3">
                  {simulation.isAvaible ? (
                    <>
                      <Link href={simulation.playLink}>
                        <Button 
                          size="lg" 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                        >
                          <IconPlayerPlay className="w-5 h-5 mr-2" />
                          Iniciar simulación
                          <IconExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href={simulation.previewLink}>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                        >
                          <IconEye className="w-4 h-4 mr-2" />
                          Vista previa
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        size="lg" 
                        disabled 
                        className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                      >
                        <IconClock className="w-4 h-4 mr-2" />
                        Próximamente disponible
                      </Button>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Estamos trabajando en este simulador
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Imagen Hero - 8 columnas en desktop */}
          <div className="lg:col-span-8">
            <Card className="group overflow-hidden border-0 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 10} className="relative overflow-hidden">
                  {/* Imagen con efecto de degradado */}
                  <div className="absolute inset-0">
                    <img
                      src={`/img/${simulation.image}`}
                      alt={simulation.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Degradado superpuesto */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 dark:from-blue-600/40 dark:via-purple-600/30 dark:to-pink-600/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  
                  {/* Contenido superpuesto */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                    <div className="space-y-4">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {simulation.area.map((area, index) => (
                          <Badge 
                            key={index}
                            className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Título */}
                      <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                        {simulation.name}
                      </h1>
                      
                      {/* Descripción */}
                      <p className="text-white/90 text-lg lg:text-xl max-w-2xl leading-relaxed">
                        {simulation.description}
                      </p>
                    </div>
                  </div>
                </AspectRatio>
              </CardContent>
            </Card>
          </div>

          {/* Información lateral - 4 columnas en desktop */}
          <div className="lg:col-span-4 space-y-6">
            {/* CTA Principal - Visible solo en desktop/tablet */}
            <div className="hidden lg:block">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 shadow-xl">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-4xl">🚀</div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {simulation.isAvaible ? '¿Listo para comenzar?' : 'Próximamente'}
                    </h2>
                    
                    <div className="space-y-3">
                      {simulation.isAvaible ? (
                        <>
                          <Link href={simulation.playLink}>
                            <Button 
                              size="lg" 
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                            >
                              <IconPlayerPlay className="w-5 h-5 mr-2" />
                              Iniciar simulación
                              <IconExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                          <Link href={simulation.previewLink}>
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                            >
                              <IconEye className="w-4 h-4 mr-2" />
                              Vista previa
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            size="lg" 
                            disabled 
                            className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                          >
                            <IconClock className="w-4 h-4 mr-2" />
                            Próximamente disponible
                          </Button>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Estamos trabajando en este simulador
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estadísticas rápidas - Solo si está disponible */}
            {simulation.isAvaible && (
              <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <IconStar className="w-5 h-5 text-yellow-500 mr-1" />
                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {/* {simulation.rating} */}
                          ?
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Valoración</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <IconUsers className="w-5 h-5 text-blue-500 mr-1" />
                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {/* {simulation.userCount} */}
                          ?
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Usuarios</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información del simulador */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Detalles</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                      <IconBookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                      <IconShare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Estado */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Estado
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      simulation.isAvaible 
                        ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                        : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                    }`} />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {simulation.isAvaible ? 'Disponible' : 'En desarrollo'}
                    </span>
                  </div>
                </div>
                
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                
                {/* Áreas */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Áreas de estudio
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {simulation.area.map((area, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                
                {/* Dificultad */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Dificultad
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {getDifficultyDots(simulation.difficulty)}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {simulation.difficulty}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Grid de características */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Características */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Características</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {simulation.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contenido descriptivo */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Acerca de este simulador</h3>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                {simulation.content}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default SimulationCard;