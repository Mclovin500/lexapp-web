/**
 * Estados de la reunión (G1). Todas son virtuales (regla 9.2): no hay dirección, oficina ni mapa.
 * `no_realizada` = pasó el horario sin que se iniciara la videollamada.
 */
export type EstadoReunion = 'programada' | 'en_curso' | 'finalizada' | 'cancelada' | 'no_realizada'

export type OrigenReunion = 'agenda' | 'chat' | 'cliente'

export interface ReunionResumen {
  id: string
  titulo: string
  cliente: { id: string; nombre: string }
  expediente: { id: string; folio: string } | null
  inicio: string
  fin: string
  estado: EstadoReunion
}

export interface CambioEstadoReunion {
  estado: EstadoReunion
  fecha: string
  nota: string | null
}

/** `GET /reuniones/{id}`: "Consultar reunión" (G1) y datos de la sala (G1A). */
export interface ReunionDetalle extends ReunionResumen {
  cliente: ReunionResumen['cliente'] & { organizacion: string | null; enDirectorio: boolean }
  notas: string | null
  origen: OrigenReunion
  /** La sala se puede abrir dentro de esta ventana. */
  sala: { abreEn: string; cierraEn: string }
  motivoCancelacion: string | null
  duracionRealSegundos: number | null
  resumen: string | null
  historial: CambioEstadoReunion[]
}

/**
 * `GET /reuniones?desde=&hasta=` (calendario) · `?alcance=proximas&limite=` · `?alcance=historial&limite=`.
 */
export interface FiltrosReuniones {
  desde?: string
  hasta?: string
  alcance?: 'proximas' | 'historial'
  limite?: number
}

/** `POST /reuniones` ("Programar reunión"). */
export interface PeticionReunion {
  clienteId: string
  expedienteId: string | null
  titulo: string
  /** ISO 8601. */
  inicio: string
  duracionMinutos: number
  notas: string
}

/** `POST /reuniones/inmediata` (H1 → "Videollamada"). Reutiliza una reunión con la sala abierta si existe. */
export interface PeticionReunionInmediata {
  clienteId: string
  expedienteId: string | null
}

/** `POST /reuniones/{id}/sala`: credencial temporal del proveedor de video. */
export interface AccesoSala {
  proveedor: string
  sala: string
  token: string
  expiraEn: string
}

/** `POST /reuniones/{id}/finalizar`. */
export interface PeticionFinalizarReunion {
  duracionSegundos: number
  resumen: string
}

/** 0 = domingo … 6 = sábado. */
export interface DiaDisponibilidad {
  dia: number
  activo: boolean
  /** HH:MM */
  inicio: string
  fin: string
}

/** `GET` / `PUT /agenda/disponibilidad` ("Crear disponibilidad"). Los clientes reservan dentro de estos horarios. */
export interface Disponibilidad {
  dias: DiaDisponibilidad[]
  duracionMinutos: number
  margenMinutos: number
}

/** G1A → H1: abrir la sala desde el chat (para regresar al terminar). */
export interface OrigenSala {
  origen: 'chat'
  conversacionId: string
}
