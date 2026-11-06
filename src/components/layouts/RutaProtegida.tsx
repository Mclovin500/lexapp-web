import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { useVerificarSesion } from '@/features/auth/hooks/useVerificarSesion'

/**
 * Criterio 11.26: el panel solo se abre con sesión activa (`GET /auth/sesion`, cookie httpOnly).
 * Sin sesión → P02 · con sesión pero sin validación aprobada → A5A (regla 9.5).
 * Un error de red no expulsa al abogado: se muestra el error con "Reintentar".
 */
export function RutaProtegida({ children }: { children: ReactNode }) {
  const sesion = useVerificarSesion()

  // Si el dato en caché dice "sin sesión" pero se está volviendo a consultar (p. ej. justo después de A2A),
  // se espera la respuesta nueva en lugar de expulsar con un dato viejo.
  if (sesion.isPending || (sesion.isFetching && !sesion.data?.activa)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <EstadoCarga texto="Verificando tu sesión…" />
      </div>
    )
  }
  if (sesion.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="max-w-md w-full">
          <EstadoError mensaje="No pudimos verificar tu sesión. Revisa tu conexión." onReintentar={() => void sesion.refetch()} />
        </div>
      </div>
    )
  }
  if (!sesion.data.activa) return <Navigate to={ROUTES.login} replace />
  if (sesion.data.estadoValidacion !== 'validado') return <Navigate to={ROUTES.validationStatus} replace />
  return children
}
