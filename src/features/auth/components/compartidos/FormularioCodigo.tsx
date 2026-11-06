import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { useTemporizador } from '@/hooks/useTemporizador'
import { codigoContent } from '../../content/codigo.content'
import { AlertaError } from './AlertaError'
import { CampoCodigo, LONGITUD_CODIGO } from './CampoCodigo'

export interface FormularioCodigoProps {
  /** Etiqueta visible del grupo de casillas. */
  etiqueta: string
  textoBoton: string
  /** Envía el código. Si la promesa se rechaza, la página muestra el error con `error`. */
  onVerificar: (codigo: string) => Promise<unknown>
  /** Pide un código nuevo y resuelve con los segundos de espera que indicó el backend. */
  onReenviar: () => Promise<number>
  /** Segundos de espera iniciales para reenviar (vienen del backend). */
  segundosInicialesReenvio: number
  /** Mensaje de error ya traducido (o `null`). */
  error: ReactNode
  /** Verificación en curso. */
  cargando: boolean
  /** Reenvío en curso. */
  reenviando?: boolean
  /** Habilita el reenvío aunque no haya terminado la espera (p. ej. código vencido). */
  permitirReenvioInmediato?: boolean
}

/** Casillas de código + verificar + reenvío con cuenta regresiva + error. Lo usan A2A y A2C. */
export function FormularioCodigo({
  etiqueta,
  textoBoton,
  onVerificar,
  onReenviar,
  segundosInicialesReenvio,
  error,
  cargando,
  reenviando = false,
  permitirReenvioInmediato = false,
}: FormularioCodigoProps) {
  const { resend, verifyingButton } = codigoContent
  const [codigo, setCodigo] = useState('')
  const [reenviado, setReenviado] = useState(false)
  const temporizador = useTemporizador(segundosInicialesReenvio)
  const idBase = useId()
  const idEtiqueta = `${idBase}-etiqueta`
  const idError = `${idBase}-error`
  const contenedor = useRef<HTMLDivElement>(null)

  /** Devuelve el foco a la primera casilla cuando se vuelve a habilitar. */
  const enfocarPrimera = () => {
    setTimeout(() => contenedor.current?.querySelector('input')?.focus(), 0)
  }

  const completo = codigo.length === LONGITUD_CODIGO
  const puedeReenviar = (temporizador.terminado || permitirReenvioInmediato) && !reenviando

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (!completo || cargando) return
    try {
      await onVerificar(codigo)
    } catch {
      // La página muestra el error a partir de su estado; aquí solo se limpia el código.
    } finally {
      setCodigo('')
      enfocarPrimera()
    }
  }

  const handleReenviar = async () => {
    try {
      const segundos = await onReenviar()
      temporizador.reiniciar(segundos)
      setCodigo('')
      setReenviado(true)
      enfocarPrimera()
    } catch {
      // La página muestra el error del reenvío.
      setReenviado(false)
    }
  }

  return (
    <div ref={contenedor} className="w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col items-center">
        <p
          id={idEtiqueta}
          className="block text-center text-label-md text-secondary mb-3 uppercase tracking-wider"
        >
          {etiqueta}
        </p>

        <CampoCodigo
          value={codigo}
          onChange={setCodigo}
          labelledBy={idEtiqueta}
          describedBy={error ? idError : undefined}
          error={Boolean(error)}
          disabled={cargando}
          autoFocus
        />

        {error && (
          <div className="w-full mt-5">
            <AlertaError id={idError}>{error}</AlertaError>
          </div>
        )}

        <button
          type="submit"
          disabled={!completo || cargando}
          className="w-full h-12 mt-6 bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {cargando ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>{verifyingButton}</span>
            </>
          ) : (
            <>
              <span>{textoBoton}</span>
              <Icon name="arrow_forward" size={20} />
            </>
          )}
        </button>
      </form>

      {/* Reenvío */}
      <div className="mt-8 flex flex-col items-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2 text-body-sm text-secondary">
          <span>{resend.question}</span>
          {!temporizador.terminado && (
            <span className="text-label-sm text-on-surface font-semibold flex items-center gap-1">
              <Icon name="timer" size={14} className="text-secondary" />
              <span>
                {resend.countdownPrefix}{' '}
                <span className="tabular-nums text-primary">{temporizador.formateado}</span>
              </span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleReenviar}
          disabled={!puedeReenviar}
          className="text-label-sm py-1.5 px-3 rounded transition-colors text-primary font-semibold hover:bg-surface-container-low cursor-pointer disabled:text-secondary/60 disabled:font-normal disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {reenviando ? resend.sendingButton : resend.button}
        </button>
        <p className="sr-only" aria-live="polite">
          {reenviado ? resend.sentNotice : ''}
        </p>
        <p className="mt-3 text-label-sm text-secondary/70 max-w-sm leading-normal">
          {resend.revocationNote}
        </p>
      </div>
    </div>
  )
}
