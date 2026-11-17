/** Autor de un mensaje del asistente: el propio asistente o el abogado que escribe. */
export type AutorAsistente = 'asistente' | 'abogado'

/** Enlace opcional que el asistente puede sugerir dentro de su respuesta. */
export interface AccionAsistente {
  ruta: string
  etiqueta: string
}

export interface MensajeAsistente {
  id: string
  autor: AutorAsistente
  texto: string
  fecha: string
  accion?: AccionAsistente
}

/** Pregunta rápida que se muestra como chip antes de que el usuario escriba. */
export interface SugerenciaAsistente {
  valor: string
  etiqueta: string
}

/** Estado del indicador "escribiendo…". */
export type EstadoAsistente = 'ocioso' | 'escribiendo'
