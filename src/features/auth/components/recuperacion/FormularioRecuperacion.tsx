import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { recuperarContrasenaContent } from '../../content/recuperar-contrasena.content'
import { useSolicitarRecuperacion } from '../../hooks/useRecuperacion'
import { mensajePorTipo } from '../../lib/mapear-error'
import { recuperacionSchema, type RecuperacionFormValues } from '../../schemas/recuperacion.schema'
import type { EstadoCodigoRecuperacion } from '../../types/estado-navegacion.types'
import { CampoTexto } from '../CampoTexto'
import { AlertaError } from '../compartidos/AlertaError'

/** A2B: pide el correo y siempre continúa a A2C, sin revelar si la cuenta existe. */
export function FormularioRecuperacion() {
  const navigate = useNavigate()
  const { form, errors: mensajes } = recuperarContrasenaContent
  const { mutate: solicitar, isPending, error } = useSolicitarRecuperacion()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecuperacionFormValues>({
    resolver: zodResolver(recuperacionSchema),
    defaultValues: { correo: '' },
  })

  const onSubmit = ({ correo }: RecuperacionFormValues) => {
    const correoNormalizado = correo.toLowerCase()
    solicitar(
      { correo: correoNormalizado },
      {
        onSuccess: (respuesta) => {
          reset()
          const estado: EstadoCodigoRecuperacion = {
            correo: correoNormalizado,
            correoEnmascarado: respuesta.correoEnmascarado,
            reenviarEnSegundos: respuesta.reenviarEnSegundos,
            expiraEnSegundos: respuesta.expiraEnSegundos,
          }
          navigate(ROUTES.recoveryCode, { state: estado })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <CampoTexto
        id="recuperacion-correo"
        label={form.emailLabel}
        icon="alternate_email"
        type="email"
        autoComplete="email"
        autoFocus
        placeholder={form.emailPlaceholder}
        error={errors.correo?.message}
        {...register('correo')}
      />

      {error && <AlertaError>{mensajePorTipo(error.tipo, mensajes)}</AlertaError>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 bg-primary-container hover:bg-primary hover:shadow-lg hover:shadow-primary-container/20 text-on-primary text-label-lg font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {isPending ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{form.submittingButton}</span>
          </>
        ) : (
          <>
            <span>{form.submitButton}</span>
            <Icon name="arrow_forward" size={20} />
          </>
        )}
      </button>
    </form>
  )
}
