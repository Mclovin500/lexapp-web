/** Campos del perfil del abogado que solo cambian con aprobación de un administrador. */
export type CampoCambioAbogado = 'tarifa_por_hora_centavos' | 'experiencia_anos' | 'cedula_profesional'

export type EstadoCambio = 'pendiente' | 'aprobado' | 'rechazado'

/** `SolicitudCambioResponse` (`GET /perfil/solicitudes`). `valorNuevo` llega como `{ valor, ... }`. */
export interface SolicitudCambio {
  idSolicitud: number
  campo: CampoCambioAbogado | 'tipo_documento' | 'fecha_nacimiento' | 'documento_identidad'
  valorAnterior: unknown
  valorNuevo: unknown
  estadoCambio: EstadoCambio
  motivoRechazo: string | null
  revisadoEn: string | null
  creadoEn: string
}

export type PeticionCambio =
  | { campo: 'tarifa_por_hora_centavos'; tarifaPesos: number; justificacion: string }
  | { campo: 'experiencia_anos'; anios: number; justificacion: string }
  | { campo: 'cedula_profesional'; cedula: string; archivo: File; justificacion: string }
