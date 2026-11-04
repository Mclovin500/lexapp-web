import type { ReactNode } from 'react'
import { ROUTES } from '@/app/routes'
import { progresoRegistroContent } from '../../content/progreso-registro.content'
import { useProgresoRegistro } from '../../hooks/useRegistroProfesional'
import type { ProgresoRegistro } from '../../types/registro-profesional.types'
import { AlertaError } from '../compartidos/AlertaError'
import { MensajeError } from '../compartidos/MensajeError'

interface ConProgresoRegistroProps {
  /** Recibe lo ya guardado (o `undefined` si no se pudo cargar) para precargar el formulario. */
  children: (progreso: ProgresoRegistro | undefined) => ReactNode
}

/**
 * Carga `GET /registro/progreso` antes de montar el formulario de A4 o A5.
 * Si falla, avisa y deja capturar desde cero (salvo sesión vencida: lleva a P02).
 */
export function ConProgresoRegistro({ children }: ConProgresoRegistroProps) {
  const progreso = useProgresoRegistro()
  const contenido = progresoRegistroContent

  if (progreso.isPending) {
    return (
      <div role="status" className="py-12 flex flex-col items-center gap-3 text-body-sm text-secondary">
        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-container border-t-transparent" aria-hidden="true" />
        {contenido.loading}
      </div>
    )
  }

  if (progreso.isError && progreso.error.tipo === 'sesion_expirada') {
    return (
      <AlertaError>
        <MensajeError
          tipo="sesion_expirada"
          mensajes={{ sesion_expirada: contenido.sessionExpired, desconocido: contenido.sessionExpired }}
          enlaces={{ sesion_expirada: { to: ROUTES.login, label: contenido.loginLink } }}
        />
      </AlertaError>
    )
  }

  return (
    <>
      {progreso.isError && (
        <div className="mb-6">
          <AlertaError>
            {contenido.loadError}{' '}
            <button
              type="button"
              onClick={() => void progreso.refetch()}
              className="font-semibold underline hover:opacity-80 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
            >
              {contenido.retry}
            </button>
          </AlertaError>
        </div>
      )}
      {children(progreso.data)}
    </>
  )
}
