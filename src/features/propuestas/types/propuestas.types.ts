/** `propuestas.estado_propuesta` de Back_Lexapp (la expiración la marca el backend al consultar). */
export type EstadoPropuesta = 'enviada' | 'aceptada' | 'rechazada' | 'expirada'
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

/**
 * Lo que captura D1. El backend no tiene borradores: la propuesta se envía al crearla
 * (`POST /solicitudes-caso/abogado/{solicitudId}/propuesta`) y siempre nace de una solicitud.
 */
export interface PeticionPropuesta {
  clienteId: string
  solicitudId: string
  servicio: string
  descripcion: string
  alcance: string
  honorarios: number
  conceptos: ConceptoCobro[]
  condiciones: string
  tiempoEstimadoDias: number
  fechaVigencia: string
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

/** D1 → D2: aviso tras guardar. */
export interface EstadoPropuestaGuardada {
  propuestaGuardada: 'enviada'
}

// ---- Respuestas de Back_Lexapp (PropuestaDtos.cs) ----

type EstadoPropuestaApi = EstadoPropuesta

/** `SeguimientoPropuestaItemResponse` */
export interface SeguimientoPropuestaApi {
  idPropuesta: number
  idCliente: number
  nombreCliente: string
  emailCliente: string | null
  telefonoCliente: string | null
  titulo: string
  descripcionServicios: string
  costoEstimadoCentavos: number
  tiempoEstimadoDias: number | null
  estadoPropuesta: EstadoPropuestaApi
  fechaCreacion: string
  fechaExpiracion: string | null
  diasRestantes: number | null
  estaExpirada: boolean
  mensajeEstado: string
}

/** `GET /propuestas/abogado/seguimiento?estado=&buscar=` */
export interface ResumenSeguimientoApi {
  totalPropuestas: number
  totalEnviadas: number
  totalAceptadas: number
  totalRechazadas: number
  totalExpiradas: number
  propuestas: SeguimientoPropuestaApi[]
}

/** `PropuestaResponse` (`GET /propuestas/{id}` y respuesta al crear). */
export interface PropuestaApi {
  idPropuesta: number
  idSolicitud: number | null
  idAbogado: number
  nombreAbogado: string
  idCliente: number
  nombreCliente: string
  titulo: string
  descripcionServicios: string
  costoEstimadoCentavos: number
  tiempoEstimadoDias: number | null
  estadoPropuesta: EstadoPropuestaApi
  fechaCreacion: string
  fechaExpiracion: string | null
}

/** `GenerarPropuestaRequest` */
export interface GenerarPropuestaApi {
  titulo: string
  descripcionServicios: string
  costoEstimadoCentavos: number
  tiempoEstimadoDias: number
  fechaExpiracion: string | null
}
