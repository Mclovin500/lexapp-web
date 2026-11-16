/** `POST /Verificacion/enviar` (A3A). */
export interface PeticionEnviarCodigoCorreo {
  correo: string
}

/** `POST /Verificacion/verificar` (A3A). 200 = correo verificado · 400 = código inválido o vencido. */
export interface PeticionVerificarCorreo {
  correo: string
  codigo: string
}
