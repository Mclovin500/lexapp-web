// MOCK: eliminar al conectar el backend
import { enMinutos, esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import {
  contarSolicitudesNuevasMock,
  solicitudesNuevasRecientesMock,
} from '@/features/solicitudes/services/solicitudes.mock'
import { movimientosRecientesMock } from '@/features/pagos/services/pagos.mock'
import { contarPropuestasPendientesMock } from '@/features/propuestas/services/propuestas.mock'
import type { ResumenDashboard } from '../types/dashboard.types'

export async function obtenerResumenDashboardMock(): Promise<ResumenDashboard> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')

  const proximasReuniones = [
    { id: 'reu-301', titulo: 'Seguimiento de compraventa', cliente: 'Roberto Garza Sada', inicio: enMinutos(45), fin: enMinutos(90), expediente: 'Exp. 305/2026' },
    { id: 'reu-302', titulo: 'Asesoría inicial: terminación laboral', cliente: 'Elena Santillán Ruiz', inicio: enMinutos(240), fin: enMinutos(285), expediente: null },
    { id: 'reu-303', titulo: 'Revisión de avances del amparo', cliente: 'Jorge Villaseñor Cano', inicio: enMinutos(60 * 26), fin: enMinutos(60 * 27), expediente: 'Exp. 312/2026' },
  ]

  return {
    indicadores: {
      solicitudesNuevas: contarSolicitudesNuevasMock(),
      expedientesActivos: 12,
      propuestasPendientes: contarPropuestasPendientesMock(),
      proximasReuniones: proximasReuniones.length,
    },
    solicitudesNuevas: solicitudesNuevasRecientesMock(3),
    proximasReuniones,
    cobrosRelevantes: movimientosRecientesMock(3),
    actividadReciente: [
      { id: 'act-1', tipo: 'solicitud', descripcion: 'Valeria Gómez Rivas envió una nueva solicitud de servicios.', fecha: haceMinutos(24) },
      { id: 'act-2', tipo: 'pago', descripcion: 'Grupo Inmobiliario Nexus pagó el anticipo de honorarios.', fecha: haceMinutos(65) },
      { id: 'act-3', tipo: 'expediente', descripcion: 'Se registró la admisión de la demanda en el Exp. 312/2026.', fecha: haceMinutos(120) },
      { id: 'act-4', tipo: 'documento', descripcion: 'Elena Santillán Ruiz subió un documento al Exp. 298/2026.', fecha: haceMinutos(180) },
      { id: 'act-5', tipo: 'propuesta', descripcion: 'TechHub México S.A.S. aceptó tu propuesta de servicios.', fecha: haceMinutos(60 * 24) },
    ],
  }
}
