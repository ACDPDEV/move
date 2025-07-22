'use client'

import {
  IconPlayerPause,
  IconPlayerPlay,
  IconReload,
  IconComponents,
  IconComponentsOff,
  IconSettings,
} from '@tabler/icons-react'
import { useTimeStore } from '@/simulations/cinematica/store/useTimeStore'
import { useDisplayStore } from '@/simulations/cinematica/store/useDisplayStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function TimeControls() {
  const { increaseSpeed, decreaseSpeed, setSpeed, updatePrediction, togglePlayer, reset, updateTime, updateInputTimeChange } = useTimeStore()
  const { togglePositionResultant, togglePositionComponents, togglePositionAngle, toggleVelocityResultant, toggleVelocityComponents, toggleVelocityAngle, toggleAccelerationResultant, toggleAccelerationComponents, toggleAccelerationAngle, toggleTrajectory, toggleCoordinates, toggleAxes } = useDisplayStore()
  const { position, velocity, acceleration, trajectory, coordinates, axes } = useDisplayStore()

  // Select store values
  const time = useTimeStore.getState().time
  const speed = useTimeStore.getState().speed
  const isPlaying = useTimeStore.getState().isPlaying
  const movementPrediction = useTimeStore.getState().movementPrediction

  return (
    <div className="flex flex-row bg-stone-800/90 border border-stone-700 items-center justify-center p-3 gap-3 rounded-lg backdrop-blur-md shadow-lg">
      {/* Time input */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400 whitespace-nowrap">Tiempo:</span>
        <input
          type="number"
          value={time.toFixed(2)}
          onChange={e => {
            updateInputTimeChange(useTimeStore.getState().time - parseFloat(e.target.value));
            updateTime(parseFloat(e.target.value) || 0);
          }}
          className="w-20 text-center text-sm text-stone-200 bg-stone-700 border border-stone-600 rounded px-2 py-1 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          step="0.01"
          min="0"
        />
        <button
          onClick={() => updatePrediction(!movementPrediction)}
          title="Predecir movimiento"
          className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-500"
          type="button"
        >
          {movementPrediction ? <IconComponents size={20} /> : <IconComponentsOff size={20} />}
        </button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-stone-600" />

      {/* Speed input */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-400 whitespace-nowrap">Velocidad:</span>
        <button
          onClick={decreaseSpeed}
          disabled={speed <= 0.1}
          className="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-stone-500"
          type="button"
          title="Disminuir velocidad"
        >
          -
        </button>
        <input
          type="number"
          min="0.1"
          max="3"
          step="0.1"
          value={speed.toFixed(1)}
          onChange={(e) => setSpeed(Number(e.target.value))}
          onBlur={(e) => setSpeed(Number(e.target.value))}
          className="w-12 text-center text-sm text-stone-200 bg-stone-700 border border-stone-600 rounded px-1 py-1 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={increaseSpeed}
          disabled={speed >= 3}
          className="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-stone-500"
          type="button"
          title="Aumentar velocidad"
        >
          +
        </button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-stone-600" />

      {/* Display options popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-500"
            type="button"
            title="Opciones de visualización"
          >
            <IconSettings size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 bg-stone-800 border-stone-700" align="end">
          <div className="space-y-3">
            {/* Position */}
            <div>
              <h4 className="text-xs text-stone-400 mb-2 font-medium">Posición</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${position.resultant ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={togglePositionResultant}
                >
                  Resultante
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${position.components ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={togglePositionComponents}
                >
                  Componentes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${position.angle ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={togglePositionAngle}
                >
                  Ángulo
                </Button>
              </div>
            </div>

            {/* Velocity */}
            <div>
              <h4 className="text-xs text-stone-400 mb-2 font-medium">Velocidad</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${velocity.resultant ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleVelocityResultant}
                >
                  Resultante
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${velocity?.components ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleVelocityComponents}
                >
                  Componentes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${velocity?.angle ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleVelocityAngle}
                >
                  Ángulo
                </Button>
              </div>
            </div>

            {/* Acceleration */}
            <div>
              <h4 className="text-xs text-stone-400 mb-2 font-medium">Aceleración</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${acceleration.resultant ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleAccelerationResultant}
                >
                  Resultante
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${acceleration.components ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleAccelerationComponents}
                >
                  Componentes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${acceleration.angle ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleAccelerationAngle}
                >
                  Ángulo
                </Button>
              </div>
            </div>

            <Separator className="bg-stone-700" />

            {/* Additional options */}
            <div>
              <h4 className="text-xs text-stone-400 mb-2 font-medium">Otros</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${trajectory ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleTrajectory}
                >
                  Trayectoria
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${coordinates ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleCoordinates}
                >
                  Coordenadas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-left ${axes ? 'bg-stone-700 text-white' : 'text-stone-300 hover:text-white hover:bg-stone-700'}`}
                  onClick={toggleAxes} 
                >
                  Ejes
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6 bg-stone-600" />

      {/* Play/Pause & Reset */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayer}
          title={isPlaying ? 'Pausar' : 'Reproducir'}
          className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-500"
          type="button"
        >
          {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
        </button>
        <button
          onClick={() => reset(time)}
          title="Reiniciar simulación"
          className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-500"
          type="button"
        >
          <IconReload size={20} />
        </button>
      </div>
    </div>
  )
}