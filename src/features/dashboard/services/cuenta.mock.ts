// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { ESTADO_VALIDACION_MOCK } from '@/features/auth/services/sesion.mock'
import { contarMensajesSinLeerMock } from '@/features/chat/services/chat.mock'
import { fotoPerfilMock, NOMBRE_ABOGADO_MOCK } from '@/features/perfil/services/perfil.mock'
import { contarSolicitudesNuevasMock } from '@/features/solicitudes/services/solicitudes.mock'
import type { CuentaAbogado } from '../types/cuenta.types'
import { contarNoLeidasMock } from './notificaciones.mock'

export async function obtenerCuentaMock(): Promise<CuentaAbogado> {
  await esperar(300)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
  return {
    nombreCompleto: NOMBRE_ABOGADO_MOCK,
    tratamiento: 'Lic.',
    correo: 'alejandro.morales@despacho.mx',
    fotoUrl: fotoPerfilMock(),
    estadoValidacion: ESTADO_VALIDACION_MOCK,
    contadores: {
      solicitudesNuevas: contarSolicitudesNuevasMock(),
      mensajesSinLeer: contarMensajesSinLeerMock(),
      notificacionesSinLeer: contarNoLeidasMock(),
    },
  }
}
