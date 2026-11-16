import { useState, type FormEvent } from 'react'
import { MENSAJES_ERROR_API, type ErrorApi } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import { formatearTamano } from '@/lib/archivos'
import { formatearFechaHora } from '@/lib/fechas'
import { esImporteValido } from '@/lib/importes'
import { formatearMonto } from '@/lib/moneda'
import { camposCambio, estadosCambio, opcionesCampo, solicitudesCambioContent } from '../content/solicitudes-cambio.content'
import { useSolicitarCambio, useSolicitudesCambio } from '../hooks/useSolicitudesCambio'
import type { CampoCambioAbogado, PeticionCambio, SolicitudCambio } from '../types/solicitudes-cambio.types'

const TIPOS_ARCHIVO = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_ARCHIVO = 10 * 1024 * 1024

/** `valorNuevo` llega como `{ valor: ... }` (la cédula agrega la ruta del archivo). */
function valorLegible(solicitud: SolicitudCambio): string {
  const crudo = solicitud.valorNuevo
  const valor = typeof crudo === 'object' && crudo !== null && 'valor' in crudo ? (crudo as { valor: unknown }).valor : crudo
  if (solicitud.campo === 'tarifa_por_hora_centavos' && typeof valor === 'number') return `${formatearMonto(valor / 100)} por hora`
  if (solicitud.campo === 'experiencia_anos' && typeof valor === 'number') return valor === 1 ? '1 año' : `${valor} años`
  if (valor === null || valor === undefined) return '—'
  return typeof valor === 'object' ? JSON.stringify(valor) : String(valor)
}

function mensajeDeError(error: ErrorApi): string {
  return error.tipo === 'datos_invalidos' && error.detalle ? error.detalle : MENSAJES_ERROR_API[error.tipo]
}

