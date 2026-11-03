// MOCK: eliminar al conectar el backend
import type { EstadoSesion } from '../types/sesion.types'

export async function obtenerSesionMock(): Promise<EstadoSesion> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  // Sin sesión: A1 redirige a P02. Cambiar a
  // { activa: true, estadoValidacion: 'validado' } para probar la ruta a B1.
  return { activa: false }
}
