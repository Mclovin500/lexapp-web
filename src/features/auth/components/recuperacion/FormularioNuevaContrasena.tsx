import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { nuevaContrasenaContent } from '../../content/nueva-contrasena.content'
import { useGuardarNuevaContrasena } from '../../hooks/useRecuperacion'
import { mensajePorTipo } from '../../lib/mapear-error'
import {
  nuevaContrasenaSchema,
  type NuevaContrasenaFormValues,
} from '../../schemas/contrasena.schema'
import type { EstadoContrasenaActualizada } from '../../types/estado-navegacion.types'
import { CampoContrasena } from '../CampoContrasena'
import { MensajeCampo } from '../CampoTexto'
import { AlertaError } from '../compartidos/AlertaError'
import { IndicadorContrasena } from '../IndicadorContrasena'

interface FormularioNuevaContrasenaProps {
  tokenRestablecimiento: string
}

/** A2D: nueva contraseña + confirmación, con el indicador de requisitos compartido. */
export function FormularioNuevaContrasena({ tokenRestablecimiento }: FormularioNuevaContrasenaProps) {
  const navigate = useNavigate()
  const { form, criteria, errors: mensajes } = nuevaContrasenaContent
  const { mutate: guardar, isPending, error } = useGuardarNuevaContrasena()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NuevaContrasenaFormValues>({
    resolver: zodResolver(nuevaContrasenaSchema),
    defaultValues: { contrasena: '', confirmarContrasena: '' },
  })

  const [contrasena, confirmacion] = useWatch({
    control,
    name: ['contrasena', 'confirmarContrasena'],
  })
  const coincide = confirmacion.length > 0 && contrasena === confirmacion
  const tokenInvalido = error?.tipo === 'sesion_expirada' || error?.tipo === 'codigo_vencido'

  const onSubmit = ({ contrasena: nueva }: NuevaContrasenaFormValues) => {
    guardar(
      { tokenRestablecimiento, contrasena: nueva },
      {
        onSuccess: () => {
          reset()
          // Se reemplaza la entrada del historial para descartar el token.
          const estado: EstadoContrasenaActualizada = { contrasenaActualizada: true }
          navigate(ROUTES.newPassword, { replace: true, state: estado })
        },
      },
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="lg:col-span-7 flex flex-col gap-6">
        <div className="space-y-1.5">
          <label htmlFor="nueva-contrasena" className="block text-label-md text-on-surface font-medium">
            {form.passwordLabel}
          </label>
          <CampoContrasena
            id="nueva-contrasena"
            variante="relleno"
            autoComplete="new-password"
            autoFocus
            placeholder={form.passwordPlaceholder}
            error={errors.contrasena?.message}
            describedBy={
              errors.contrasena ? 'nueva-contrasena-error nueva-requisitos' : 'nueva-requisitos'
            }
            {...register('contrasena')}
          />
          {errors.contrasena?.message && (
            <MensajeCampo id="nueva-contrasena-error" mensaje={errors.contrasena.message} />
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="nueva-confirmar" className="block text-label-md text-on-surface font-medium">
              {form.confirmLabel}
            </label>
            <span
              aria-live="polite"
              className={`text-label-sm flex items-center gap-1 ${
                !confirmacion ? 'text-outline' : coincide ? 'text-primary font-semibold' : 'text-error font-semibold'
              }`}
            >
              <Icon name={!confirmacion ? 'info' : coincide ? 'check_circle' : 'cancel'} size={14} />
              {!confirmacion ? form.matchPending : coincide ? form.matchOk : form.matchError}
            </span>
          </div>
          <CampoContrasena
            id="nueva-confirmar"
            icon="lock_reset"
            variante="relleno"
            autoComplete="new-password"
            placeholder={form.confirmPlaceholder}
            error={errors.confirmarContrasena?.message}
            describedBy={errors.confirmarContrasena ? 'nueva-confirmar-error' : undefined}
            {...register('confirmarContrasena')}
          />
          {errors.confirmarContrasena?.message && (
            <MensajeCampo id="nueva-confirmar-error" mensaje={errors.confirmarContrasena.message} />
          )}
        </div>

        {error && (
          <AlertaError>
            {tokenInvalido ? (
              <>
                {mensajes.tokenInvalid}{' '}
                <Link
                  to={ROUTES.recoverPassword}
                  replace
                  className="font-semibold underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {mensajes.tokenInvalidLink}
                </Link>
              </>
            ) : (
              mensajePorTipo(error.tipo, mensajes)
            )}
          </AlertaError>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isPending || tokenInvalido}
            className="w-full h-12 bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          <p className="text-label-sm text-secondary text-center">{form.revocationNote}</p>
        </div>
      </form>

      {/* Criterios de seguridad */}
      <aside className="lg:col-span-5 bg-surface-container-low/70 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-on-surface">
          <Icon name="shield" size={20} className="text-primary" />
          <h2 className="text-headline-sm">{criteria.title}</h2>
        </div>
        <p className="text-body-sm text-on-surface-variant">{criteria.description}</p>
        <IndicadorContrasena id="nueva-requisitos" contrasena={contrasena} variante="lista" />
        <div className="mt-2 p-3 rounded-lg bg-surface-container-lowest flex items-start gap-3">
          <Icon name="enhanced_encryption" size={20} className="text-primary shrink-0" />
          <div>
            <p className="text-label-md text-on-surface font-semibold">{criteria.encryption.title}</p>
            <p className="text-body-sm text-secondary">{criteria.encryption.detail}</p>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-label-sm text-secondary">
          <Icon name="verified_user" size={16} className="text-primary" />
          {criteria.compliance}
        </p>
      </aside>
    </div>
  )
}
