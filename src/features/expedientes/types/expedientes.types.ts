import type { ReunionProxima } from '@/features/dashboard/types/dashboard.types'
import type { MovimientoResumen } from '@/features/pagos/types/pagos.types'
import type { TipoPersona } from '@/features/solicitudes/types/solicitudes.types'
import type { DocumentoExpediente } from './documentos.types'

/** `GET /expedientes/opciones?clienteId=`: expedientes no finalizados del cliente, para D4. */
export interface OpcionExpediente {
  id: string
  folio: string
  asunto: string
  clienteId: string
}

/**
 * Sección 8 de la especificación: los estados deben distinguir al menos activos y finalizados.
 * PROPUESTA: `en_espera` = el caso sigue abierto pero depende del cliente o de una autoridad.
 */
export type EstadoExpediente = 'activo' | 'en_espera' | 'finalizado'
export type FiltroExpedientes = 'todos' | EstadoExpediente

/** Fila de E1 (y de "Expedientes relacionados" en F2). */
export interface ExpedienteResumen {
  id: string
  /** Identificador visible, p. ej. "Exp. 312/2026". */
  folio: string
  cliente: { id: string; nombre: string; organizacion: string | null }
  asunto: string
  areaJuridica: string
  estado: EstadoExpediente
  /** Fecha de apertura (ISO 8601). */
  fechaApertura: string
  ultimaActualizacion: string
}

export interface FiltrosExpedientes {
  estado: FiltroExpedientes
  area: string | null
  /** Folio, cliente o asunto. */
  busqueda: string
  pagina: number
  porPagina: number
}

/** `GET /expedientes?estado=&area=&busqueda=&pagina=&porPagina=` (E1). */
export interface RespuestaExpedientes {
  expedientes: ExpedienteResumen[]
  total: number
  totalesPorEstado: Record<FiltroExpedientes, number>
}

export type TipoEventoExpediente = 'apertura' | 'estado' | 'documento' | 'pago' | 'reunion'

/** "Historial": eventos que registra el sistema. */
export interface EventoExpediente {
  id: string
  tipo: TipoEventoExpediente
  descripcion: string
  fecha: string
  autor: string
}

/** "Actualizaciones": seguimiento que registra el abogado (6.7 "Actualiza el seguimiento"). */
export interface ActualizacionExpediente {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  autor: string
  /** Si el cliente la ve en su aplicación. */
  visibleCliente: boolean
}

/** `GET /expedientes/{id}` (E2). Concentra la información del caso. */
export interface ExpedienteDetalle extends ExpedienteResumen {
  cliente: ExpedienteResumen['cliente'] & {
    tipoPersona: TipoPersona
    correo: string
    telefono: string | null
  }
  descripcion: string
  /** Propuesta aceptada que originó el expediente, si existe. */
  propuesta: { id: string; folio: string } | null
  historial: EventoExpediente[]
  actualizaciones: ActualizacionExpediente[]
  documentos: {
    total: number
    pendientesRevision: number
    /** Los más recientes (máximo 3). */
    recientes: DocumentoExpediente[]
  }
  pagos: MovimientoResumen[]
  proximasReuniones: ReunionProxima[]
}

/** `POST /expedientes/{id}/actualizaciones`. */
export interface PeticionActualizacion {
  titulo: string
  descripcion: string
  visibleCliente: boolean
}

/** `PATCH /expedientes/{id}/estado`. */
export interface PeticionCambioEstado {
  estado: EstadoExpediente
  nota: string
}
