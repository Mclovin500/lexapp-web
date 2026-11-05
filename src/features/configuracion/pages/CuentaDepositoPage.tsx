import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { usePerfil } from '@/features/perfil/hooks/usePerfil'
import { formatearFechaHora } from '@/lib/fechas'
import { FormularioCuentaDeposito } from '../components/FormularioCuentaDeposito'
import { cuentaDepositoContent, estadosCuentaDeposito } from '../content/configuracion.content'
import { useCuentaDeposito } from '../hooks/useConfiguracion'

/** J1A: cuenta bancaria para recibir honorarios (no tarjetas). Guardar → J1. */
export function CuentaDepositoPage() {
  const contenido = cuentaDepositoContent
  const navigate = useNavigate()
  const cuenta = useCuentaDeposito()
  const perfil = usePerfil()
  const [cambiando, setCambiando] = useState(false)
  const datos = cuenta.data

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.settings}
        className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {contenido.back}
      </Link>
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>
      <p className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low text-body-sm text-secondary">
        <Icon name="credit_card_off" size={18} className="shrink-0 mt-0.5" />
        {contenido.notCards}
      </p>

      {cuenta.isPending && <EstadoCarga texto={contenido.loading} />}
      {cuenta.isError && <EstadoError mensaje={MENSAJES_ERROR_API[cuenta.error.tipo]} onReintentar={() => void cuenta.refetch()} />}

      {datos && (() => {
        const estado = estadosCuentaDeposito[datos.estado]
        const mostrarFormulario = cambiando || datos.estado === 'sin_cuenta' || datos.estado === 'rechazada'
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <section aria-labelledby="cuenta-estado" className="xl:col-span-5 p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
              <h2 id="cuenta-estado" className="text-headline-sm text-on-surface">
                {contenido.status}
              </h2>
              <div role="status" className="flex items-start gap-3">
                <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${estado.clases}`}>
                  <Icon name={estado.icon} size={22} />
                </span>
                <div>
                  <p className="text-label-lg text-on-surface font-semibold">{estado.label}</p>
                  <p className="text-body-sm text-secondary">{estado.descripcion}</p>
                </div>
              </div>
              {datos.motivoRechazo && (
                <p className="p-3 rounded-lg bg-error/10 text-body-sm text-error">
                  <span className="font-semibold">{contenido.current.reason}:</span> {datos.motivoRechazo}
                </p>
              )}
              {datos.cuenta && (
                <dl className="flex flex-col gap-2 pt-4 border-t border-surface-container text-body-md">
                  <p className="text-label-md text-on-surface font-semibold">{contenido.current.title}</p>
                  {[
                    [contenido.current.holder, datos.cuenta.titular],
                    [contenido.current.bank, `${datos.cuenta.banco.nombre} (${datos.cuenta.banco.clave})`],
                    [contenido.current.clabe, `•••• •••• •••• ${datos.cuenta.clabeTerminacion}`],
                    [contenido.current.type, contenido.types[datos.cuenta.tipoCuenta]],
                    [contenido.current.country, contenido.countries[datos.cuenta.pais]],
                    [contenido.current.currency, contenido.currencies[datos.cuenta.moneda]],
                    ...(datos.actualizadaEn ? [[contenido.current.updatedAt, formatearFechaHora(datos.actualizadaEn)]] : []),
                  ].map(([etiqueta, valor]) => (
                    <div key={etiqueta} className="flex justify-between gap-4">
                      <dt className="text-secondary">{etiqueta}</dt>
                      <dd className="text-on-surface text-right font-medium tabular-nums">{valor}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {!mostrarFormulario && (
                <button
                  type="button"
                  onClick={() => setCambiando(true)}
                  className="h-11 px-5 inline-flex items-center justify-center gap-2 self-start rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer"
                >
                  <Icon name="edit" size={18} />
                  {contenido.form.titleUpdate}
                </button>
              )}
            </section>

            {mostrarFormulario && (
              <section aria-labelledby="cuenta-formulario" className="xl:col-span-7 p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
                <h2 id="cuenta-formulario" className="text-headline-sm text-on-surface">
                  {datos.cuenta ? contenido.form.titleUpdate : contenido.form.title}
                </h2>
                {/* Se espera al perfil para sugerir el titular (el formulario toma los valores una sola vez). */}
                {perfil.isPending ? (
                  <EstadoCarga texto={contenido.loading} />
                ) : (
                  <FormularioCuentaDeposito
                    titularSugerido={datos.cuenta?.titular ?? perfil.data?.nombreCompleto ?? ''}
                    onCancelar={() => (cambiando ? setCambiando(false) : navigate(ROUTES.settings))}
                  />
                )}
              </section>
            )}
          </div>
        )
      })()}
    </div>
  )
}
