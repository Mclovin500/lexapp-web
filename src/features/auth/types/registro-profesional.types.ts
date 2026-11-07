import type { EstadoValidacion } from './sesion.types'

export type GradoAcademico = 'licenciatura' | 'especialidad' | 'maestria' | 'doctorado'
export type TipoDocumentoRegistro = 'cedula' | 'titulo'

/** `POST /registro/documentos` (A4, multipart): archivo ya cargado, listo para la revisión. */
export interface DocumentoRegistro {
  id: string
  tipo: TipoDocumentoRegistro
  nombre: string
  tamanoBytes: number
}

/** `PUT /registro/credenciales` (A4). Responde 204. */
export interface CredencialesProfesionales {
  numeroCedula: string
  /** "Formación académica": grado máximo y título obtenido. */
  gradoAcademico: GradoAcademico
  tituloObtenido: string
  universidad: string
  especialidad: string
  aniosExperiencia: number
  /** Campo extra del diseño (opcional): colegio o jurisdicción emisora. */
  colegio: string | null
  /** "Documentación requerida": cédula (obligatoria) y título (opcional). */
  documentos: DocumentoRegistro[]
}

/** `PUT /registro/perfil` (A5). Responde 204. */
export interface PerfilProfesional {
  areaPractica: string
  especializaciones: string[]
  biografia: string
  informacionRelevante: {
    jurisdicciones: string | null
  }
  disponibilidad: string
  /** "Servicios ofrecidos" (hasta 5). */
  servicios: { nombre: string; descripcion: string }[]
  /** "Honorarios o información relacionada" (MXN). `consultaInicial` 0 = sin costo. */
  honorarios: { consultaInicial: number; tarifaHora: number | null }
  /** "Fotografía profesional, si corresponde": URL de `POST /registro/foto`. */
  fotoUrl: string | null
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
