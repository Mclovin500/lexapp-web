import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { bienvenidaContent } from '../content/bienvenida.content'
import { useVerificarSesion } from '../hooks/useVerificarSesion'
import { destinoPorValidacion } from '../lib/destino-por-validacion'

/**
 * A1: pantalla de carga. Consulta la sesión y redirige:
 * sesión activa → B1 o A5A (según validación) · sin sesión o error → P02.
 */
export function BienvenidaPage() {
  const navigate = useNavigate()
  const { data: sesion, isError } = useVerificarSesion()
  const [tiempoMinimoCumplido, setTiempoMinimoCumplido] = useState(false)

  useEffect(() => {
    const temporizador = setTimeout(
      () => setTiempoMinimoCumplido(true),
      bienvenidaContent.minimumDisplayMs,
    )
    return () => clearTimeout(temporizador)
  }, [])

  useEffect(() => {
    if (!tiempoMinimoCumplido || (!sesion && !isError)) return

    const destino =
      sesion?.activa ? destinoPorValidacion(sesion.estadoValidacion) : ROUTES.login
    navigate(destino, { replace: true })
  }, [tiempoMinimoCumplido, sesion, isError, navigate])

  return (
    <MarcoAcceso brilloAnimado>
      <div className="max-w-md w-full flex flex-col items-center text-center">
        {/* Logotipo */}
        <div className="relative mb-8">
          <div
            className="absolute -inset-2 bg-linear-to-b from-primary-container/20 to-transparent rounded-[32px] blur-md opacity-70"
            aria-hidden="true"
          />
          <div className="relative w-28 h-28 bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,184,123,0.18),0_4px_16px_rgba(11,28,48,0.04)] border border-surface-container flex items-center justify-center transition duration-300 hover:scale-105">
            <Icon name="balance" size={56} className="text-primary-container" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">
          <span>{bienvenidaContent.brand.prefix}</span>
          <span className="text-primary-container">{bienvenidaContent.brand.highlight}</span>
        </h1>

        <p className="text-lg md:text-xl font-medium text-secondary mb-8 max-w-sm">
          {bienvenidaContent.slogan}
        </p>

        {/* Indicador de carga */}
        <div className="w-64 flex flex-col items-center space-y-3" role="status" aria-live="polite">
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
            <div className="h-full w-[68%] rounded-full bg-linear-to-r from-primary-fixed-dim to-primary-container animate-progreso-carga motion-reduce:animate-none" />
          </div>
          <div className="flex items-center gap-2 text-body-sm font-medium text-secondary">
            <span
              className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-container border-t-transparent"
              aria-hidden="true"
            />
            <span className="tracking-wide">{bienvenidaContent.loadingLabel}</span>
          </div>
        </div>
      </div>
    </MarcoAcceso>
  )
}
