// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend
// Supuesto: tras A3A el backend abre la sesión (cookie httpOnly); por eso estas
// peticiones no envían identificadores ni credenciales desde el cliente.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type {
  CredencialesProfesionales,
  PerfilProfesional,
  ProgresoRegistro,
  RespuestaEnvioRegistro,
} from '../types/registro-profesional.types'

const { registro } = ENDPOINTS

/** A4 y A5: datos ya guardados para precargar los formularios. */
export async function obtenerProgresoRegistro(): Promise<ProgresoRegistro> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerProgresoRegistroMock } = await import('./registro-profesional.mock')
    return obtenerProgresoRegistroMock()
  }

  try {
    const respuesta = await api.get<ProgresoRegistro>(registro.progreso)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}

/** A4: guarda las credenciales profesionales (204). */
export async function guardarCredenciales(datos: CredencialesProfesionales): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarCredencialesMock } = await import('./registro-profesional.mock')
    return guardarCredencialesMock(datos)
  }

  try {
    await api.put(registro.credenciales, datos)
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}

/** A5: guarda el perfil profesional (204). */
export async function guardarPerfil(datos: PerfilProfesional): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarPerfilMock } = await import('./registro-profesional.mock')
    return guardarPerfilMock(datos)
  }

  try {
    await api.put(registro.perfil, datos)
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}

/** A5: envía el registro completo a validación profesional. */
export async function enviarRegistro(): Promise<RespuestaEnvioRegistro> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { enviarRegistroMock } = await import('./registro-profesional.mock')
    return enviarRegistroMock()
  }

  try {
    const respuesta = await api.post<RespuestaEnvioRegistro>(registro.enviar)
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}
