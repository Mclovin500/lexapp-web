import { useCallback, useEffect, useState } from 'react'

function formatear(segundos: number): string {
  const minutos = Math.floor(segundos / 60)
  const resto = segundos % 60
  return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`
}

/**
 * Cuenta regresiva en segundos basada en una hora de fin, para no desfasarse
 * si el navegador ralentiza la pestaña. Se limpia al desmontar.
 */
export function useTemporizador(segundosIniciales: number) {
  const [fin, setFin] = useState(() => Date.now() + segundosIniciales * 1000)
  const [restantes, setRestantes] = useState(Math.max(0, segundosIniciales))

  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevo = Math.max(0, Math.ceil((fin - Date.now()) / 1000))
      setRestantes(nuevo)
      if (nuevo === 0) clearInterval(intervalo)
    }, 250)
    return () => clearInterval(intervalo)
  }, [fin])

  const reiniciar = useCallback((segundos: number) => {
    setFin(Date.now() + segundos * 1000)
    setRestantes(Math.max(0, segundos))
  }, [])

  return {
    restantes,
    formateado: formatear(restantes),
    terminado: restantes === 0,
    reiniciar,
  }
}
