import type { SolicitudResumen } from '@/features/solicitudes/types/solicitudes.types'

/** Reuniones: siempre virtuales (regla 9.2 de la especificación). */
export interface ReunionProxima {
  id: string
  titulo: string
  cliente: string
  inicio: string
  fin: string
  /** Folio del expediente relacionado, si existe. */
  expediente: string | null
}

export type EstadoCobro = 'pendiente' | 'pagado' | 'vencido'

export interface CobroRelevante {
  id: string
  concepto: string
  cliente: string
  monto: number
  estado: EstadoCobro
  fecha: string
}

export type TipoActividad = 'solicitud' | 'propuesta' | 'expediente' | 'documento' | 'pago' | 'mensaje'

export interface ActividadReciente {
  id: string
  tipo: TipoActividad
  descripcion: string
  fecha: string
}

/** `GET /dashboard/resumen` (B1). */
export interface ResumenDashboard {
  indicadores: {
    solicitudesNuevas: number
    expedientesActivos: number
    propuestasPendientes: number
    proximasReuniones: number
  }
  /** Las más recientes con estado "nueva" (máximo 3). */
  solicitudesNuevas: SolicitudResumen[]
  proximasReuniones: ReunionProxima[]
  cobrosRelevantes: CobroRelevante[]
  actividadReciente: ActividadReciente[]
}
