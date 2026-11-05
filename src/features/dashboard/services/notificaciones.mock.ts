// MOCK: eliminar al conectar el backend
// Datos ficticios en memoria: marcar como leída persiste hasta recargar la página.
import { enMinutos, esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import type {
  FiltroNotificaciones,
  Notificacion,
  RespuestaNotificaciones,
} from '../types/notificaciones.types'

const notificacionesMock: Notificacion[] = [
  {
    id: 'not-01', tipo: 'nueva_solicitud', referencia: 'Valeria Gómez Rivas · Fintech Nova S.A.P.I. de C.V.',
    descripcion: 'Envió una solicitud para revisar su pacto de socios y acuerdo de inversión, con 3 documentos adjuntos.',
    fecha: haceMinutos(24), leida: false, destino: { solicitudId: 'sol-0842' },
  },
  {
    id: 'not-02', tipo: 'proxima_videollamada', referencia: 'Roberto Garza Sada · Inversiones del Norte',
    descripcion: `Videollamada de seguimiento programada para hoy a las ${new Date(enMinutos(45)).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}.`,
    fecha: haceMinutos(30), leida: false, destino: { reunionId: 'reu-301' },
  },
  {
    id: 'not-03', tipo: 'pago_realizado', referencia: 'Grupo Inmobiliario Nexus',
    descripcion: 'El cliente realizó el pago del anticipo por $45,000.00 MXN desde su aplicación.',
    fecha: haceMinutos(65), leida: false, destino: { movimientoId: 'mov-551' },
  },
  {
    id: 'not-04', tipo: 'actualizacion_expediente', referencia: 'Exp. 312/2026 · Juicio de amparo',
    descripcion: 'Se registró una nueva actuación: admisión de la demanda de amparo.',
    fecha: haceMinutos(120), leida: false, destino: { expedienteId: 'exp-312' },
  },
  {
    id: 'not-05', tipo: 'documento_recibido', referencia: 'Elena Santillán Ruiz',
    descripcion: 'Subió el documento "Recibos_de_nomina_2026.pdf" al expediente.',
    fecha: haceMinutos(180), leida: false, destino: { expedienteId: 'exp-298' },
  },
  {
    id: 'not-06', tipo: 'nuevo_mensaje', referencia: 'Elena Santillán Ruiz · Exp. 298/2026',
    descripcion: '"Gracias, licenciado. Le envío mañana la documentación que me pidió."',
    fecha: haceMinutos(60 * 20), leida: true, destino: { conversacionId: 'con-77' },
  },
  {
    id: 'not-07', tipo: 'propuesta_aceptada', referencia: 'Claudia Treviño Garza · TechHub México S.A.S.',
    descripcion: 'Aceptó la propuesta "Aviso de privacidad y términos de servicio" por $18,500.00 MXN.',
    fecha: haceMinutos(60 * 24), leida: true, destino: { propuestaId: 'pro-088' },
  },
  {
    id: 'not-08', tipo: 'propuesta_rechazada', referencia: 'Héctor Salinas Ibarra · Agroexportadora del Pacífico',
    descripcion: 'Rechazó la propuesta "Defensa ante requerimiento del SAT".',
    fecha: haceMinutos(60 * 30), leida: true, destino: { propuestaId: 'pro-085' },
  },
  {
    id: 'not-09', tipo: 'documento_pendiente', referencia: 'Exp. 298/2026 · Terminación laboral',
    descripcion: 'El convenio de terminación está pendiente de tu revisión.',
    fecha: haceMinutos(60 * 48), leida: true, destino: { expedienteId: 'exp-298' },
  },
  {
    id: 'not-10', tipo: 'nuevo_cobro', referencia: 'Constructora del Bajío',
    descripcion: 'Se creó un cobro adicional por gastos de peritaje de $12,800.00 MXN.',
    fecha: haceMinutos(60 * 72), leida: true, destino: { movimientoId: 'mov-540' },
  },
]

async function simularRed(): Promise<void> {
  await esperar(500)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

/** Para el contador del Header. */
export function contarNoLeidasMock(): number {
  return notificacionesMock.filter((n) => !n.leida).length
}

export async function listarNotificacionesMock(filtro: FiltroNotificaciones): Promise<RespuestaNotificaciones> {
  await simularRed()
  const noLeidas = contarNoLeidasMock()
  const lista = notificacionesMock
    .filter((n) => filtro === 'todas' || (filtro === 'no_leidas' ? !n.leida : n.leida))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((n) => ({ ...n, destino: { ...n.destino } }))

  return {
    notificaciones: lista,
    totales: { todas: notificacionesMock.length, no_leidas: noLeidas, leidas: notificacionesMock.length - noLeidas },
  }
}

export async function marcarNotificacionLeidaMock(id: string): Promise<void> {
  await simularRed()
  const notificacion = notificacionesMock.find((n) => n.id === id)
  if (!notificacion) throw new ErrorApi('no_encontrado')
  notificacion.leida = true
}

export async function marcarTodasLeidasMock(): Promise<void> {
  await simularRed()
  notificacionesMock.forEach((n) => {
    n.leida = true
  })
}
