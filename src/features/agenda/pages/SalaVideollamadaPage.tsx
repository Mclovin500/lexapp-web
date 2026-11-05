import { useEffect, useRef, useState, type ReactNode } from 'react'
import { generatePath, Link, useParams, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import { Avatar } from '@/components/ui/Avatar'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { useAhora } from '@/hooks/useAhora'
import { formatearHora } from '@/lib/fechas'
import { VideoLocal } from '../components/VideoLocal'
import { fasesSala, salaContent, type FaseSala } from '../content/sala.content'
import { useDetalleReunion, useEntrarSala, useFinalizarReunion } from '../hooks/useAgenda'
import { useMedios } from '../hooks/useMedios'
import { formatearCronometro, formatearDuracion } from '../lib/calendario'
import { conectarVideollamada, type ConexionVideollamada } from '../services/videollamada.service'
import type { ReunionDetalle } from '../types/agenda.types'

const CONVERSACION_VALIDA = /^[\w-]{1,40}$/

/** G1A: sala de videollamada. Al finalizar → G1, o → H1 si se abrió desde el chat (`?origen=chat&conversacion=`). */
export function SalaVideollamadaPage() {
  const { reunionId = '' } = useParams()
  const [parametros] = useSearchParams()
  const conversacion = parametros.get('origen') === 'chat' ? (parametros.get('conversacion') ?? '') : ''
  const rutaRegreso = CONVERSACION_VALIDA.test(conversacion)
    ? `${ROUTES.chat}?${new URLSearchParams({ conversacion }).toString()}`
    : null
  const detalle = useDetalleReunion(reunionId)
  const ahora = useAhora(15_000)
  // Una vez dentro, la sala se mantiene aunque la reunión pase a "finalizada" (para mostrar el cierre).
  const [dentro, setDentro] = useState(false)
  const contenido = salaContent

  const volver = (
    <Link
      to={rutaRegreso ?? ROUTES.agenda}
      className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Icon name="arrow_back" size={18} />
      {rutaRegreso ? contenido.backChat : contenido.backAgenda}
    </Link>
  )

  if (detalle.isPending) return <EstadoCarga texto={contenido.loading} />
  if (detalle.isError) {
    const tipo = detalle.error.tipo
    return (
      <div className="flex flex-col gap-6">
        {volver}
        <EstadoError mensaje={tipo === 'sin_permiso' || tipo === 'no_encontrado' ? contenido.errors[tipo] : MENSAJES_ERROR_API[tipo]} />
      </div>
    )
  }

  const r = detalle.data
  const cerrada = r.estado === 'finalizada' || r.estado === 'cancelada' || r.estado === 'no_realizada'
  const antesDeAbrir = ahora < Date.parse(r.sala.abreEn)

  if (!dentro && (cerrada || antesDeAbrir)) {
    return (
      <div className="flex flex-col gap-6">
        {volver}
        <div className="p-8 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center text-center gap-3">
          <Icon name={cerrada ? 'event_busy' : 'schedule'} size={36} className="text-secondary" />
          <h1 className="text-headline-sm text-on-surface">{r.titulo}</h1>
          <p className="text-body-md text-on-surface-variant">
            {cerrada ? contenido.unavailable[r.estado as 'finalizada' | 'cancelada' | 'no_realizada'] : contenido.unavailable.notYet(formatearHora(r.sala.abreEn))}
          </p>
          {r.estado === 'finalizada' && r.duracionRealSegundos !== null && (
            <p className="text-body-sm text-secondary">
              {contenido.ended.duration}: {formatearDuracion(r.duracionRealSegundos)}
            </p>
          )}
        </div>
      </div>
    )
  }

  // `key`: si cambia la reunión, la sala empieza de cero.
  return <Sala key={r.id} reunion={r} rutaRegreso={rutaRegreso} volver={volver} onDentro={() => setDentro(true)} />
}

interface SalaProps {
  reunion: ReunionDetalle
  rutaRegreso: string | null
  volver: ReactNode
  onDentro: () => void
}

function Sala({ reunion, rutaRegreso, volver, onDentro }: SalaProps) {
  const contenido = salaContent
  const medios = useMedios()
  const entrar = useEntrarSala(reunion.id)
  const finalizar = useFinalizarReunion(reunion.id)
  const [fase, setFase] = useState<FaseSala>('preparando')
  const [errorProveedor, setErrorProveedor] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const [resumen, setResumen] = useState('')
  const [inicioLlamada, setInicioLlamada] = useState<number | null>(null)
  const [duracionFinal, setDuracionFinal] = useState(0)
  const conexion = useRef<ConexionVideollamada | null>(null)
  const ahora = useAhora(1000)
  const { iniciar } = medios

  useEffect(() => {
    void iniciar()
  }, [iniciar])

  // Al salir de la pantalla (o si se sale mientras conecta) se cierra la conexión.
  const montada = useRef(true)
  useEffect(() => {
    montada.current = true
    return () => {
      montada.current = false
      conexion.current?.desconectar()
      conexion.current = null
    }
  }, [])

  const alCambiarEstado = (estado: FaseSala) => {
    setFase(estado)
    if (estado === 'activa') setInicioLlamada((actual) => actual ?? Date.now())
  }

  const entrarASala = () => {
    setErrorProveedor(false)
    entrar.mutate(undefined, {
      onSuccess: async (acceso) => {
        onDentro()
        try {
          const nueva = await conectarVideollamada(acceso, alCambiarEstado)
          if (montada.current) conexion.current = nueva
          else nueva.desconectar()
        } catch {
          if (montada.current) {
            setFase('preparando')
            setErrorProveedor(true)
          }
        }
      },
    })
  }

  const segundos = inicioLlamada ? Math.max(0, Math.floor((ahora - inicioLlamada) / 1000)) : 0

  const terminar = () => {
    finalizar.mutate(
      { duracionSegundos: segundos, resumen: resumen.trim() },
      {
        onSuccess: () => {
          conexion.current?.desconectar()
          conexion.current = null
          medios.detenerTodo()
          setDuracionFinal(segundos)
          setConfirmar(false)
          setFase('finalizada')
        },
      },
    )
  }

  const estiloFase = fasesSala[fase]
  const enLlamada = fase !== 'preparando' && fase !== 'finalizada'

  if (fase === 'finalizada') {
    return (
      <div className="flex flex-col gap-6">
        <div className="p-8 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center text-center gap-4 max-w-xl mx-auto w-full">
          <span className="w-14 h-14 rounded-full bg-primary-container/15 text-primary flex items-center justify-center">
            <Icon name="task_alt" size={30} />
          </span>
          <h1 className="text-headline-md text-on-surface">{contenido.ended.title}</h1>
          <dl className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div>
              <dt className="text-label-sm uppercase text-secondary">{contenido.ended.duration}</dt>
              <dd className="text-body-md text-on-surface">{formatearDuracion(duracionFinal)}</dd>
            </div>
            <div>
              <dt className="text-label-sm uppercase text-secondary">{contenido.ended.client}</dt>
              <dd className="text-body-md text-on-surface">{reunion.cliente.nombre}</dd>
            </div>
            <div>
              <dt className="text-label-sm uppercase text-secondary">{contenido.ended.case}</dt>
              <dd className="text-body-md text-on-surface">
                {reunion.expediente ? (
                  <Link to={generatePath(ROUTES.caseDetail, { expedienteId: reunion.expediente.id })} className="text-primary hover:underline">
                    {reunion.expediente.folio}
                  </Link>
                ) : (
                  contenido.noCase
                )}
              </dd>
            </div>
          </dl>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {rutaRegreso && (
              <Link to={rutaRegreso} className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold">
                <Icon name="chat" size={20} />
                {contenido.backChat}
              </Link>
            )}
            <Link
              to={ROUTES.agenda}
              className={`h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg text-label-lg font-semibold ${
                rutaRegreso ? 'bg-surface-container text-on-surface hover:bg-surface-container-high' : 'bg-primary-container hover:bg-primary text-on-primary'
              }`}
            >
              <Icon name="calendar_month" size={20} />
              {contenido.backAgenda}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const textoMedios = {
    inactivo: contenido.prepare.requesting,
    solicitando: contenido.prepare.requesting,
    listo: contenido.prepare.ready,
    sin_permiso: contenido.prepare.denied,
    sin_dispositivos: contenido.prepare.noDevices,
    no_soportado: contenido.prepare.unsupported,
    error: contenido.prepare.error,
  }[medios.estado]

  const botonControl = (activo: boolean) =>
    `w-12 h-12 rounded-full inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
      activo ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-error text-on-error hover:opacity-90'
    }`

  return (
    <div className="flex flex-col gap-4">
      {!enLlamada && volver}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-headline-md text-on-surface tracking-tight truncate">{reunion.titulo}</h1>
          <p className="text-body-md text-on-surface-variant truncate">
            {reunion.cliente.nombre} · {reunion.expediente ? `${reunion.expediente.folio}` : contenido.noCase}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span role="status" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-md font-semibold ${estiloFase.clases}`}>
            <Icon name={estiloFase.icon} size={16} />
            {estiloFase.label}
          </span>
          <span className="inline-flex items-center gap-1.5 text-label-lg text-on-surface tabular-nums" aria-label={`${contenido.duration}: ${formatearCronometro(segundos)}`}>
            <Icon name="timer" size={18} className="text-secondary" />
            {formatearCronometro(segundos)}
          </span>
        </div>
      </header>

      <div className="relative rounded-xl bg-[#101418] overflow-hidden aspect-video max-h-[70vh] w-full flex items-center justify-center">
        {/* Video del cliente */}
        {fase === 'activa' ? (
          <div className="flex flex-col items-center gap-3 text-white">
            <Avatar nombre={reunion.cliente.nombre} size="lg" className="bg-white/15! text-white!" />
            <p className="text-label-lg font-semibold">{reunion.cliente.nombre}</p>
            <p className="text-body-sm text-white/70">{import.meta.env.DEV && USAR_MOCKS ? 'Datos de prueba: el video del cliente se simula.' : contenido.clientVideo}</p>
          </div>
        ) : fase === 'preparando' ? (
          <div className="max-w-md p-6 text-center flex flex-col items-center gap-3 text-white">
            <Icon name="settings_input_component" size={32} className="text-white/80" />
            <p className="text-headline-sm">{contenido.prepare.title}</p>
            <p className="text-body-md text-white/80">{contenido.prepare.description}</p>
            <p className="text-body-sm text-white/70" aria-live="polite">{textoMedios}</p>
            {errorProveedor && <p className="text-body-sm text-error-container">{contenido.errors.provider}</p>}
            {entrar.isError && (
              <p className="text-body-sm text-error-container">
                {entrar.error.tipo === 'conflicto' || entrar.error.tipo === 'sin_permiso' ? contenido.errors[entrar.error.tipo] : MENSAJES_ERROR_API[entrar.error.tipo]}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              {(medios.estado === 'sin_permiso' || medios.estado === 'error' || medios.estado === 'sin_dispositivos') && (
                <button type="button" onClick={() => void medios.iniciar()} className="h-11 px-4 rounded-lg bg-white/15 text-white text-label-lg font-semibold hover:bg-white/25 cursor-pointer">
                  {contenido.prepare.retry}
                </button>
              )}
              <button
                type="button"
                onClick={entrarASala}
                disabled={entrar.isPending || medios.estado === 'solicitando' || medios.estado === 'inactivo'}
                className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Icon name="login" size={20} />
                {entrar.isPending ? contenido.prepare.entering : contenido.prepare.enter}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-white text-center p-6" aria-live="polite">
            <Icon name={estiloFase.icon} size={36} className={fase === 'interrumpida' ? 'text-error-container' : 'text-white/80'} />
            <p className="text-label-lg font-semibold">{estiloFase.label}</p>
            <p className="text-body-md text-white/75 max-w-sm">
              {fase === 'esperando_cliente' ? contenido.waiting : fase === 'conectando' ? contenido.connecting : contenido.interrupted}
            </p>
          </div>
        )}

        {/* Vista propia (o pantalla compartida) */}
        <div className="absolute right-3 bottom-3 w-36 sm:w-48 aspect-video rounded-lg overflow-hidden bg-black/60 ring-1 ring-white/20 flex items-center justify-center">
          {medios.pantalla ? (
            <VideoLocal stream={medios.pantalla} etiqueta={contenido.controls.share} />
          ) : medios.camaraStream && medios.camara ? (
            <VideoLocal stream={medios.camaraStream} etiqueta={contenido.you} espejo />
          ) : (
            <Icon name="videocam_off" size={24} className="text-white/60" />
          )}
          <span className="absolute left-1.5 bottom-1 text-[11px] text-white/90 font-semibold">{contenido.you}</span>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-3 rounded-xl bg-[#101418]">
        <button
          type="button"
          onClick={medios.alternarMicrofono}
          disabled={!medios.camaraStream}
          aria-pressed={!medios.microfono}
          aria-label={medios.microfono ? contenido.controls.micOn : contenido.controls.micOff}
          className={botonControl(medios.microfono)}
        >
          <Icon name={medios.microfono ? 'mic' : 'mic_off'} size={22} />
        </button>
        <button
          type="button"
          onClick={medios.alternarCamara}
          disabled={!medios.camaraStream}
          aria-pressed={!medios.camara}
          aria-label={medios.camara ? contenido.controls.camOn : contenido.controls.camOff}
          className={botonControl(medios.camara)}
        >
          <Icon name={medios.camara ? 'videocam' : 'videocam_off'} size={22} />
        </button>
        {medios.puedeCompartir && (
          <button
            type="button"
            onClick={() => void medios.compartirPantalla()}
            disabled={fase !== 'activa'}
            aria-pressed={Boolean(medios.pantalla)}
            aria-label={medios.pantalla ? contenido.controls.stopShare : contenido.controls.share}
            className={botonControl(true)}
          >
            <Icon name={medios.pantalla ? 'cancel_presentation' : 'present_to_all'} size={22} />
          </button>
        )}
        {/* Solo con datos de prueba: el texto va aquí para que el build de producción lo elimine. */}
        {import.meta.env.DEV && USAR_MOCKS && (
          <button
            type="button"
            onClick={() => conexion.current?.simularCorte?.()}
            disabled={fase !== 'activa'}
            aria-label="Simular corte de conexión"
            title="Simular corte de conexión"
            className={botonControl(true)}
          >
            <Icon name="wifi_off" size={22} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setConfirmar(true)}
          disabled={!enLlamada}
          className="h-12 px-5 rounded-full inline-flex items-center gap-2 bg-error text-on-error text-label-lg font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Icon name="call_end" size={22} />
          {contenido.controls.end}
        </button>
      </div>

      <Dialogo abierto={confirmar} onCerrar={() => setConfirmar(false)} titulo={contenido.endDialog.title} descripcion={contenido.endDialog.description}>
        <div className="flex flex-col gap-4">
          <CampoAreaTexto
            id="sala-resumen"
            label={contenido.endDialog.summary}
            labelHint={<span className="text-secondary font-normal">{contenido.endDialog.optional}</span>}
            icon="edit_note"
            rows={3}
            maxLength={1000}
            longitud={resumen.length}
            placeholder={contenido.endDialog.summaryPlaceholder}
            value={resumen}
            onChange={(evento) => setResumen(evento.target.value)}
          />
          {finalizar.isError && (
            <EstadoError mensaje={finalizar.error.tipo === 'conflicto' ? contenido.errors.conflicto : MENSAJES_ERROR_API[finalizar.error.tipo]} />
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmar(false)}
              className="h-11 px-5 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer"
            >
              {contenido.endDialog.cancel}
            </button>
            <button
              type="button"
              disabled={finalizar.isPending}
              onClick={terminar}
              className="h-11 px-5 rounded-lg bg-error text-on-error text-label-lg font-semibold hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {finalizar.isPending ? contenido.endDialog.ending : contenido.endDialog.confirm}
            </button>
          </div>
        </div>
      </Dialogo>
    </div>
  )
}
