// MOCK: eliminar al conectar el backend
// Reuniones virtuales ficticias (regla 9.2). Las usan B1, E2 y F2 hasta que exista G1.
import { enMinutos } from '@/api/mock-utils'
import type { ReunionProxima } from '@/features/dashboard/types/dashboard.types'

interface ReunionMock {
  id: string
  titulo: string
  clienteId: string
  cliente: string
  expedienteId: string | null
  expediente: string | null
  /** Minutos a partir de que se cargó la página. */
  inicio: number
  duracion: number
}

const reunionesMock: ReunionMock[] = [
  { id: 'reu-301', titulo: 'Seguimiento de compraventa', clienteId: 'cli-108', cliente: 'Roberto Garza Sada', expedienteId: 'exp-305', expediente: 'Exp. 305/2026', inicio: 45, duracion: 45 },
  { id: 'reu-302', titulo: 'Asesoría inicial: terminación laboral', clienteId: 'cli-103', cliente: 'Elena Santillán Ruiz', expedienteId: null, expediente: null, inicio: 240, duracion: 45 },
  { id: 'reu-303', titulo: 'Revisión de avances del amparo', clienteId: 'cli-110', cliente: 'Jorge Villaseñor Cano', expedienteId: 'exp-312', expediente: 'Exp. 312/2026', inicio: 60 * 26, duracion: 60 },
  { id: 'reu-304', titulo: 'Firma del convenio de terminación', clienteId: 'cli-103', cliente: 'Elena Santillán Ruiz', expedienteId: 'exp-298', expediente: 'Exp. 298/2026', inicio: 60 * 24 * 3, duracion: 30 },
]

const inicioSesion = Date.now()

/** Próximas reuniones, opcionalmente de un expediente o cliente. */
export function proximasReunionesMock(filtro: { expedienteId?: string; clienteId?: string; limite?: number } = {}): ReunionProxima[] {
  const minutosTranscurridos = (Date.now() - inicioSesion) / 60_000
  return reunionesMock
    .filter(
      (r) =>
        r.inicio + r.duracion > minutosTranscurridos &&
        (!filtro.expedienteId || r.expedienteId === filtro.expedienteId) &&
        (!filtro.clienteId || r.clienteId === filtro.clienteId),
    )
    .sort((a, b) => a.inicio - b.inicio)
    .slice(0, filtro.limite ?? reunionesMock.length)
    .map((r) => ({
      id: r.id,
      titulo: r.titulo,
      cliente: r.cliente,
      inicio: enMinutos(r.inicio - minutosTranscurridos),
      fin: enMinutos(r.inicio + r.duracion - minutosTranscurridos),
      expediente: r.expediente,
    }))
}
