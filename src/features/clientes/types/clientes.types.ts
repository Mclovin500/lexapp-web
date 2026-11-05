import type { ExpedienteResumen } from '@/features/expedientes/types/expedientes.types'
import type { CategoriaDocumento, EstadoDocumento } from '@/features/expedientes/types/documentos.types'
import type { MovimientoResumen } from '@/features/pagos/types/pagos.types'
import type { TipoPersona } from '@/features/solicitudes/types/solicitudes.types'

/** `GET /clientes/opciones`: clientes con relación profesional, para selectores (D1, D4). */
export interface OpcionCliente {
  id: string
  nombre: string
  organizacion: string | null
}

/**
 * PROPUESTA de estados para F1:
 * `activo` = tiene expedientes abiertos · `en_propuesta` = propuesta enviada sin respuesta ·
 * `inactivo` = sin casos abiertos ni propuestas pendientes.
 */
export type EstadoCliente = 'activo' | 'en_propuesta' | 'inactivo'
export type FiltroClientes = 'todos' | EstadoCliente

/** Fila de F1. */
export interface ClienteResumen {
  id: string
  nombre: string
  organizacion: string | null
  tipoPersona: TipoPersona
  correo: string
  /** "Teléfono, cuando corresponda". */
  telefono: string | null
  expedientes: { total: number; abiertos: number }
  ultimaActividad: string
  estado: EstadoCliente
}

export interface FiltrosClientes {
  estado: FiltroClientes
  /** Nombre, organización o correo. */
  busqueda: string
  pagina: number
  porPagina: number
}

/** `GET /clientes?estado=&busqueda=&pagina=&porPagina=` (F1). */
export interface RespuestaClientes {
  clientes: ClienteResumen[]
  total: number
  totalesPorEstado: Record<FiltroClientes, number>
}

export type TipoInteraccion = 'solicitud' | 'propuesta' | 'expediente' | 'documento' | 'pago'

/** "Historial de interacción permitido": solo eventos de la relación profesional con este abogado. */
export interface InteraccionCliente {
  id: string
  tipo: TipoInteraccion
  descripcion: string
  fecha: string
  /** Id de la solicitud, propuesta, expediente o movimiento al que lleva; `null` si no aplica. */
  referenciaId: string | null
}

export interface DocumentoRelacionado {
  id: string
  nombre: string
  categoria: CategoriaDocumento
  estado: EstadoDocumento
  fechaCarga: string
  expediente: { id: string; folio: string }
}

/** `GET /clientes/{id}` (F2). Solo información autorizada y necesaria para el servicio (9.4). */
export interface ClienteDetalle extends ClienteResumen {
  clienteDesde: string
  expedientesRelacionados: ExpedienteResumen[]
  interacciones: InteraccionCliente[]
  documentos: DocumentoRelacionado[]
  pagos: MovimientoResumen[]
}
