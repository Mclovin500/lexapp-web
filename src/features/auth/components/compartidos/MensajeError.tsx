import { Link } from 'react-router-dom'
import { mensajePorTipo } from '../../lib/mapear-error'
import type { TipoErrorAuth } from '../../types/auth.types'

export interface EnlaceError {
  to: string
  label: string
}

interface MensajeErrorProps {
  tipo: TipoErrorAuth
  mensajes: { desconocido: string } & Partial<Record<TipoErrorAuth, string>>
  /** Enlace opcional por tipo de error (p. ej. sesión vencida → login). */
  enlaces?: Partial<Record<TipoErrorAuth, EnlaceError>>
}

/** Texto de error por tipo, con un enlace de salida cuando corresponde. */
export function MensajeError({ tipo, mensajes, enlaces = {} }: MensajeErrorProps) {
  const enlace = enlaces[tipo]

  return (
    <>
      {mensajePorTipo(tipo, mensajes)}
      {enlace && (
        <>
          {' '}
          <Link
            to={enlace.to}
            replace
            className="font-semibold underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
          >
            {enlace.label}
          </Link>
        </>
      )}
    </>
  )
}
