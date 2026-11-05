// MOCK: eliminar al conectar el backend
// E2: combina el expediente con su cliente, documentos, pagos y reuniones (en el backend, un solo endpoint).
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { proximasReunionesMock } from '@/features/agenda/services/reuniones.mock'
import { clientesMock } from '@/features/clientes/services/clientes.mock'
import { movimientosDeMock } from '@/features/pagos/services/pagos.mock'
import type { ExpedienteDetalle } from '../types/expedientes.types'
import { documentosDeExpedienteMock } from './documentos.mock'
import { aResumenExpedienteMock, obtenerRegistroExpedienteMock } from './expedientes.mock'

export async function obtenerExpedienteMock(id: string): Promise<ExpedienteDetalle> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')

  const registro = obtenerRegistroExpedienteMock(id)
  const resumen = aResumenExpedienteMock(registro)
  const cliente = clientesMock.find((c) => c.id === registro.clienteId)
  if (!cliente) throw new ErrorApi('no_encontrado')
  const documentos = documentosDeExpedienteMock(id)

  return {
    ...resumen,
    cliente: { ...resumen.cliente, tipoPersona: cliente.tipoPersona, correo: cliente.correo, telefono: cliente.telefono },
    descripcion: registro.descripcion,
    propuesta: registro.propuesta && { ...registro.propuesta },
    historial: [...registro.historial].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((e) => ({ ...e })),
    actualizaciones: [...registro.actualizaciones].sort((a, b) => b.fecha.localeCompare(a.fecha)).map((a) => ({ ...a })),
    documentos: {
      total: documentos.length,
      pendientesRevision: documentos.filter((d) => d.estado === 'pendiente_revision').length,
      recientes: documentos.slice(0, 3),
    },
    pagos: movimientosDeMock({ expedienteId: id }),
    proximasReuniones: proximasReunionesMock({ expedienteId: id }),
  }
}
