// A2B–A2D: POST /api/PasswordReset/solicitar | verificar | confirmar (PasswordResetController).
import { isAxiosError } from 'axios'
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi, mensajeDelServidor, tipoPorMensajeCodigo } from '../lib/mapear-error'
import { ErrorAutenticacion } from '../types/auth.types'
import type {
  PeticionNuevaContrasena,
  PeticionSolicitarRecuperacion,
  PeticionVerificarCodigoRecuperacion,
} from '../types/recuperacion.types'

const { recuperacion } = ENDPOINTS

/**
 * El backend responde 401 "Código inválido o expirado." o "Demasiados intentos…".
 * Aquí un 401 nunca es "sesión vencida": es el código. Como el backend no distingue
 * entre código equivocado y vencido, se trata como incorrecto (el caso más común);
 * solo "Demasiados intentos" obliga a pedir otro.
 */
function errorDeCodigo(error: unknown): ErrorAutenticacion {
  const mapeado = mapearErrorApi(error, 'codigo')
  if (mapeado.tipo !== 'sesion_expirada') return mapeado
  const servidor = mensajeDelServidor(error)
  const tipo = tipoPorMensajeCodigo(servidor) === 'demasiados_intentos' ? 'demasiados_intentos' : 'codigo_incorrecto'
  return new ErrorAutenticacion(tipo, undefined, servidor)
}

/** A2B (y "Reenviar" en A2C): siempre 200, exista o no la cuenta. */
export async function solicitarRecuperacion(peticion: PeticionSolicitarRecuperacion): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { solicitarRecuperacionMock } = await import('./recuperacion.mock')
    return solicitarRecuperacionMock(peticion)
  }

  try {
    await api.post(recuperacion.solicitar, { email: peticion.correo })
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}

/** A2C: valida el código sin consumirlo. */
export async function verificarCodigoRecuperacion(peticion: PeticionVerificarCodigoRecuperacion): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { verificarCodigoRecuperacionMock } = await import('./recuperacion.mock')
    return verificarCodigoRecuperacionMock(peticion)
  }

  try {
    await api.post(recuperacion.verificar, { email: peticion.correo, codigo: peticion.codigo })
  } catch (error: unknown) {
    throw errorDeCodigo(error)
  }
}

/** A2D: consume el código y guarda la nueva contraseña. */
export async function guardarNuevaContrasena(peticion: PeticionNuevaContrasena): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarNuevaContrasenaMock } = await import('./recuperacion.mock')
    return guardarNuevaContrasenaMock(peticion)
  }

  try {
    await api.post(recuperacion.confirmar, {
      email: peticion.correo,
      codigo: peticion.codigo,
      nuevaPassword: peticion.contrasena,
    })
  } catch (error: unknown) {
    // 400 = la contraseña no pasó la validación del backend · 401 = problema con el código.
    if (isAxiosError(error) && error.response?.status === 400) {
      throw mapearErrorApi(error, 'formulario')
    }
    throw errorDeCodigo(error)
  }
}
