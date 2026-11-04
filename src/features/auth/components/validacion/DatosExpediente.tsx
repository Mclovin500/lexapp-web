import { etiquetaDe, especialidades } from '../../content/catalogos.content'
import {
  formatearFechaEnvio,
  validacionProfesionalContent,
} from '../../content/validacion-profesional.content'
import type { RespuestaValidacion } from '../../types/validacion-profesional.types'

interface DatosExpedienteProps {
  validacion: RespuestaValidacion
}

/** Datos enviados a revisión, tal como los devuelve el backend. */
export function DatosExpediente({ validacion }: DatosExpedienteProps) {
  const { details, states } = validacionProfesionalContent

  const filas = [
    { etiqueta: details.name, valor: validacion.nombreCompleto },
    { etiqueta: details.cedula, valor: validacion.cedulaEnmascarada },
    { etiqueta: details.specialty, valor: etiquetaDe(especialidades, validacion.especialidad) },
    { etiqueta: details.status, valor: states[validacion.estado].badge },
    { etiqueta: details.submittedAt, valor: formatearFechaEnvio(validacion.fechaEnvio) },
    { etiqueta: details.folio, valor: validacion.folio },
  ]

  return (
    <section aria-labelledby="datos-expediente-titulo" className="rounded-xl bg-surface-container-low p-6">
      <h2 id="datos-expediente-titulo" className="text-headline-sm text-on-surface mb-4">
        {details.title}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {filas.map((fila) => (
          <div key={fila.etiqueta} className="min-w-0">
            <dt className="text-label-sm uppercase tracking-wider text-secondary">{fila.etiqueta}</dt>
            <dd className="mt-0.5 text-body-md text-on-surface font-medium break-words">{fila.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
