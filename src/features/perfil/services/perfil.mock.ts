// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { ESTADO_VALIDACION_MOCK } from '@/features/auth/services/sesion.mock'
import type { PerfilAbogado, PeticionPerfil } from '../types/perfil.types'

/** Mismo nombre que la cuenta del Header (`cuenta.mock.ts`). */
export const NOMBRE_ABOGADO_MOCK = 'Alejandro Morales Vega'

let perfil: PeticionPerfil = {
  aniosExperiencia: 14,
  formacion: [
    { id: 'for-1', titulo: 'Maestría en Derecho Corporativo', institucion: 'Universidad Panamericana', anioInicio: 2016, anioFin: 2018 },
    { id: 'for-2', titulo: 'Licenciatura en Derecho', institucion: 'Universidad Nacional Autónoma de México (UNAM)', anioInicio: 2007, anioFin: 2012 },
  ],
  experiencia: [
    {
      id: 'exp-1', cargo: 'Abogado titular', organizacion: 'Despacho propio', anioInicio: 2019, anioFin: null,
      descripcion: 'Asesoría corporativa, contratos mercantiles y litigio civil para empresas y personas físicas.',
    },
    {
      id: 'exp-2', cargo: 'Asociado sénior', organizacion: 'Firma de abogados corporativos', anioInicio: 2012, anioFin: 2019,
      descripcion: 'Fusiones y adquisiciones, gobierno corporativo y arbitraje comercial.',
    },
  ],
  areasPractica: ['corporativo', 'civil'],
  especialidades: ['contratacion-mercantil', 'fusiones-adquisiciones', 'amparo'],
  descripcion:
    'Abogado con 14 años de experiencia en derecho corporativo y litigio civil. Acompaño a empresas y personas en la prevención y solución de conflictos con un trato cercano y explicaciones claras de cada etapa del caso.',
  servicios: [
    { id: 'srv-1', nombre: 'Consulta jurídica inicial', descripcion: 'Análisis del caso y opciones de solución en una videollamada.' },
    { id: 'srv-2', nombre: 'Redacción y revisión de contratos', descripcion: 'Contratos mercantiles, de arrendamiento y de prestación de servicios.' },
    { id: 'srv-3', nombre: 'Juicio de amparo', descripcion: 'Defensa frente a actos de autoridad.' },
  ],
  honorarios: { consultaInicial: 800, tarifaHora: 1500, nota: 'Los honorarios de cada asunto se acuerdan en la propuesta de servicios.' },
  disponibilidad: { aceptaNuevosCasos: true, modalidad: 'agenda_previa' },
}
let fotoUrl: string | null = null

async function simularRed(milisegundos?: number): Promise<void> {
  await esperar(milisegundos)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

/** Para el Header (foto del abogado). */
export function fotoPerfilMock(): string | null {
  return fotoUrl
}

export async function obtenerPerfilMock(): Promise<PerfilAbogado> {
  await simularRed(400)
  return {
    ...structuredClone(perfil),
    fotoUrl,
    tratamiento: 'Lic.',
    nombreCompleto: NOMBRE_ABOGADO_MOCK,
    cedula: '7482910',
    estadoValidacion: ESTADO_VALIDACION_MOCK,
    visibleParaClientes: ESTADO_VALIDACION_MOCK === 'validado',
  }
}

export async function guardarPerfilMock(peticion: PeticionPerfil): Promise<void> {
  await simularRed(600)
  if (peticion.areasPractica.length === 0 || peticion.descripcion.trim().length < 50) throw new ErrorApi('datos_invalidos')
  perfil = structuredClone(peticion)
}

export async function subirFotoMock(archivo: File): Promise<{ fotoUrl: string }> {
  await simularRed(700)
  if (!['image/jpeg', 'image/png'].includes(archivo.type) || archivo.size > 4 * 1024 * 1024) throw new ErrorApi('datos_invalidos')
  if (fotoUrl) URL.revokeObjectURL(fotoUrl)
  fotoUrl = URL.createObjectURL(archivo)
  return { fotoUrl }
}

export async function eliminarFotoMock(): Promise<void> {
  await simularRed(400)
  if (fotoUrl) URL.revokeObjectURL(fotoUrl)
  fotoUrl = null
}
