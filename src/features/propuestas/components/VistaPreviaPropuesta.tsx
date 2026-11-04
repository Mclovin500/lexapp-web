import { useWatch, type Control } from 'react-hook-form'
import { Icon } from '@/components/ui/Icon'
import { formatearFechaCorta } from '@/lib/fechas'
import { esImporteValido } from '@/lib/importes'
import { formatearMonto } from '@/lib/moneda'
import type { OpcionCliente } from '@/features/clientes/types/clientes.types'
import { nuevaPropuestaContent } from '../content/nueva-propuesta.content'
import type { PropuestaFormValues } from '../schemas/propuesta.schema'

interface VistaPreviaPropuestaProps {
  control: Control<PropuestaFormValues>
  clientes: OpcionCliente[]
}

/** Resumen en vivo de la propuesta (Stitch D1: "vista previa resumida"). */
export function VistaPreviaPropuesta({ control, clientes }: VistaPreviaPropuestaProps) {
  const { preview } = nuevaPropuestaContent
  const [clienteId, servicio, honorarios, conceptos, fechaVigencia, tiempoEstimado] = useWatch({
    control,
    name: ['clienteId', 'servicio', 'honorarios', 'conceptos', 'fechaVigencia', 'tiempoEstimado'],
  })
  const cliente = clientes.find((c) => c.id === clienteId)

  return (
    <aside aria-labelledby="vista-previa" className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
      <div className="h-1.5 bg-primary-container" aria-hidden="true" />
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h2 id="vista-previa" className="flex items-center gap-2 text-headline-sm text-on-surface">
            <Icon name="visibility" size={20} className="text-primary" />
            {preview.title}
          </h2>
          <p className="text-body-sm text-secondary">{preview.note}</p>
        </div>

        <div>
          <p className="text-label-lg text-on-surface font-semibold">{cliente?.nombre ?? preview.noClient}</p>
          {cliente?.organizacion && <p className="text-body-sm text-secondary">{cliente.organizacion}</p>}
        </div>

        <p className="text-body-md text-on-surface-variant">{servicio.trim() || preview.noService}</p>

        <div className="p-4 rounded-lg bg-primary-container/10">
          <p className="text-label-sm uppercase tracking-wider text-primary">{preview.total}</p>
          <p className="text-headline-lg text-on-surface tabular-nums">
            {esImporteValido(honorarios) ? formatearMonto(Number(honorarios)) : preview.pending}
          </p>
          {conceptos.length > 0 && (
            <ul className="mt-2 space-y-1">
              {conceptos.map((c, indice) => (
                <li key={indice} className="flex justify-between gap-3 text-body-sm text-on-surface-variant">
                  <span className="truncate">{c.concepto || '—'}</span>
                  <span className="tabular-nums">{esImporteValido(c.importe) ? formatearMonto(Number(c.importe)) : '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-body-sm">
          <div>
            <dt className="text-secondary">{preview.validUntil}</dt>
            <dd className="text-on-surface font-medium">{fechaVigencia ? formatearFechaCorta(fechaVigencia) : preview.pending}</dd>
          </div>
          <div>
            <dt className="text-secondary">{preview.estimatedTime}</dt>
            <dd className="text-on-surface font-medium">{tiempoEstimado.trim() || preview.pending}</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
