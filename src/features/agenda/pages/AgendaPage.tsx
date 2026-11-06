import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import type { EstadoAbrirCliente } from '@/features/chat/types/chat.types'
import { formatearFechaLarga } from '@/lib/fechas'
import { CalendarioMensual } from '../components/CalendarioMensual'
import { DialogoDetalleReunion } from '../components/DialogoDetalleReunion'
import { DialogoDisponibilidad } from '../components/DialogoDisponibilidad'
import { DialogoProgramarReunion, type PrecargaReunion } from '../components/DialogoProgramarReunion'
import { ListaReunionesAgenda } from '../components/ListaReunionesAgenda'
import { agendaContent } from '../content/agenda.content'
import { useReuniones } from '../hooks/useAgenda'
import { aFechaLocal, deFechaLocal, diasDeCuadricula } from '../lib/calendario'

function esEstadoAbrirCliente(valor: unknown): valor is EstadoAbrirCliente {
  return typeof valor === 'object' && valor !== null && typeof (valor as Record<string, unknown>).clienteId === 'string'
}

const tarjeta = 'p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4'

/**
 * G1: calendario, reuniones del día, próximas e historial. Programar reunión, configurar disponibilidad,
 * consultar y unirse (→ G1A). Desde E2 llega con `{ clienteId, expedienteId }` y abre "Programar reunión".
 */
export function AgendaPage() {
  const contenido = agendaContent
  const navigate = useNavigate()
  const { state, pathname, search } = useLocation()
  const [parametros, setParametros] = useSearchParams()
  const seleccionado = deFechaLocal(parametros.get('fecha') ?? '') ? (parametros.get('fecha') ?? '') : aFechaLocal(new Date())
  const fechaSeleccionada = deFechaLocal(seleccionado) ?? new Date()
  const mes = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), 1)
  const cuadricula = diasDeCuadricula(mes)
  const rango = {
    desde: cuadricula[0].toISOString(),
    hasta: new Date(cuadricula[41].getFullYear(), cuadricula[41].getMonth(), cuadricula[41].getDate() + 1).toISOString(),
  }

  const delMes = useReuniones(rango)
  const proximas = useReuniones({ alcance: 'proximas', limite: 5 })
  const historial = useReuniones({ alcance: 'historial', limite: 8 })

  const [consultada, setConsultada] = useState<string | null>(null)
  const [programar, setProgramar] = useState<PrecargaReunion | null>(() =>
    esEstadoAbrirCliente(state) ? { fecha: seleccionado, clienteId: state.clienteId, expedienteId: state.expedienteId ?? null } : null,
  )
  const [disponibilidad, setDisponibilidad] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  // El estado de navegación se usa una sola vez: al recargar no vuelve a abrir el diálogo.
  useEffect(() => {
    if (esEstadoAbrirCliente(state)) navigate({ pathname, search }, { replace: true, state: null })
  }, [state, pathname, search, navigate])

  const delDia = (delMes.data ?? []).filter((r) => aFechaLocal(new Date(r.inicio)) === seleccionado)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setAviso(null)
              setDisponibilidad(true)
            }}
            className="inline-flex h-10 px-4 items-center gap-2 rounded-lg bg-surface-container-lowest text-on-surface text-label-md font-semibold shadow-sm hover:bg-surface-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="tune" size={18} />
            {contenido.actions.availability}
          </button>
          <button
            type="button"
            onClick={() => {
              setAviso(null)
              setProgramar({ fecha: seleccionado })
            }}
            className="inline-flex h-10 px-4 items-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-md font-semibold shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="add" size={18} />
            {contenido.actions.schedule}
          </button>
        </div>
      </div>

      {aviso && (
        <p role="status" className="flex items-start gap-2 p-4 rounded-lg bg-primary-container/10 text-body-md text-primary">
          <Icon name="check_circle" size={20} className="shrink-0" />
          {aviso}
        </p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 flex flex-col gap-6">
          <CalendarioMensual
            mes={mes}
            seleccionado={seleccionado}
            reuniones={delMes.data ?? []}
            cargando={delMes.isFetching}
            onSeleccionar={(fecha) => setParametros(fecha === aFechaLocal(new Date()) ? {} : { fecha })}
          />
          <section aria-labelledby="agenda-dia" className={tarjeta}>
            <h2 id="agenda-dia" className="text-headline-sm text-on-surface capitalize">
              {formatearFechaLarga(fechaSeleccionada)}
            </h2>
            {delMes.isPending && <EstadoCarga texto={contenido.loading} />}
            {delMes.isError && <EstadoError mensaje={MENSAJES_ERROR_API[delMes.error.tipo]} onReintentar={() => void delMes.refetch()} />}
            {delMes.data && <ListaReunionesAgenda reuniones={delDia} vacio={contenido.day.empty} onConsultar={setConsultada} />}
          </section>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-6">
          <section aria-labelledby="agenda-proximas" className={tarjeta}>
            <h2 id="agenda-proximas" className="text-headline-sm text-on-surface">
              {contenido.upcoming.title}
            </h2>
            {proximas.isError && <EstadoError mensaje={MENSAJES_ERROR_API[proximas.error.tipo]} onReintentar={() => void proximas.refetch()} />}
            {proximas.data && <ListaReunionesAgenda reuniones={proximas.data} vacio={contenido.upcoming.empty} conDia onConsultar={setConsultada} />}
          </section>
          <section aria-labelledby="agenda-historial" className={tarjeta}>
            <h2 id="agenda-historial" className="text-headline-sm text-on-surface">
              {contenido.history.title}
            </h2>
            {historial.isError && <EstadoError mensaje={MENSAJES_ERROR_API[historial.error.tipo]} onReintentar={() => void historial.refetch()} />}
            {historial.data && <ListaReunionesAgenda reuniones={historial.data} vacio={contenido.history.empty} conDia onConsultar={setConsultada} />}
          </section>
        </div>
      </div>

      <DialogoDetalleReunion
        reunionId={consultada}
        onCerrar={() => setConsultada(null)}
        onCancelada={() => {
          setConsultada(null)
          setAviso(contenido.detail.cancelled)
        }}
      />
      <DialogoProgramarReunion
        precarga={programar}
        onCerrar={() => setProgramar(null)}
        onProgramada={(fecha) => {
          setProgramar(null)
          setAviso(contenido.scheduleDialog.done)
          setParametros(fecha === aFechaLocal(new Date()) ? {} : { fecha })
        }}
      />
      <DialogoDisponibilidad
        abierto={disponibilidad}
        onCerrar={() => setDisponibilidad(false)}
        onGuardada={() => {
          setDisponibilidad(false)
          setAviso(contenido.availabilityDialog.done)
        }}
      />
    </div>
  )
}
