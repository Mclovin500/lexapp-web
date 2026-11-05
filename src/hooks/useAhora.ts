import { useEffect, useState } from 'react'

/** Hora actual que se renueva cada `intervaloMs` (para habilitar botones que dependen de la hora). */
export function useAhora(intervaloMs = 30_000): number {
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setAhora(Date.now()), intervaloMs)
    return () => window.clearInterval(id)
  }, [intervaloMs])
  return ahora
}
