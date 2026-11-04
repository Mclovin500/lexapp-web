/** `POST /registro/verificar-correo` (A3A). Responde 204 y el backend abre la sesión (cookie httpOnly). */
export interface PeticionVerificarCorreo {
  codigo: string
}
