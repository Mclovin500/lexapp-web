import { generatePath, Link, useSearchParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { hoyIso } from '@/lib/fechas'
import { useOpcionesClientes } from '@/features/clientes/hooks/useOpcionesClientes'
import { FormularioCobro } from '../components/FormularioCobro'
import { cobroContent } from '../content/cobro.content'

const ID_VALIDO = /^[\w-]{1,40}$/

/**
 * D4: crear cobro adicional. Desde D3, o desde un expediente (E2) con
 * `?cliente=&expediente=` para precargarlos. El cliente paga desde la app móvil.
 */
export function NuevoCobroPage() {
  const contenido = cobroContent
  const [parametros] = useSearchParams()
  const clientes = useOpcionesClientes()

  const clienteParam = parametros.get('cliente') ?? ''
  const expedienteParam = parametros.get('expediente') ?? ''
  const clienteId = ID_VALIDO.test(clienteParam) ? clienteParam : ''
  const expedienteId = clienteId && ID_VALIDO.test(expedienteParam) ? expedienteParam : ''
  const desdeExpediente = expedienteId !== ''
  const rutaVolver = desdeExpediente ? generatePath(ROUTES.caseDetail, { expedienteId }) : ROUTES.fees

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={rutaVolver}
        className="inline-flex items-center gap-1.5 self-start text-label-md text-secondary hover:text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="arrow_back" size={18} />
        {desdeExpediente ? contenido.backToCase : contenido.backToFees}
      </Link>
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>
      <p className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low text-body-sm text-secondary">
        <Icon name="smartphone" size={18} className="shrink-0 mt-0.5" />
        {contenido.notice}
      </p>

      {clientes.isPending && <EstadoCarga texto={contenido.loading} />}
      {clientes.isError && <EstadoError mensaje={MENSAJES_ERROR_API[clientes.error.tipo]} onReintentar={() => void clientes.refetch()} />}
      {clientes.data && (
        <FormularioCobro
          clientes={clientes.data}
          rutaCancelar={rutaVolver}
          valoresIniciales={{
            clienteId: clientes.data.some((c) => c.id === clienteId) ? clienteId : '',
            expedienteId: clientes.data.some((c) => c.id === clienteId) ? expedienteId : '',
            concepto: '',
            descripcion: '',
            importe: '',
            fechaEmision: hoyIso(),
            fechaLimite: '',
          }}
        />
      )}
    </div>
  )
}
