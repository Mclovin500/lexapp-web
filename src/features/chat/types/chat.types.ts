export type FiltroConversaciones = 'todas' | 'no_leidas'

export interface ConversacionResumen {
  id: string
  cliente: { id: string; nombre: string; organizacion: string | null; enDirectorio: boolean }
  /** Expediente relacionado; `null` = conversación general con el cliente. */
  expediente: { id: string; folio: string; asunto: string } | null
  ultimoMensaje: { texto: string; fecha: string; autor: AutorMensaje } | null
  noLeidos: number
}

export type AutorMensaje = 'abogado' | 'cliente'

export interface AdjuntoMensaje {
  id: string
  nombre: string
  tipoArchivo: string
  tamanoBytes: number
}

export interface Mensaje {
  id: string
  autor: AutorMensaje
  texto: string
  fecha: string
  adjunto: AdjuntoMensaje | null
  /** Para los mensajes del abogado: si el cliente ya lo leyó. */
  leido: boolean
}

/** `GET /conversaciones?filtro=&busqueda=` */
export interface RespuestaConversaciones {
  conversaciones: ConversacionResumen[]
  totales: Record<FiltroConversaciones, number>
}

/** `GET /conversaciones/{id}/mensajes` */
export interface RespuestaMensajes {
  conversacion: ConversacionResumen
  mensajes: Mensaje[]
}

/**
 * `POST /conversaciones`: abre (o crea) la conversación del cliente.
 * `expedienteId` omitido = la conversación más reciente del cliente; `null` = la conversación general.
 */
export interface PeticionAbrirConversacion {
  clienteId: string
  expedienteId?: string | null
}

/** `POST /conversaciones/{id}/mensajes` (multipart/form-data). */
export interface PeticionMensaje {
  texto: string
  archivo: File | null
}

/** Estado de navegación que reciben H1 (desde E2, F2, C2, D2) y G1 (desde E2). */
export interface EstadoAbrirCliente {
  clienteId: string
  expedienteId?: string | null
}
