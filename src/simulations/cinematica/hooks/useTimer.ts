import { useEffect, useRef } from 'react'
import { useTimeStore, type TimeStore } from '@/simulations/cinematica/store/useTimeStore'

/**
 * useTimer
 * --------
 * Hook que maneja el bucle de simulación:
 * 1) Calcula delta en segundos.
 * 2) Actualiza el tiempo de simulación según delta y velocidad.
 * 3) Actualiza el delta en el store para accesibilidad.
 * 4) Calcula FPS cada segundo.
 */
function useTimer() {
  // --- Parte 1: Selección del estado y acciones del store ---
  const isPlaying = useTimeStore((s: TimeStore) => s.isPlaying)
  const updateTime = useTimeStore((s: TimeStore) => s.updateTime)
  const updateFPS = useTimeStore((s: TimeStore) => s.updateFPS)
  const updateDelta = useTimeStore((s: TimeStore) => s.updateDelta)

  // --- Parte 2: Referencias para guardar timestamps y conteo de frames ---
  const lastTimeRef = useRef<number | null>(null)
  const fpsTimeRef = useRef<number | null>(null)
  const frameCountRef = useRef<number>(0)
  const animationIdRef = useRef<number | null>(null)

  // --- Parte 3: useEffect para iniciar/detener el ciclo según isPlaying ---
  useEffect(() => {
    function loop(now: number) {
      // Inicializar referencias en la primera llamada
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now
        fpsTimeRef.current = now
        return requestAnimationFrame(loop)
      }

      // 1) Calcular delta en segundos
      const deltaSeconds = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      // 2) Obtener estado actual de forma consistente
      const state = useTimeStore.getState()
      const currentTime = state.time
      const currentSpeed = state.speed

      // 3) Actualizar el delta en el store
      updateDelta(deltaSeconds)

      // 4) Actualizar el tiempo de simulación ajustado por speed
      updateTime(currentTime + deltaSeconds * currentSpeed)

      // 5) Calcular FPS
      updateFPS(1 / deltaSeconds )

      // 6) Solicitar el siguiente frame
      animationIdRef.current = requestAnimationFrame(loop)
    }

    function startLoop() {
      if (animationIdRef.current === null) {
        animationIdRef.current = requestAnimationFrame(loop)
      }
    }

    function stopLoop() {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }
      updateDelta(0)
    }

    if (isPlaying) {
      startLoop()
    } else {
      stopLoop()
    }

    return () => {
      stopLoop()
      // Solo reiniciar referencias cuando el componente se desmonta
      lastTimeRef.current = null
      fpsTimeRef.current = null
      frameCountRef.current = 0
    }
  }, [isPlaying, updateTime, updateFPS, updateDelta])

  // Función para reiniciar el timer manualmente (opcional)
  const resetTimer = () => {
    lastTimeRef.current = null
    fpsTimeRef.current = null
    frameCountRef.current = 0
  }

  return { resetTimer }
}

export { useTimer }