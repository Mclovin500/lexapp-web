import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { formatearMonto } from '@/lib/moneda'
import { honorariosContent } from '../content/honorarios.content'
import { useResumenHonorarios } from '../hooks/usePagos'
import type { ResumenHonorarios as Resumen } from '../types/pagos.types'

type Clave = keyof Resumen

/** "Resumen de ingresos" de D3. Retenidos y liberados solo se muestran si el backend los envía. */
export function ResumenHonorarios() {
  const { summary } = honorariosContent
  const resumen = useResumenHonorarios()

  if (resumen.isError) {
    return <EstadoError mensaje={`${summary.loadError} ${MENSAJES_ERROR_API[resumen.error.tipo]}`} onReintentar={() => void resumen.refetch()} />
  }

  const claves: Clave[] = ['ingresosTotales', 'pagosRecibidos', 'pagosPendientes', 'fondosRetenidos', 'fondosLiberados']
  const datos = resumen.data
  const visibles = claves.filter((clave) => !datos || datos[clave] !== null)

  return (
    <section aria-label={summary.ariaLabel} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {visibles.map((clave, indice) => {
        const texto = summary[clave]
        const valor = datos?.[clave]
        return (
          <div
            key={clave}
            className={`p-5 rounded-xl shadow-sm ${indice === 0 ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className={`text-label-md ${indice === 0 ? 'text-on-primary/90' : 'text-secondary'}`}>{texto.label}</p>
              <Icon name={texto.icon} size={20} className={indice === 0 ? '' : 'text-primary'} />
            </div>
            <p className="mt-2 text-headline-md tabular-nums" aria-busy={resumen.isPending}>
              {typeof valor === 'number' ? formatearMonto(valor) : '—'}
            </p>
            <p className={`mt-1 text-body-sm ${indice === 0 ? 'text-on-primary/80' : 'text-secondary'}`}>{texto.detail}</p>
          </div>
        )
      })}
    </section>
  )
}
