// A5 "Crear mi cuenta": POST /api/Registro/abogado (RegistroController, multipart/form-data).
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { USAR_MOCKS } from '@/api/mocks'
import { mapearErrorApi } from '../lib/mapear-error'
import type { DatosRegistroAbogado, RespuestaRegistro } from '../types/registro.types'

/** Nombres de campo de `RegistroAbogadoRequest` (el binding de ASP.NET no distingue mayúsculas). */
function aFormData(datos: DatosRegistroAbogado): FormData {
  const formulario = new FormData()
  formulario.append('Email', datos.correo)
  formulario.append('Password', datos.contrasena)
  formulario.append('PrimerNombre', datos.primerNombre)
  if (datos.segundoNombre) formulario.append('SegundoNombre', datos.segundoNombre)
  formulario.append('ApellidoPaterno', datos.apellidoPaterno)
  formulario.append('ApellidoMaterno', datos.apellidoMaterno)
  if (datos.telefono) formulario.append('Telefono', datos.telefono)
  formulario.append('CedulaProfesional', datos.cedulaProfesional)
  formulario.append('ArchivoCedula', datos.archivoCedula, datos.archivoCedula.name)
  formulario.append('ExperienciaAnios', String(datos.experienciaAnios))
  // List<long>: el binding de ASP.NET acepta la misma clave repetida.
  for (const id of datos.especialidadesIds) formulario.append('EspecialidadesIds', String(id))
  if (datos.bio) formulario.append('Bio', datos.bio)
  if (datos.direccionOficina) formulario.append('DireccionOficina', datos.direccionOficina)
  if (datos.tarifaPorHoraCentavos !== null) {
    formulario.append('TarifaPorHoraCentavos', String(datos.tarifaPorHoraCentavos))
  }
  return formulario
}

/**
 * Crea usuario + perfil de abogado (estado `pendiente`) y sube la cédula.
 * 409: correo o cédula ya registrados (el motivo llega en `mensajeServidor`).
 * El backend NO envía el código de verificación: A5 lo pide después con `/Verificacion/enviar`.
 */
export async function registrarAbogado(datos: DatosRegistroAbogado): Promise<RespuestaRegistro> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { registrarAbogadoMock } = await import('./registro.mock')
    return registrarAbogadoMock(datos)
  }

  try {
    const respuesta = await api.post<RespuestaRegistro>(ENDPOINTS.registro.abogado, aFormData(datos))
    return respuesta.data
  } catch (error: unknown) {
    throw mapearErrorApi(error, 'formulario')
  }
}
