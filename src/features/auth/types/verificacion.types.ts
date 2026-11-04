import type { EstadoValidacion } from './sesion.types'

/** Cuerpo de `POST /auth/verificar-codigo` (A2A). */
export interface PeticionVerificarCodigo {
  codigo: string
}

/** El backend abre la sesión (cookie httpOnly) y responde con el estado del perfil. */
export interface RespuestaVerificarCodigo {
  estadoValidacion: EstadoValidacion
}
