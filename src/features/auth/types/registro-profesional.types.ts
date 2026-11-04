import type { EstadoValidacion } from './sesion.types'

/** `PUT /registro/credenciales` (A4). Responde 204. */
export interface CredencialesProfesionales {
  numeroCedula: string
  universidad: string
  especialidad: string
  aniosExperiencia: number
  /** Campo extra del diseño (opcional): colegio o jurisdicción emisora. */
  colegio: string | null
}

/** `PUT /registro/perfil` (A5). Responde 204. */
export interface PerfilProfesional {
  areaPractica: string
  especializaciones: string[]
  biografia: string
  informacionRelevante: {
    idiomas: string | null
    jurisdicciones: string | null
  }
  disponibilidad: string
}

/** `GET /registro/progreso`: lo ya guardado, para precargar A4 y A5 al volver con "Anterior". */
export interface ProgresoRegistro {
  credenciales?: CredencialesProfesionales
  perfil?: PerfilProfesional
}

/** `POST /registro/enviar` (A5): envía el registro a validación. */
export interface RespuestaEnvioRegistro {
  estadoValidacion: EstadoValidacion
  folio: string
  fechaEnvio: string
}
