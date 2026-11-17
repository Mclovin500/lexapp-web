import { useEffect, useRef } from 'react'
import { Icon } from '@/components/ui/Icon'
import { asistenteContent } from '../content/asistente.content'
import type { EstadoAsistente, MensajeAsistente, SugerenciaAsistente } from '../types/asistente.types'
import { BurbujaAsistente } from './BurbujaAsistente'
import { CampoAsistente } from './CampoAsistente'
import { SugerenciasAsistente } from './SugerenciasAsistente'

interface PanelAsistenteProps {
  abierto: boolean
  mensajes: MensajeAsistente[]
  estado: EstadoAsistente
  onCerrar: () => void
  onReiniciar: () => void
  onEnviar: (texto: string, sugerencia?: SugerenciaAsistente) => void
}

/** Panel flotante del asistente: encabezado, hilo de mensajes, sugerencias y campo de escritura. */
export function PanelAsistente({ abierto, mensajes, estado, onCerrar, onReiniciar, onEnviar }: PanelAsistenteProps) {
  const { header, welcome, disclaimer, typing, restartLabel } = asistenteContent
  const hilo = useRef<HTMLOListElement>(null)
  const escribiendo = estado === 'escribiendo'

  // El foco pasa al panel al abrirlo (accesibilidad: el usuario sigue el flujo del teclado).
  // `preventScroll` evita que el navegador mueva el scroll de la página de fondo.
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (abierto) panel.current?.focus({ preventScroll: true })
  }, [abierto])

  // Sigue el último mensaje, igual que en el chat de expedientes (H1).
  useEffect(() => {
    hilo.current?.scrollTo({ top: hilo.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes.length, escribiendo])

  // La rueda sobre el panel debe mover el hilo del chat, nunca la página de fondo.
  // Sin esto, al girar sobre las zonas fijas (encabezado, chips, disclaimer) o al
  // llegar el hilo a un extremo, el scroll se propagaba al contenido de atrás.
  useEffect(() => {
    if (!abierto) return
    const elemento = panel.current
    const lista = hilo.current
    if (!elemento || !lista) return

    const alRueda = (evento: WheelEvent) => {
      if (evento.deltaY === 0) return

      const enElHilo = lista.contains(evento.target as Node)
      const puedeAvanzar =
        evento.deltaY > 0
          ? lista.scrollTop + lista.clientHeight < lista.scrollHeight - 1
          : lista.scrollTop > 1

      // Cursor dentro del hilo y con recorrido disponible: lo maneja el navegador.
      if (enElHilo && puedeAvanzar) return

      evento.preventDefault()
      if (puedeAvanzar) lista.scrollTop += evento.deltaY
    }

    elemento.addEventListener('wheel', alRueda, { passive: false })
    return () => elemento.removeEventListener('wheel', alRueda)
  }, [abierto])

  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-label={header.title}
      aria-modal="false"
      className={`fixed z-50 bottom-24 right-4 sm:right-6 w-[min(24rem,calc(100vw-2rem))] h-[min(34rem,calc(100dvh-9rem))] flex flex-col rounded-2xl bg-surface text-on-surface shadow-2xl shadow-paleta-marino/25 border border-surface-container overflow-hidden focus:outline-none transition-[opacity,transform] duration-200 ${
        abierto ? 'opacity-100 translate-y-0 scale-100' : 'pointer-events-none opacity-0 translate-y-3 scale-95'
      }`}
      aria-hidden={!abierto}
      inert={!abierto}
    >
      {/* Encabezado */}
      <div className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container shrink-0">
        <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
          <Icon name="smart_toy" size={20} filled />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-label-lg font-semibold truncate">{header.title}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-on-primary-container/80">
            <span className="w-1.5 h-1.5 rounded-full bg-on-primary-container/70" aria-hidden="true" />
            {header.online}
          </p>
        </div>
        <button
          type="button"
          onClick={onReiniciar}
          aria-label={restartLabel}
          title={restartLabel}
          className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary-container"
        >
          <Icon name="refresh" size={18} />
        </button>
        <button
          type="button"
          onClick={onCerrar}
          aria-label={asistenteContent.close}
          title={asistenteContent.close}
          className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-primary-container"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      {/* Hilo de mensajes: `overscroll-behavior: contain` evita que, al llegar al
          final, el scroll se propague a la página de fondo. */}
      <ol
        ref={hilo}
        aria-label={header.title}
        aria-live="polite"
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 flex flex-col gap-4 bg-surface"
      >
        {mensajes.length === 0 && <li className="text-body-sm text-secondary">{asistenteContent.empty}</li>}
        {mensajes.map((mensaje, indice) => {
          const anterior = mensajes[indice - 1]
          const mismoAutor = anterior?.autor === mensaje.autor
          return <BurbujaAsistente key={mensaje.id} mensaje={mensaje} mostrarAutor={!mismoAutor} />
        })}

        {escribiendo && (
          <li className="flex items-center gap-2 self-start text-[11px] text-secondary" role="status">
            <span className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-surface-container-lowest shadow-sm">
              {[0, 1, 2].map((punto) => (
                <span
                  key={punto}
                  className="w-1.5 h-1.5 rounded-full bg-outline animate-pulse"
                  style={{ animationDelay: `${punto * 150}ms` }}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span>{typing}</span>
          </li>
        )}
      </ol>

      <SugerenciasAsistente
        sugerencias={asistenteContent.suggestions}
        visible={!escribiendo && mensajes.length <= 1}
        onElegir={(sugerencia) => onEnviar(sugerencia.etiqueta, sugerencia)}
      />

      <p className="px-4 pb-2 text-[11px] leading-4 text-secondary bg-surface-container-lowest">{disclaimer}</p>

      <CampoAsistente onEnviar={(texto) => onEnviar(texto)} deshabilitado={escribiendo} />

      <p className="sr-only">{welcome.hint}</p>
    </div>
  )
}
