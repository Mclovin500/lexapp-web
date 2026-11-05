// PROVISIONAL: endpoints y nombres de campos por confirmar con el backend (docs/contrato-api-perfil-configuracion.md)
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import type {
  CuentaDeposito,
  DatosPersonales,
  PeticionCambioContrasena,
  PeticionCuentaDeposito,
  PeticionDatosPersonales,
  PreferenciasNotificaciones,
  PreferenciasPrivacidad,
  SesionActiva,
} from '../types/configuracion.types'

const { abogado } = ENDPOINTS

export async function obtenerDatosPersonales(): Promise<DatosPersonales> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerDatosPersonalesMock } = await import('./configuracion.mock')
    return obtenerDatosPersonalesMock()
  }

  try {
    const r = await api.get<DatosPersonales>(abogado.datosPersonales)
    return r.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function guardarDatosPersonales(peticion: PeticionDatosPersonales): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarDatosPersonalesMock } = await import('./configuracion.mock')
    return guardarDatosPersonalesMock(peticion)
  }

  try {
    await api.put(abogado.datosPersonales, peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function cambiarContrasena(peticion: PeticionCambioContrasena): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cambiarContrasenaMock } = await import('./configuracion.mock')
    return cambiarContrasenaMock(peticion)
  }

  try {
    await api.post(abogado.contrasena, peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function listarSesiones(): Promise<SesionActiva[]> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarSesionesMock } = await import('./configuracion.mock')
    return listarSesionesMock()
  }

  try {
    const r = await api.get<SesionActiva[]>(abogado.sesiones)
    return r.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function cerrarSesionRemota(id: string): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cerrarSesionRemotaMock } = await import('./configuracion.mock')
    return cerrarSesionRemotaMock(id)
  }

  try {
    await api.delete(abogado.sesion(id))
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function cerrarOtrasSesiones(): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cerrarOtrasSesionesMock } = await import('./configuracion.mock')
    return cerrarOtrasSesionesMock()
  }

  try {
    await api.delete(abogado.sesiones)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function obtenerNotificaciones(): Promise<PreferenciasNotificaciones> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerNotificacionesMock } = await import('./configuracion.mock')
    return obtenerNotificacionesMock()
  }

  try {
    const r = await api.get<PreferenciasNotificaciones>(abogado.notificaciones)
    return r.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function guardarNotificaciones(preferencias: PreferenciasNotificaciones): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarNotificacionesMock } = await import('./configuracion.mock')
    return guardarNotificacionesMock(preferencias)
  }

  try {
    await api.put(abogado.notificaciones, preferencias)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function obtenerPrivacidad(): Promise<PreferenciasPrivacidad> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerPrivacidadMock } = await import('./configuracion.mock')
    return obtenerPrivacidadMock()
  }

  try {
    const r = await api.get<PreferenciasPrivacidad>(abogado.privacidad)
    return r.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function guardarPrivacidad(preferencias: PreferenciasPrivacidad): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarPrivacidadMock } = await import('./configuracion.mock')
    return guardarPrivacidadMock(preferencias)
  }

  try {
    await api.put(abogado.privacidad, preferencias)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function solicitarExportacion(): Promise<{ correo: string }> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { solicitarExportacionMock } = await import('./configuracion.mock')
    return solicitarExportacionMock()
  }

  try {
    const r = await api.post<{ correo: string }>(abogado.exportarDatos)
    return r.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function obtenerCuentaDeposito(): Promise<CuentaDeposito> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerCuentaDepositoMock } = await import('./configuracion.mock')
    return obtenerCuentaDepositoMock()
  }

  try {
    const r = await api.get<CuentaDeposito>(abogado.cuentaDeposito)
    return r.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function guardarCuentaDeposito(peticion: PeticionCuentaDeposito): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { guardarCuentaDepositoMock } = await import('./configuracion.mock')
    return guardarCuentaDepositoMock(peticion)
  }

  try {
    await api.put(abogado.cuentaDeposito, peticion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export async function cerrarSesion(): Promise<void> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { cerrarSesionMock } = await import('./configuracion.mock')
    return cerrarSesionMock()
  }

  try {
    await api.post(ENDPOINTS.auth.cerrarSesion)
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
