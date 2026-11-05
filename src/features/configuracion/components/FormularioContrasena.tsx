import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { CampoContrasena } from '@/features/auth/components/CampoContrasena'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { IndicadorContrasena } from '@/features/auth/components/IndicadorContrasena'
import { configuracionContent } from '../content/configuracion.content'
import { useCambiarContrasena } from '../hooks/useConfiguracion'
import { contrasenaFormSchema, type ContrasenaFormValues } from '../schemas/configuracion.schema'
import { AvisoGuardado, botonPrimario } from './SeccionConfiguracion'

/** "Seguridad" y "Contraseña" de J1. Usa las mismas reglas de contraseña que A3 y A2D. */
export function SeguridadSeccion() {
  const { security: textos } = configuracionContent
  const cambiar = useCambiarContrasena()
  const [guardado, setGuardado] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContrasenaFormValues>({ resolver: zodResolver(contrasenaFormSchema), defaultValues: { actual: '', nueva: '', confirmar: '' } })
  const nueva = useWatch({ control, name: 'nueva' })

  const enviar = handleSubmit((v) => {
    setGuardado(false)
    cambiar.mutate(
      { contrasenaActual: v.actual, contrasenaNueva: v.nueva },
      {
        onSuccess: () => {
          reset()
          setGuardado(true)
        },
      },
    )
  })

  const error = cambiar.error
    ? cambiar.error.tipo === 'datos_invalidos'
      ? textos.wrongCurrent
      : cambiar.error.tipo === 'conflicto'
        ? textos.sameAsCurrent
        : MENSAJES_ERROR_API[cambiar.error.tipo]
    : null

  const campo = (id: string, etiqueta: string, nombre: keyof ContrasenaFormValues, autoComplete: string) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-label-md text-on-surface font-medium">
        {etiqueta}
      </label>
      <CampoContrasena
        id={id}
        variante="relleno"
        autoComplete={autoComplete}
        placeholder=""
        error={errors[nombre]?.message}
        describedBy={errors[nombre] ? `${id}-error` : undefined}
        {...register(nombre)}
      />
      {errors[nombre]?.message && <MensajeCampo id={`${id}-error`} mensaje={errors[nombre].message} />}
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low">
        <Icon name="phonelink_lock" size={22} className="text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-label-lg text-on-surface font-semibold">{textos.twoStep}</p>
          <p className="text-body-sm text-secondary">{textos.twoStepDetail}</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-primary-container/15 text-primary text-label-sm font-semibold">{textos.twoStepOn}</span>
      </div>
      <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
        {campo('config-actual', textos.current, 'actual', 'current-password')}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campo('config-nueva', textos.new, 'nueva', 'new-password')}
          {campo('config-confirmar', textos.confirm, 'confirmar', 'new-password')}
        </div>
        <IndicadorContrasena contrasena={nueva} variante="compacto" />
        {error && <EstadoError mensaje={error} />}
        {guardado && <AvisoGuardado texto={textos.saved} />}
        <button type="submit" disabled={cambiar.isPending} className={botonPrimario}>
          {cambiar.isPending ? textos.saving : textos.save}
        </button>
      </form>
    </div>
  )
}