/** I1: pedir cambios de tarifa, experiencia o cédula y consultar su estado. */
export function SolicitudesCambio() {
  const { form, errors: textosError, history } = solicitudesCambioContent
  const historial = useSolicitudesCambio()
  const solicitar = useSolicitarCambio()

  const [campo, setCampo] = useState<CampoCambioAbogado>('tarifa_por_hora_centavos')
  const [valor, setValor] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [justificacion, setJustificacion] = useState('')
  const [error, setError] = useState<{ valor?: string; archivo?: string }>({})
  const [enviada, setEnviada] = useState(false)

  const limpiar = () => {
    setValor('')
    setArchivo(null)
    setJustificacion('')
    setError({})
  }

  const construir = (): PeticionCambio | { valor?: string; archivo?: string } => {
    const texto = valor.trim()
    if (campo === 'tarifa_por_hora_centavos') {
      return esImporteValido(texto) ? { campo, tarifaPesos: Number(texto), justificacion } : { valor: textosError.fee }
    }
    if (campo === 'experiencia_anos') {
      return /^\d{1,2}$/.test(texto) && Number(texto) <= 80 ? { campo, anios: Number(texto), justificacion } : { valor: textosError.years }
    }
    const errores: { valor?: string; archivo?: string } = {}
    if (texto.length < 1 || texto.length > 50) errores.valor = textosError.cedula
    if (!archivo || !TIPOS_ARCHIVO.includes(archivo.type) || archivo.size > MAX_ARCHIVO) errores.archivo = textosError.file
    if (errores.valor || errores.archivo || !archivo) return errores
    return { campo, cedula: texto, archivo, justificacion }
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setEnviada(false)
    setError({})
    const peticion = construir()
    if (!('campo' in peticion)) {
      setError(peticion)
      return
    }
    solicitar.mutate(peticion, {
      onSuccess: () => {
        limpiar()
        setEnviada(true)
      },
    })
  }

  return (
    <section aria-labelledby="solicitudes-cambio" className="rounded-xl bg-surface-container-lowest shadow-sm p-6 flex flex-col gap-6">
      <div>
        <h2 id="solicitudes-cambio" className="text-headline-sm text-on-surface">
          {solicitudesCambioContent.title}
        </h2>
        <p className="mt-1 text-body-sm text-secondary">{solicitudesCambioContent.description}</p>
      </div>

      <form onSubmit={enviar} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoSelect
          id="cambio-campo"
          label={form.field}
          icon="tune"
          opciones={opcionesCampo}
          placeholder={form.field}
          value={campo}
          onChange={(evento) => {
            setCampo(evento.target.value as CampoCambioAbogado)
            limpiar()
            setEnviada(false)
            solicitar.reset()
          }}
        />

        {campo === 'tarifa_por_hora_centavos' && (
          <CampoTexto
            id="cambio-valor"
            label={form.fee}
            icon="payments"
            inputMode="decimal"
            placeholder={form.feePlaceholder}
            value={valor}
            error={error.valor}
            onChange={(evento) => setValor(evento.target.value)}
          />
        )}
        {campo === 'experiencia_anos' && (
          <CampoTexto
            id="cambio-valor"
            label={form.years}
            icon="workspace_premium"
            inputMode="numeric"
            placeholder={form.yearsPlaceholder}
            value={valor}
            error={error.valor}
            onChange={(evento) => setValor(evento.target.value)}
          />
        )}
        {campo === 'cedula_profesional' && (
          <>
            <CampoTexto
              id="cambio-valor"
              label={form.cedula}
              icon="badge"
              maxLength={50}
              placeholder={form.cedulaPlaceholder}
              value={valor}
              error={error.valor}
              onChange={(evento) => setValor(evento.target.value)}
            />
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="cambio-archivo" className="block text-label-md text-on-surface font-medium">
                {form.file}
              </label>
              <input
                id="cambio-archivo"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                aria-invalid={Boolean(error.archivo)}
                aria-describedby="cambio-archivo-ayuda"
                onChange={(evento) => setArchivo(evento.target.files?.[0] ?? null)}
                className="block w-full text-body-sm text-on-surface file:mr-3 file:h-10 file:px-4 file:rounded-lg file:border-0 file:bg-surface-container file:text-label-md file:font-semibold file:text-on-surface hover:file:bg-surface-container-high file:cursor-pointer"
              />
              <p id="cambio-archivo-ayuda" className={`text-body-sm ${error.archivo ? 'text-error' : 'text-secondary'}`}>
                {error.archivo ?? (archivo ? `${archivo.name} · ${formatearTamano(archivo.size)}` : form.fileHint)}
              </p>
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <CampoTexto
            id="cambio-justificacion"
            label={form.justification}
            labelHint={form.optional}
            icon="notes"
            maxLength={1000}
            placeholder={form.justificationPlaceholder}
            value={justificacion}
            onChange={(evento) => setJustificacion(evento.target.value)}
          />
        </div>

        {solicitar.isError && (
          <div className="md:col-span-2">
            <EstadoError mensaje={mensajeDeError(solicitar.error)} />
          </div>
        )}
        {enviada && (
          <p role="status" className="md:col-span-2 p-3 rounded-lg bg-primary-container/10 text-primary text-body-sm flex items-center gap-2">
            <Icon name="check_circle" size={18} />
            {form.sent}
          </p>
        )}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={solicitar.isPending}
            className="inline-flex h-11 px-5 items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="send" size={18} />
            {solicitar.isPending ? form.submitting : form.submit}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        <h3 className="text-label-lg text-on-surface font-semibold">{history.title}</h3>
        {historial.isPending && <EstadoCarga texto={history.loading} />}
        {historial.isError && <EstadoError mensaje={MENSAJES_ERROR_API[historial.error.tipo]} onReintentar={() => void historial.refetch()} />}
        {historial.data && historial.data.length === 0 && <p className="text-body-sm text-secondary">{history.empty}</p>}
        {historial.data && historial.data.length > 0 && (
          <ul className="flex flex-col divide-y divide-surface-container">
            {historial.data.map((s) => {
              const estado = estadosCambio[s.estadoCambio]
              return (
                <li key={s.idSolicitud} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-label-lg text-on-surface">
                      {camposCambio[s.campo] ?? s.campo}: <span className="font-semibold">{valorLegible(s)}</span>
                    </p>
                    <p className="text-body-sm text-secondary">
                      {history.requested} {formatearFechaHora(s.creadoEn)}
                    </p>
                    {s.motivoRechazo && (
                      <p className="text-body-sm text-error">
                        {history.reason}: {s.motivoRechazo}
                      </p>
                    )}
                  </div>
                  <span className={`self-start sm:self-center inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${estado.clases}`}>
                    <Icon name={estado.icon} size={14} />
                    {estado.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
