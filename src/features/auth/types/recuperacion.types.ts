/** `POST /PasswordReset/solicitar` (A2B y reenvío en A2C). Responde 200 exista o no la cuenta. */
export interface PeticionSolicitarRecuperacion {
  correo: string
}

/** `POST /PasswordReset/verificar` (A2C). 200 = código válido · 401 = inválido o vencido. */
export interface PeticionVerificarCodigoRecuperacion {
  correo: string
  codigo: string
}

/** `POST /PasswordReset/confirmar` (A2D). Consume el código y cambia la contraseña. */
export interface PeticionNuevaContrasena {
  correo: string
  codigo: string
  contrasena: string
}
