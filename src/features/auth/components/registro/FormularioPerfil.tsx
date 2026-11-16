import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { perfilProfesionalContent } from '../../content/perfil-profesional.content'
import { useRegistrarAbogado } from '../../hooks/useRegistrarAbogado'
import {
  guardarPasoRegistro,
  leerBorradorRegistro,
  limpiarBorradorRegistro,
  recordarCredencialesPendientes,
} from '../../lib/borrador-registro'
import { enmascararCorreo, TIEMPOS_CODIGO } from '../../lib/codigo-correo'
import type { CredencialesFormValues } from '../../schemas/credenciales.schema'
import {
  LIMITE_BIOGRAFIA,
  LIMITE_DIRECCION,
  perfilProfesionalSchema,
  type PerfilProfesionalFormValues,
} from '../../schemas/perfil-profesional.schema'
import type { RegistroFormValues } from '../../schemas/registro.schema'
import type { ErrorAutenticacion } from '../../types/auth.types'
import type { EstadoVerificacionCorreo } from '../../types/estado-navegacion.types'
import type { DatosRegistroAbogado } from '../../types/registro.types'
import { CampoTexto } from '../CampoTexto'
import { AlertaError } from '../compartidos/AlertaError'
import { CampoAreaTexto } from '../compartidos/CampoAreaTexto'
import { MensajeError } from '../compartidos/MensajeError'
import { AccionesRegistro } from './AccionesRegistro'

const VALORES_INICIALES: PerfilProfesionalFormValues = {
  biografia: '',
  direccionOficina: '',
  tarifaHora: '',
}

/** Une A3 + A4 + A5 en el cuerpo de `POST /Registro/abogado`. */
function aDatosRegistro(
  basicos: RegistroFormValues,
  credenciales: CredencialesFormValues,
  perfil: PerfilProfesionalFormValues,
): DatosRegistroAbogado {
  return {
    primerNombre: basicos.primerNombre,
    segundoNombre: basicos.segundoNombre === '' ? null : basicos.segundoNombre,
    apellidoPaterno: basicos.apellidoPaterno,
    apellidoMaterno: basicos.apellidoMaterno,
    correo: basicos.correo,
    telefono: basicos.telefono === '' ? null : basicos.telefono,
    contrasena: basicos.contrasena,
    cedulaProfesional: credenciales.numeroCedula,
    // El schema de A4 garantiza que hay archivo antes de llegar aquí.
    archivoCedula: credenciales.archivoCedula as File,
    experienciaAnios: Number(credenciales.aniosExperiencia),
    especialidadesIds: credenciales.especialidades.map(Number),
    bio: perfil.biografia,
    direccionOficina: perfil.direccionOficina === '' ? null : perfil.direccionOficina,
    tarifaPorHoraCentavos: perfil.tarifaHora === '' ? null : Math.round(Number(perfil.tarifaHora) * 100),
  }
}

/** 409 del backend: "Ya existe un usuario con ese email." o "…con esa cédula profesional." */
function pasoACorregir(error: ErrorAutenticacion): { to: string; label: string } | undefined {
  if (error.tipo !== 'conflicto') return undefined
  const texto = error.mensajeServidor?.toLowerCase() ?? ''
  const { conflictLinks } = perfilProfesionalContent.errors
  if (texto.includes('cédula') || texto.includes('cedula')) return { to: ROUTES.registerCredentials, label: conflictLinks.credenciales }
  return { to: ROUTES.register, label: conflictLinks.datosBasicos }
}

interface FormularioPerfilProps {
  datosBasicos: RegistroFormValues
  credenciales: CredencialesFormValues
}

/** A5: perfil profesional. "Crear mi cuenta" → POST /Registro/abogado + /Verificacion/enviar → A3A. */
export function FormularioPerfil({ datosBasicos, credenciales }: FormularioPerfilProps) {
  const navigate = useNavigate()
  const { form, actions, errors: mensajes } = perfilProfesionalContent
  const { mutate: registrar, isPending, error } = useRegistrarAbogado()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<PerfilProfesionalFormValues>({
    resolver: zodResolver(perfilProfesionalSchema),
    defaultValues: leerBorradorRegistro().perfil ?? VALORES_INICIALES,
  })
  const biografia = useWatch({ control, name: 'biografia' })

  const onSubmit = (valores: PerfilProfesionalFormValues) => {
    guardarPasoRegistro('perfil', valores)
    registrar(aDatosRegistro(datosBasicos, credenciales, valores), {
      onSuccess: ({ codigoEnviado }) => {
        const { correo, contrasena } = datosBasicos
        recordarCredencialesPendientes(correo, contrasena)
        limpiarBorradorRegistro()
        const estado: EstadoVerificacionCorreo = {
          correo,
          correoEnmascarado: enmascararCorreo(correo),
          ...TIEMPOS_CODIGO,
          // Si el correo no salió, A3A permite pedir el código de inmediato.
          reenviarEnSegundos: codigoEnviado ? TIEMPOS_CODIGO.reenviarEnSegundos : 0,
        }
        // `replace`: la cuenta ya existe; no tiene sentido volver al formulario.
        navigate(ROUTES.verifyEmail, { replace: true, state: estado })
      },
    })
  }

  const enlaceConflicto = error ? pasoACorregir(error) : undefined

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <CampoAreaTexto
        id="perfil-biografia"
        label={form.bioLabel}
        icon="badge"
        rows={4}
        maxLength={LIMITE_BIOGRAFIA}
        longitud={biografia.length}
        placeholder={form.bioPlaceholder}
        error={errors.biografia?.message}
        {...register('biografia')}
      />

      <CampoTexto
        id="perfil-direccion"
        label={form.officeLabel}
        labelHint={form.optional}
        icon="location_on"
        autoComplete="street-address"
        maxLength={LIMITE_DIRECCION}
        placeholder={form.officePlaceholder}
        error={errors.direccionOficina?.message}
        {...register('direccionOficina')}
      />

      <fieldset className="space-y-3">
        <legend className="flex items-center gap-2 text-label-md text-on-surface font-medium">
          <Icon name="payments" size={18} className="text-secondary" />
          {form.feesLabel}
        </legend>
        <p className="text-body-sm text-secondary">{form.feesNote}</p>
        <CampoTexto
          id="perfil-hora"
          label={form.hourlyFeeLabel}
          labelHint={form.optional}
          icon="schedule"
          inputMode="decimal"
          error={errors.tarifaHora?.message}
          {...register('tarifaHora')}
        />
      </fieldset>

      {error && (
        <AlertaError>
          {error.tipo === 'conflicto' && error.mensajeServidor ? (
            <>
              {error.mensajeServidor}{' '}
              {enlaceConflicto && (
                <button
                  type="button"
                  onClick={() => {
                    guardarPasoRegistro('perfil', getValues())
                    navigate(enlaceConflicto.to)
                  }}
                  className="font-semibold underline hover:opacity-80 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {enlaceConflicto.label}
                </button>
              )}
            </>
          ) : (
            <MensajeError tipo={error.tipo} mensajes={mensajes} />
          )}
        </AlertaError>
      )}

      <AccionesRegistro
        anterior={{ to: ROUTES.registerCredentials, label: actions.previous }}
        textoSiguiente={actions.next}
        textoCargando={actions.saving}
        iconoSiguiente="check_circle"
        cargando={isPending}
      />
    </form>
  )
}
