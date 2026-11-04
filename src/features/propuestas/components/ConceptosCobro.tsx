import { useFieldArray, useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Icon } from '@/components/ui/Icon'
import { esImporteValido, sumarImportes } from '@/lib/importes'
import { formatearMonto } from '@/lib/moneda'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { nuevaPropuestaContent } from '../content/nueva-propuesta.content'
import { MAX_CONCEPTOS, type PropuestaFormValues } from '../schemas/propuesta.schema'

interface ConceptosCobroProps {
  control: Control<PropuestaFormValues>
  register: UseFormRegister<PropuestaFormValues>
  errors: FieldErrors<PropuestaFormValues>
}

const campo =
  'w-full h-11 px-3 rounded-lg bg-surface-container-low text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container'

/** "Conceptos de cobro, cuando corresponda": lista editable con su suma. */
export function ConceptosCobro({ control, register, errors }: ConceptosCobroProps) {
  const { form } = nuevaPropuestaContent
  const { fields, append, remove } = useFieldArray({ control, name: 'conceptos' })
  const conceptos = useWatch({ control, name: 'conceptos' })
  const suma = sumarImportes(conceptos.filter((c) => esImporteValido(c.importe)).map((c) => Number(c.importe)))
  const errorLista = errors.conceptos?.root?.message ?? errors.conceptos?.message

  return (
    <div className="space-y-3">
      <div>
        <p className="text-label-md text-on-surface font-medium">
          {form.concepts} <span className="text-secondary font-normal">{form.optional}</span>
        </p>
        <p className="text-body-sm text-secondary">{form.conceptsHint}</p>
      </div>

      {fields.length > 0 && (
        <ul className="space-y-3">
          {fields.map((field, indice) => {
            const error = errors.conceptos?.[indice]
            return (
              <li key={field.id} className="grid grid-cols-1 sm:grid-cols-[1fr_10rem_auto] gap-2 items-start">
                <div>
                  <label htmlFor={`concepto-${indice}`} className="sr-only">
                    {form.conceptName} {indice + 1}
                  </label>
                  <input
                    id={`concepto-${indice}`}
                    placeholder={form.conceptNamePlaceholder}
                    aria-invalid={Boolean(error?.concepto)}
                    className={campo}
                    {...register(`conceptos.${indice}.concepto`)}
                  />
                  {error?.concepto?.message && <MensajeCampo id={`concepto-${indice}-error`} mensaje={error.concepto.message} />}
                </div>
                <div>
                  <label htmlFor={`concepto-importe-${indice}`} className="sr-only">
                    {form.conceptAmount} {indice + 1}
                  </label>
                  <input
                    id={`concepto-importe-${indice}`}
                    inputMode="decimal"
                    placeholder="0.00"
                    aria-invalid={Boolean(error?.importe)}
                    className={`${campo} text-right tabular-nums`}
                    {...register(`conceptos.${indice}.importe`)}
                  />
                  {error?.importe?.message && <MensajeCampo id={`concepto-importe-${indice}-error`} mensaje={error.importe.message} />}
                </div>
                <button
                  type="button"
                  onClick={() => remove(indice)}
                  aria-label={form.removeConcept(indice + 1)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-secondary hover:bg-error-container/50 hover:text-error cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon name="delete" size={20} />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => append({ concepto: '', importe: '' })}
          disabled={fields.length >= MAX_CONCEPTOS}
          className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg text-label-md text-primary font-semibold hover:bg-primary-container/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="add" size={18} />
          {form.addConcept}
        </button>
        {fields.length > 0 && (
          <p className="text-body-sm text-secondary" aria-live="polite">
            {form.conceptsTotal}: <strong className="text-on-surface tabular-nums">{formatearMonto(suma)}</strong>
          </p>
        )}
      </div>
      {errorLista && <MensajeCampo id="conceptos-error" mensaje={errorLista} />}
    </div>
  )
}
