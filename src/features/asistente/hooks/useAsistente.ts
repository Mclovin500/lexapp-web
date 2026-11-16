import { useCallback, useEffect, useRef, useState } from 'react'
import { asistenteContent } from '../content/asistente.content'
import { responder } from '../lib/respuestas'
import type { EstadoAsistente, MensajeAsistente, SugerenciaAsistente } from '../types/asistente.types'

/** Latencia simulada de la "respuesta" del asistente (maqueta sin backend). */
const LATENCIA_SIMULADA = 900

let contadorMensajes = 0

function nuevoMensaje(parcial: Omit<MensajeAsistente, 'id' | 'fecha'>): MensajeAsistente {
  contadorMensajes += 1
  return {
    id: `msj-${contadorMensajes}`,
    fecha: new Date().toISOString(),
    ...parcial,
  }
}

function mensajeBienvenida(): MensajeAsistente {
  return nuevoMensaje({ autor: 'asistente', texto: asistenteContent.welcome.texto })
}

/**
 * Estado de la conversación con el asistente.
 * Maqueta 100 % local: no hay servicios ni consultas al backend, solo texto simulado.
 */
export function useAsistente() {
  const [mensajes, setMensajes] = useState<MensajeAsistente[]>(() => [mensajeBienvenida()])
  const [estado, setEstado] = useState<EstadoAsistente>('ocioso')
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current)
    }
  }, [])

  const enviar = useCallback((texto: string, sugerencia?: SugerenciaAsistente) => {
    const consulta = (sugerencia?.etiqueta ?? texto).trim()
    if (!consulta) return

    setMensajes((prev) => [...prev, nuevoMensaje({ autor: 'abogado', texto: consulta })])
    setEstado('escribiendo')

    temporizador.current = setTimeout(() => {
      const { texto: respuesta, accion } = responder(consulta)
      setMensajes((prev) => [...prev, nuevoMensaje({ autor: 'asistente', texto: respuesta, accion })])
      setEstado('ocioso')
    }, LATENCIA_SIMULADA)
  }, [])

  const reiniciar = useCallback(() => {
    if (temporizador.current) clearTimeout(temporizador.current)
    setEstado('ocioso')
    setMensajes([mensajeBienvenida()])
  }, [])

  return { mensajes, estado, enviar, reiniciar }
}
