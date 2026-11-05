// MOCK: eliminar al conectar el backend
// Simula al cliente: entra a los 4 s, la conexión se establece en 2 s. Si el navegador pierde la red
// (evento `offline`) o se usa "Simular corte", pasa a "Conexión interrumpida" y se recupera sola.
import type { AccesoSala } from '../types/agenda.types'
import type { ConexionVideollamada, EstadoConexion } from './videollamada.service'

const CLIENTE_ENTRA_MS = 4000
const CONECTA_MS = 2000
const RECONECTA_MS = 3000

export async function conectarVideollamadaMock(acceso: AccesoSala, onEstado: (estado: EstadoConexion) => void): Promise<ConexionVideollamada> {
  if (!acceso.token) throw new Error('Credencial de sala vacía')
  const temporizadores = new Set<number>()
  let activa = false

  const despues = (milisegundos: number, accion: () => void) => {
    const id = window.setTimeout(() => {
      temporizadores.delete(id)
      accion()
    }, milisegundos)
    temporizadores.add(id)
  }
  const limpiar = () => {
    for (const id of temporizadores) window.clearTimeout(id)
    temporizadores.clear()
  }
  const reconectar = (espera: number) => {
    limpiar()
    onEstado('interrumpida')
    despues(espera, () => {
      onEstado('conectando')
      despues(CONECTA_MS, () => onEstado('activa'))
    })
  }

  const alPerderRed = () => {
    if (!activa) return
    limpiar()
    onEstado('interrumpida')
  }
  const alRecuperarRed = () => {
    if (!activa) return
    onEstado('conectando')
    despues(CONECTA_MS, () => onEstado('activa'))
  }
  window.addEventListener('offline', alPerderRed)
  window.addEventListener('online', alRecuperarRed)

  onEstado('esperando_cliente')
  despues(CLIENTE_ENTRA_MS, () => {
    onEstado('conectando')
    despues(CONECTA_MS, () => {
      activa = true
      onEstado('activa')
    })
  })

  return {
    desconectar: () => {
      limpiar()
      window.removeEventListener('offline', alPerderRed)
      window.removeEventListener('online', alRecuperarRed)
    },
    simularCorte: () => {
      if (activa) reconectar(RECONECTA_MS)
    },
  }
}
