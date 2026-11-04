/** Estados de D2 (especificación). */
export type EstadoPropuesta = 'borrador' | 'enviada' | 'pendiente_respuesta' | 'aceptada' | 'rechazada' | 'cancelada'
export type FiltroPropuestas = 'todas' | EstadoPropuesta

/** "Conceptos de cobro, cuando corresponda": desglose opcional de los honorarios. */
export interface ConceptoCobro {
  concepto: string
  importe: number
}

export interface PropuestaResumen {
  id: string
  folio: string
  cliente: { id: string; nombre: string; organizacion: string | null }
  servicio: string
  /** Honorarios totales (MXN). */
  importe: number
  fechaCreacion: string
  /** AAAA-MM-DD */
  fechaVigencia: string
  estado: EstadoPropuesta
  expedienteId: string | null
}

/** `GET /propuestas/{id}` */
export interface PropuestaDetalle extends PropuestaResumen {
  solicitud: { id: string; folio: string; asunto: string } | null
  descripcion: string
  alcance: string
  condiciones: string
  tiempoEstimado: string
  conceptos: ConceptoCobro[]
  fechaEnvio: string | null
  motivoRechazo: string | null
  /** Hay movimientos en D3 relacionados con esta propuesta. */
  tieneMovimientos: boolean
}

export type AccionGuardarPropuesta = 'borrador' | 'enviar'

/** `POST /propuestas` (crear) y `PUT /propuestas/{id}` (editar borrador). */
export interface PeticionPropuesta {
  clienteId: string
  solicitudId: string | null
  servicio: string
  descripcion: string
  alcance: string
  honorarios: number
  conceptos: ConceptoCobro[]
  condiciones: string
  tiempoEstimado: string
  fechaVigencia: string
  /** `borrador` guarda; `enviar` guarda y envía al cliente. */
  accion: AccionGuardarPropuesta
}

export interface RespuestaGuardarPropuesta {
  id: string
  estado: EstadoPropuesta
}

export interface FiltrosPropuestas {
  estado: FiltroPropuestas
  /** Cliente, servicio o folio. */
  busqueda: string
  pagina: number
  porPagina: number
}

/** `GET /propuestas?estado=&busqueda=&pagina=&porPagina=` (D2). */
export interface RespuestaPropuestas {
  propuestas: PropuestaResumen[]
  total: number
  totalesPorEstado: Record<FiltroPropuestas, number>
}

/** `POST /propuestas/{id}/expediente` (D2, propuesta aceptada). */
export interface RespuestaCrearExpediente {
  expedienteId: string
}

/** D1 → D2: aviso tras guardar. */
export interface EstadoPropuestaGuardada {
  propuestaGuardada: 'borrador' | 'enviada'
}
