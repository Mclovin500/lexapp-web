// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import type { OpcionExpediente } from '../types/expedientes.types'

/** Mismos identificadores que las notificaciones y movimientos ficticios. */
export const expedientesMock: OpcionExpediente[] = [
  { id: 'exp-290', folio: 'Exp. 290/2026', asunto: 'Juicio reivindicatorio de inmueble', clienteId: 'cli-102' },
  { id: 'exp-298', folio: 'Exp. 298/2026', asunto: 'Terminación laboral de nivel directivo', clienteId: 'cli-103' },
  { id: 'exp-305', folio: 'Exp. 305/2026', asunto: 'Compraventa de local comercial y fideicomiso', clienteId: 'cli-108' },
  { id: 'exp-312', folio: 'Exp. 312/2026', asunto: 'Juicio de amparo contra multa municipal', clienteId: 'cli-110' },
  { id: 'exp-320', folio: 'Exp. 320/2026', asunto: 'Aviso de privacidad y términos de servicio', clienteId: 'cli-107' },
]

export function buscarExpedienteMock(id: string): OpcionExpediente {
  const expediente = expedientesMock.find((e) => e.id === id)
  if (!expediente) throw new ErrorApi('datos_invalidos')
  return expediente
}

export function agregarExpedienteMock(expediente: OpcionExpediente): void {
  expedientesMock.push(expediente)
}

export async function listarOpcionesExpedientesMock(clienteId: string): Promise<OpcionExpediente[]> {
  await esperar(300)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
  return expedientesMock.filter((e) => e.clienteId === clienteId)
}
