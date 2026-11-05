import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import { cuentaDepositoContent } from '../content/configuracion.content'
import { useGuardarCuentaDeposito } from '../hooks/useConfiguracion'
import { BANCOS, formatearClabe, validarClabe } from '../lib/clabe'
import { cuentaDepositoSchema, type CuentaDepositoFormValues } from '../schemas/configuracion.schema'
import type { EstadoCuentaGuardada } from '../types/configuracion.types'

interface FormularioCuentaDepositoProps {
  titularSugerido: string
  onCancelar: () => void
}

/** J1A: titular, banco, CLABE, tipo de cuenta, país y moneda. Guardar → J1. */
export function FormularioCuentaDeposito({ titularSugerido, onCancelar }: FormularioCuentaDepositoProps) {
  const { form, types, countries, currencies, errors: mensajes } = cuentaDepositoContent
  const navigate = useNavigate()
  const guardar = useGuardarCuentaDeposito()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CuentaDepositoFormValues>({
    resolver: zodResolver(cuentaDepositoSchema),
    defaultValues: { titular: titularSugerido, clabe: '', banco: '', tipoCuenta: 'cheques', pais: 'MX', moneda: 'MXN' },
  })
  const clabe = useWatch({ control, name: 'clabe' })
  const valida = clabe.length === 18 && validarClabe(clabe).problema === null

  const enviar = handleSubmit((v) => {
    guardar.mutate(
      { titular: v.titular.trim(), banco: v.banco, clabe: v.clabe, tipoCuenta: v.tipoCuenta, pais: v.pais, moneda: v.moneda },
      {
        onSuccess: () => {
          const estado: EstadoCuentaGuardada = { cuentaGuardada: true }
          navigate(`${ROUTES.settings}#cuenta-deposito`, { state: estado })
        },
      },
    )
  })

  const registroClabe = register('clabe', {
    // Solo dígitos; el banco se detecta con los primeros 3.
    setValueAs: (valor: string) => valor.replace(/\D/g, ''),
    onChange: (evento) => {
      const digitos = String(evento.target.value).replace(/\D/g, '')
      const banco = BANCOS.find((b) => b.clave === digitos.slice(0, 3))
      if (banco) setValue('banco', banco.clave, { shouldValidate: digitos.length === 18 })
    },
  })

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <div className="space-y-1">
        <CampoTexto id="cuenta-titular" label={form.holder} icon="person" maxLength={120} autoComplete="name" error={errors.titular?.message} {...register('titular')} />
        <p className="text-[11px] text-secondary">{form.holderHint}</p>
      </div>
      <div className="space-y-1">
        <CampoTexto
          id="cuenta-clabe"
          label={form.clabe}
          icon="pin"
          inputMode="numeric"
          autoComplete="off"
          maxLength={22}
          placeholder={form.clabePlaceholder}
          className="tabular-nums tracking-wider"
          error={errors.clabe?.message}
          {...registroClabe}
        />
        <p className="flex items-center gap-1.5 text-[11px] text-secondary">
          {valida && <Icon name="check_circle" size={14} className="text-primary" />}
          {valida ? formatearClabe(clabe) : `${clabe.length} / 18`} · {form.clabeNote}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CampoSelect
          id="cuenta-banco"
          label={form.bank}
          icon="account_balance"
          opciones={BANCOS.map((b) => ({ valor: b.clave, etiqueta: `${b.nombre} (${b.clave})` }))}
          placeholder={form.bankPlaceholder}
          error={errors.banco?.message}
          {...register('banco')}
        />
        <CampoSelect
          id="cuenta-tipo"
          label={form.type}
          icon="credit_score"
          opciones={Object.entries(types).map(([valor, etiqueta]) => ({ valor, etiqueta }))}
          placeholder={form.type}
          error={errors.tipoCuenta?.message}
          {...register('tipoCuenta')}
        />
        <CampoSelect id="cuenta-pais" label={form.country} icon="public" opciones={Object.entries(countries).map(([valor, etiqueta]) => ({ valor, etiqueta }))} placeholder={form.country} {...register('pais')} />
        <CampoSelect id="cuenta-moneda" label={form.currency} icon="currency_exchange" opciones={Object.entries(currencies).map(([valor, etiqueta]) => ({ valor, etiqueta }))} placeholder={form.currency} {...register('moneda')} />
      </div>
      <p className="text-body-sm text-secondary">{form.onlyMexico}</p>
      <p className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-low text-body-sm text-on-surface-variant">
        <Icon name="info" size={18} className="shrink-0 mt-0.5 text-secondary" />
        {form.verifyNote}
      </p>
      {guardar.isError && <EstadoError mensaje={guardar.error.tipo === 'datos_invalidos' ? mensajes.datos_invalidos : MENSAJES_ERROR_API[guardar.error.tipo]} />}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button type="button" onClick={onCancelar} className="h-11 px-5 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer">
          {form.cancel}
        </button>
        <button
          type="submit"
          disabled={guardar.isPending}
          className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold disabled:opacity-60 cursor-pointer"
        >
          <Icon name="save" size={18} />
          {guardar.isPending ? form.saving : form.save}
        </button>
      </div>
    </form>
  )
}
