import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { etiquetasShell } from '@/components/layouts/app/navegacion'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { areasPractica, etiquetaDe } from '@/features/auth/content/catalogos.content'
import { useResumenHonorarios } from '@/features/pagos/hooks/usePagos'
import { usePerfil } from '@/features/perfil/hooks/usePerfil'
import { formatearMonto } from '@/lib/moneda'
import { configuracionContent, estadosCuentaDeposito } from '../content/configuracion.content'
import { useCuentaDeposito } from '../hooks/useConfiguracion'

const enlace =
  'inline-flex items-center gap-1.5 self-start text-label-md text-primary font-semibold hover:underline rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

function Fila({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-body-md">
      <dt className="text-secondary">{etiqueta}</dt>
      <dd className="text-on-surface text-right font-medium">{children}</dd>
    </div>
  )
}

/** "Datos profesionales" (J1 → I1). */
export function ResumenProfesional() {
  const { professional: textos } = configuracionContent
  const perfil = usePerfil()
  if (perfil.isPending) return <EstadoCarga texto={textos.loading} />
  if (perfil.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[perfil.error.tipo]} onReintentar={() => void perfil.refetch()} />
  const p = perfil.data
  return (
    <>
      <dl className="flex flex-col gap-2">
        <Fila etiqueta={textos.cedula}>{p.cedula}</Fila>
        <Fila etiqueta={textos.validation}>{etiquetasShell.validation[p.estadoValidacion]}</Fila>
        <Fila etiqueta={textos.areas}>{p.areasPractica.map((a) => etiquetaDe(areasPractica, a)).join(', ')}</Fila>
      </dl>
      <Link to={ROUTES.profile} className={enlace}>
        {textos.view}
        <Icon name="arrow_forward" size={16} />
      </Link>
    </>
  )
}

/** "Información financiera" (resumen de D3). */
export function ResumenFinanciero() {
  const { financial: textos } = configuracionContent
  const resumen = useResumenHonorarios()
  if (resumen.isPending) return <EstadoCarga texto={textos.loading} />
  if (resumen.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[resumen.error.tipo]} onReintentar={() => void resumen.refetch()} />
  return (
    <>
      <dl className="flex flex-col gap-2">
        <Fila etiqueta={textos.total}>{formatearMonto(resumen.data.ingresosTotales)}</Fila>
        <Fila etiqueta={textos.received}>{formatearMonto(resumen.data.pagosRecibidos)}</Fila>
        <Fila etiqueta={textos.pending}>{formatearMonto(resumen.data.pagosPendientes)}</Fila>
      </dl>
      <Link to={ROUTES.fees} className={enlace}>
        {textos.view}
        <Icon name="arrow_forward" size={16} />
      </Link>
    </>
  )
}

/** "Cuenta de depósito" (J1 → J1A). */
export function ResumenCuentaDeposito() {
  const { deposit: textos } = configuracionContent
  const cuenta = useCuentaDeposito()
  if (cuenta.isPending) return <EstadoCarga texto={textos.loading} />
  if (cuenta.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[cuenta.error.tipo]} onReintentar={() => void cuenta.refetch()} />
  const estado = estadosCuentaDeposito[cuenta.data.estado]
  return (
    <>
      <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low">
        <Icon name="account_balance" size={24} className="text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          {cuenta.data.cuenta && (
            <p className="text-label-lg text-on-surface font-semibold">
              {cuenta.data.cuenta.banco.nombre} · {textos.ending(cuenta.data.cuenta.clabeTerminacion)}
            </p>
          )}
          <p className="text-body-sm text-secondary">{estado.descripcion}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold whitespace-nowrap ${estado.clases}`}>
          <Icon name={estado.icon} size={14} />
          {estado.label}
        </span>
      </div>
      <Link to={ROUTES.depositAccount} className={enlace}>
        {cuenta.data.estado === 'sin_cuenta' ? textos.configure : textos.edit}
        <Icon name="arrow_forward" size={16} />
      </Link>
    </>
  )
}
