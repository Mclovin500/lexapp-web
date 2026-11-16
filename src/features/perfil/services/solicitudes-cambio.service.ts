// I1 "Solicitudes de cambio": SolicitudCambioController (`/api/perfil/...`).
// La tarifa, la experiencia y la cédula no se editan directo: un administrador aprueba cada cambio.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import type { PeticionCambio, SolicitudCambio } from '../types/solicitudes-cambio.types'

const { perfilCambios } = ENDPOINTS

export async function listarSolicitudesCambio(): Promise<SolicitudCambio[]> {
  try {
    const respuesta = await api.get<SolicitudCambio[]>(perfilCambios.listado)
    return [...(respuesta.data ?? [])].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function solicitarCambio(peticion: PeticionCambio): Promise<SolicitudCambio> {
  const justificacion = peticion.justificacion.trim() || null
  try {
    switch (peticion.campo) {
      case 'tarifa_por_hora_centavos': {
        const respuesta = await api.post<SolicitudCambio>(perfilCambios.tarifa, {
          tarifaPorHoraCentavos: Math.round(peticion.tarifaPesos * 100),
          justificacion,
        })
        return respuesta.data
      }
      case 'experiencia_anos': {
        const respuesta = await api.post<SolicitudCambio>(perfilCambios.experiencia, {
          experienciaAnos: peticion.anios,
          justificacion,
        })
        return respuesta.data
      }
      case 'cedula_profesional': {
        const formulario = new FormData()
        formulario.append('CedulaProfesional', peticion.cedula.trim())
        formulario.append('ArchivoCedula', peticion.archivo)
        if (justificacion) formulario.append('Justificacion', justificacion)
        const respuesta = await api.post<SolicitudCambio>(perfilCambios.cedula, formulario)
        return respuesta.data
      }
    }
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
