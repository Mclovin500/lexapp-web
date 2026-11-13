import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Logo } from '@/components/ui/Logo'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { bienvenidaContent } from '../content/bienvenida.content'
import { useVerificarSesion } from '../hooks/useVerificarSesion'
import { destinoPorValidacion } from '../lib/destino-por-validacion'
import { esEstadoCarga } from '../lib/estado-navegacion'

/**
 * A1: pantalla de carga de transición.
 * - Con destino en el estado (A2A → B1/A5A, P03 → A3): espera el tiempo mínimo y continúa.
 * - Sin destino (acceso directo a /bienvenida): consulta la sesión →
 *   activa: B1 o A5A · sin sesión o error: P02.
 * Siempre navega con `replace`, para que "Atrás" no regrese a la carga.
 */
export function BienvenidaPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const destinoFijo = esEstadoCarga(state) ? state.destino : null
  const { data: sesion, isError } = useVerificarSesion(destinoFijo === null)
  const etiquetaCarga = destinoFijo
    ? bienvenidaContent.loadingLabelPorDestino[destinoFijo]
    : bienvenidaContent.loadingLabel
  const [tiempoMinimoCumplido, setTiempoMinimoCumplido] = useState(false)

  useEffect(() => {
    const temporizador = setTimeout(
      () => setTiempoMinimoCumplido(true),
      bienvenidaContent.minimumDisplayMs,
    )
    return () => clearTimeout(temporizador)
  }, [])

  useEffect(() => {
    if (!tiempoMinimoCumplido) return

    if (destinoFijo) {
      navigate(destinoFijo, { replace: true })
      return
    }

    if (!sesion && !isError) return
    const destino =
      sesion?.activa ? destinoPorValidacion(sesion.estadoValidacion) : ROUTES.login
    navigate(destino, { replace: true })
  }, [tiempoMinimoCumplido, destinoFijo, sesion, isError, navigate])

  return (
    <MarcoAcceso brilloAnimado>
      <div className="max-w-md w-full flex flex-col items-center text-center">
        {/* Logotipo */}
        <div className="relative mb-8">
          <div
            className="absolute -inset-2 bg-linear-to-b from-primary-container/20 to-transparent rounded-[32px] blur-md opacity-70"
            aria-hidden="true"
          />
          <Logo className="relative h-32 drop-shadow-[0_18px_30px_rgba(16,31,47,0.22)] transition duration-300 hover:scale-105 motion-reduce:transition-none" />
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
            <span className="tracking-wide">{etiquetaCarga}</span>
          </div>
        </div>
      </div>
    </MarcoAcceso>
  )
}
