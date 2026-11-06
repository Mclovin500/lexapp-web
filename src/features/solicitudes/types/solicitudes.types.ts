/** Sección 8: `convertida_propuesta` = se envió una propuesta (D1); `atendida` = se cerró sin propuesta. */
export type EstadoSolicitud = 'nueva' | 'en_revision' | 'atendida' | 'rechazada' | 'convertida_propuesta'
export type PrioridadSolicitud = 'alta' | 'media' | 'baja'
export type TipoPersona = 'fisica' | 'moral'

/** Filtros de C1 (Stitch: "Todas", "Nuevas", "En revisión", "Atendidas"). */
export type FiltroEstadoSolicitud = 'todas' | 'nueva' | 'en_revision' | 'convertida_propuesta' | 'atendida'

export interface ClienteSolicitud {
  id: string
  nombre: string
  tipoPersona: TipoPersona
  organizacion: string | null
}

/** Fila del listado (C1) y de "Nuevas solicitudes" (B1). */
export interface SolicitudResumen {
  id: string
  folio: string
  cliente: ClienteSolicitud
  areaJuridica: string
  /** Necesidad o asunto, en una línea. */
  asunto: string
  fechaRecepcion: string
  estado: EstadoSolicitud
  /** "Prioridad, si corresponde": puede venir nula. */
  prioridad: PrioridadSolicitud | null
}

export interface DocumentoSolicitud {
  id: string
  nombre: string
  tipoArchivo: string
  tamanoBytes: number
  fechaCarga: string
  /** URL temporal de descarga; `null` si aún no está disponible. */
  url: string | null
}

/** `GET /solicitudes/{id}` (C2). */
export interface SolicitudDetalle extends SolicitudResumen {
  cliente: ClienteSolicitud & {
    correo: string | null
    telefono: string | null
  }
  /** Descripción de la necesidad, tal como la escribió el cliente. */
  descripcion: string
  /** Información adicional proporcionada por el cliente. */
  informacionAdicional: { etiqueta: string; valor: string }[]
  documentos: DocumentoSolicitud[]
  motivoRechazo: string | null
}

export interface FiltrosSolicitudes {
  estado: FiltroEstadoSolicitud
  /** Área jurídica (texto del catálogo) o `null` para todas. */
  area: string | null
  /** Busca por nombre del cliente o área jurídica. */
  busqueda: string
  pagina: number
  porPagina: number
}

/** `GET /solicitudes?estado=&area=&busqueda=&pagina=&porPagina=` (C1). */
export interface RespuestaListadoSolicitudes {
  solicitudes: SolicitudResumen[]
  total: number
  totalesPorEstado: Record<FiltroEstadoSolicitud, number>
}

/** `GET /solicitudes/opciones?clienteId=`: solicitudes abiertas del cliente (D1). */
export interface OpcionSolicitud {
  id: string
  folio: string
  asunto: string
}

/** C2 → D1 "Crear propuesta": datos que D1 usará para precargar al cliente. */
export interface EstadoNuevaPropuesta {
  solicitudId: string
  clienteId: string
}

/** `POST /solicitudes/{id}/rechazar` (C2). Responde 204. */
export interface PeticionRechazoSolicitud {
  motivo: string
}
