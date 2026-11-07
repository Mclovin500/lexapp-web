import type { EstadoValidacion } from '@/features/auth/types/sesion.types'

export interface Formacion {
  id: string
  titulo: string
  institucion: string
  anioInicio: number
  /** `null` = en curso. */
  anioFin: number | null
}

export interface Experiencia {
  id: string
  cargo: string
  organizacion: string
  anioInicio: number
  anioFin: number | null
  descripcion: string
}

export interface Servicio {
  id: string
  nombre: string
  descripcion: string
}

/** `GET /abogado/perfil` (I1). */
export interface PerfilAbogado {
  fotoUrl: string | null
  tratamiento: string | null
  nombreCompleto: string
  /** La cédula viene del registro (A4) y solo cambia con una nueva validación (regla 9.5). */
  cedula: string
  estadoValidacion: EstadoValidacion
  /** Solo los perfiles validados se muestran a los clientes. */
  visibleParaClientes: boolean
  aniosExperiencia: number
  formacion: Formacion[]
  experiencia: Experiencia[]
  /** Valores del catálogo de áreas de práctica. */
  areasPractica: string[]
  /** Valores del catálogo de especializaciones. */
  especialidades: string[]
  descripcion: string
  servicios: Servicio[]
  honorarios: {
    /** MXN; `0` = primera consulta sin costo. */
    consultaInicial: number
    /** MXN por hora; `null` = no aplica. */
    tarifaHora: number | null
    nota: string
  }
  disponibilidad: {
    aceptaNuevosCasos: boolean
    /** Valor del catálogo de disponibilidad (A5). */
    modalidad: string
  }
}

/** `PUT /abogado/perfil`: lo editable en I1 (sin foto, nombre, cédula ni estado de validación). */
export type PeticionPerfil = Omit<PerfilAbogado, 'fotoUrl' | 'tratamiento' | 'nombreCompleto' | 'cedula' | 'estadoValidacion' | 'visibleParaClientes'>
