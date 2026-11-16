/**
 * `RegistroAbogadoRequest` del backend (`POST /Registro/abogado`, multipart/form-data).
 * Se arma en A5 con lo capturado en A3 (datos básicos), A4 (credenciales) y A5 (perfil).
 */
export interface DatosRegistroAbogado {
  // A3
  primerNombre: string
  segundoNombre: string | null
  apellidoPaterno: string
  apellidoMaterno: string
  correo: string
  telefono: string | null
  contrasena: string
  // A4
  cedulaProfesional: string
  archivoCedula: File
  experienciaAnios: number
  /** IDs de la tabla `especialidades`. */
  especialidadesIds: number[]
  // A5
  bio: string
  direccionOficina: string | null
  tarifaPorHoraCentavos: number | null
}

/** `RegistroResponse` del backend (201). */
export interface RespuestaRegistro {
  idUsuario: number
  idPerfil: number
  tipoUsuario: string
  email: string
  mensaje: string
  estadoDocumento: string | null
}
