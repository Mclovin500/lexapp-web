import type { ReactNode } from 'react'
import { Controller, useFieldArray, useForm, useWatch, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import { SelectorEtiquetas } from '@/features/auth/components/registro/SelectorEtiquetas'
import { areasPractica, disponibilidades, especializaciones } from '@/features/auth/content/catalogos.content'
import { LIMITE_DESCRIPCION, MAX_AREAS, MAX_ELEMENTOS_LISTA, MAX_ESPECIALIDADES, perfilContent } from '../content/perfil.content'
import { useGuardarPerfil } from '../hooks/usePerfil'
import { perfilSchema, type PerfilFormValues } from '../schemas/perfil.schema'
import type { PerfilAbogado, PeticionPerfil } from '../types/perfil.types'

function aFormulario(p: PerfilAbogado): PerfilFormValues {
  return {
    aniosExperiencia: String(p.aniosExperiencia),
    descripcion: p.descripcion,
    areasPractica: p.areasPractica,
    especialidades: p.especialidades,
    formacion: p.formacion.map((f) => ({ ...f, anioInicio: String(f.anioInicio), anioFin: f.anioFin === null ? '' : String(f.anioFin) })),
    experiencia: p.experiencia.map((e) => ({ ...e, anioInicio: String(e.anioInicio), anioFin: e.anioFin === null ? '' : String(e.anioFin) })),
    servicios: p.servicios,
    consultaInicial: String(p.honorarios.consultaInicial),
    tarifaHora: p.honorarios.tarifaHora === null ? '' : String(p.honorarios.tarifaHora),
    notaHonorarios: p.honorarios.nota,
    aceptaNuevosCasos: p.disponibilidad.aceptaNuevosCasos,
    modalidad: p.disponibilidad.modalidad,
  }
}

function aPeticion(v: PerfilFormValues): PeticionPerfil {
  const anioFin = (valor: string) => (valor === '' ? null : Number(valor))
  return {
    aniosExperiencia: Number(v.aniosExperiencia),
    descripcion: v.descripcion.trim(),
    areasPractica: v.areasPractica,
    especialidades: v.especialidades,
    formacion: v.formacion.map((f) => ({ id: f.id, titulo: f.titulo.trim(), institucion: f.institucion.trim(), anioInicio: Number(f.anioInicio), anioFin: anioFin(f.anioFin) })),
    experiencia: v.experiencia.map((e) => ({
      id: e.id, cargo: e.cargo.trim(), organizacion: e.organizacion.trim(), anioInicio: Number(e.anioInicio), anioFin: anioFin(e.anioFin), descripcion: e.descripcion.trim(),
    })),
    servicios: v.servicios.map((s) => ({ id: s.id, nombre: s.nombre.trim(), descripcion: s.descripcion.trim() })),
    honorarios: { consultaInicial: Number(v.consultaInicial), tarifaHora: v.tarifaHora === '' ? null : Number(v.tarifaHora), nota: v.notaHonorarios.trim() },
    disponibilidad: { aceptaNuevosCasos: v.aceptaNuevosCasos, modalidad: v.modalidad },
  }
}

/** Id temporal para elementos nuevos; el backend asigna el definitivo. */
const nuevoId = () => `nuevo-${Math.random().toString(36).slice(2, 10)}`

function Seccion({ titulo, children, accion }: { titulo: string; children: ReactNode; accion?: ReactNode }) {
  return (
    <section className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-headline-sm text-on-surface">{titulo}</h2>
        {accion}
      </div>
      {children}
    </section>
  )
}

function BotonAgregar({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg bg-primary-container/10 text-primary text-label-md font-semibold hover:bg-primary-container/20 disabled:opacity-50 cursor-pointer"
    >
      <Icon name="add" size={18} />
      {perfilContent.form.add}
    </button>
  )
}

function BotonQuitar({ onClick, etiqueta }: { onClick: () => void; etiqueta: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${perfilContent.form.remove}: ${etiqueta}`}
      className="self-end sm:self-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-error hover:bg-error/10 cursor-pointer"
    >
      <Icon name="delete" size={18} />
    </button>
  )
}

function Periodo({ prefijo, register, errores }: { prefijo: `formacion.${number}` | `experiencia.${number}`; register: UseFormRegister<PerfilFormValues>; errores?: { anioInicio?: { message?: string }; anioFin?: { message?: string } } }) {
  const { form } = perfilContent
  return (
    <div className="grid grid-cols-2 gap-3">
      <CampoTexto id={`${prefijo}-inicio`} label={form.from} icon="event" inputMode="numeric" maxLength={4} error={errores?.anioInicio?.message} {...register(`${prefijo}.anioInicio`)} />
      <CampoTexto id={`${prefijo}-fin`} label={form.to} labelHint={form.toHint} icon="event_available" inputMode="numeric" maxLength={4} error={errores?.anioFin?.message} {...register(`${prefijo}.anioFin`)} />
    </div>
  )
}

interface FormularioPerfilProps {
  perfil: PerfilAbogado
  onCancelar: () => void
  onGuardado: () => void
}

/** I1 "Editar información dentro del mismo módulo". */
export function FormularioPerfil({ perfil, onCancelar, onGuardado }: FormularioPerfilProps) {
  const { form, sections, errors: mensajes } = perfilContent
  const guardar = useGuardarPerfil()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PerfilFormValues>({ resolver: zodResolver(perfilSchema), defaultValues: aFormulario(perfil) })
  const formacion = useFieldArray({ control, name: 'formacion' })
  const experiencia = useFieldArray({ control, name: 'experiencia' })
  const servicios = useFieldArray({ control, name: 'servicios' })
  const descripcion = useWatch({ control, name: 'descripcion' })
  const errores = errors

  const enviar = handleSubmit((valores) => guardar.mutate(aPeticion(valores), { onSuccess: onGuardado }))
  const error = guardar.error ? (guardar.error.tipo === 'datos_invalidos' ? mensajes.datos_invalidos : MENSAJES_ERROR_API[guardar.error.tipo]) : null

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
      <Seccion titulo={sections.description}>
        <div className="sm:max-w-xs">
          <CampoTexto id="perfil-anios" label={form.years} icon="workspace_premium" inputMode="numeric" maxLength={2} error={errores.aniosExperiencia?.message} {...register('aniosExperiencia')} />
        </div>
        <CampoAreaTexto
          id="perfil-descripcion"
          label={form.description}
          icon="description"
          rows={5}
          maxLength={LIMITE_DESCRIPCION}
          longitud={descripcion.length}
          placeholder={form.descriptionPlaceholder}
          error={errores.descripcion?.message}
          {...register('descripcion')}
        />
      </Seccion>

      <Seccion titulo={`${sections.areas} y ${sections.specialties.toLowerCase()}`}>
        <Controller
          control={control}
          name="areasPractica"
          render={({ field }) => (
            <SelectorEtiquetas label={sections.areas} hint={form.areasHint} opciones={areasPractica} value={field.value} onChange={field.onChange} maximo={MAX_AREAS} error={errores.areasPractica?.message} />
          )}
        />
        <Controller
          control={control}
          name="especialidades"
          render={({ field }) => (
            <SelectorEtiquetas
              label={sections.specialties}
              hint={form.specialtiesHint}
              opciones={especializaciones}
              value={field.value}
              onChange={field.onChange}
              maximo={MAX_ESPECIALIDADES}
              error={errores.especialidades?.message}
            />
          )}
        />
      </Seccion>

      <Seccion
        titulo={sections.education}
        accion={<BotonAgregar disabled={formacion.fields.length >= MAX_ELEMENTOS_LISTA} onClick={() => formacion.append({ id: nuevoId(), titulo: '', institucion: '', anioInicio: '', anioFin: '' })} />}
      >
        {formacion.fields.map((campo, i) => (
          <div key={campo.id} className="p-4 rounded-lg bg-surface-container-low/60 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <CampoTexto id={`formacion-${i}-titulo`} label={form.degree} icon="school" maxLength={120} error={errores.formacion?.[i]?.titulo?.message} {...register(`formacion.${i}.titulo`)} />
                <CampoTexto id={`formacion-${i}-institucion`} label={form.institution} icon="account_balance" maxLength={120} error={errores.formacion?.[i]?.institucion?.message} {...register(`formacion.${i}.institucion`)} />
              </div>
              <BotonQuitar onClick={() => formacion.remove(i)} etiqueta={`${form.degree} ${i + 1}`} />
            </div>
            <Periodo prefijo={`formacion.${i}`} register={register} errores={errores.formacion?.[i]} />
          </div>
        ))}
      </Seccion>

      <Seccion
        titulo={sections.experience}
        accion={
          <BotonAgregar
            disabled={experiencia.fields.length >= MAX_ELEMENTOS_LISTA}
            onClick={() => experiencia.append({ id: nuevoId(), cargo: '', organizacion: '', anioInicio: '', anioFin: '', descripcion: '' })}
          />
        }
      >
        {experiencia.fields.map((campo, i) => (
          <div key={campo.id} className="p-4 rounded-lg bg-surface-container-low/60 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <CampoTexto id={`experiencia-${i}-cargo`} label={form.role} icon="badge" maxLength={100} error={errores.experiencia?.[i]?.cargo?.message} {...register(`experiencia.${i}.cargo`)} />
                <CampoTexto id={`experiencia-${i}-org`} label={form.organization} icon="apartment" maxLength={120} error={errores.experiencia?.[i]?.organizacion?.message} {...register(`experiencia.${i}.organizacion`)} />
              </div>
              <BotonQuitar onClick={() => experiencia.remove(i)} etiqueta={`${form.role} ${i + 1}`} />
            </div>
            <Periodo prefijo={`experiencia.${i}`} register={register} errores={errores.experiencia?.[i]} />
            <CampoTexto id={`experiencia-${i}-desc`} label={form.details} labelHint={form.optional} icon="notes" maxLength={300} error={errores.experiencia?.[i]?.descripcion?.message} {...register(`experiencia.${i}.descripcion`)} />
          </div>
        ))}
      </Seccion>

      <Seccion
        titulo={sections.services}
        accion={<BotonAgregar disabled={servicios.fields.length >= MAX_ELEMENTOS_LISTA} onClick={() => servicios.append({ id: nuevoId(), nombre: '', descripcion: '' })} />}
      >
        {servicios.fields.map((campo, i) => (
          <div key={campo.id} className="p-4 rounded-lg bg-surface-container-low/60 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <CampoTexto id={`servicio-${i}-nombre`} label={form.service} icon="gavel" maxLength={100} error={errores.servicios?.[i]?.nombre?.message} {...register(`servicios.${i}.nombre`)} />
              <CampoTexto id={`servicio-${i}-desc`} label={form.serviceDescription} labelHint={form.optional} icon="notes" maxLength={200} error={errores.servicios?.[i]?.descripcion?.message} {...register(`servicios.${i}.descripcion`)} />
            </div>
            <BotonQuitar onClick={() => servicios.remove(i)} etiqueta={`${form.service} ${i + 1}`} />
          </div>
        ))}
      </Seccion>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Seccion titulo={sections.fees}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CampoTexto id="perfil-consulta" label={form.initialFee} labelHint={form.initialFeeHint} icon="payments" inputMode="decimal" error={errores.consultaInicial?.message} {...register('consultaInicial')} />
            <CampoTexto id="perfil-hora" label={form.hourlyFee} labelHint={form.optional} icon="schedule" inputMode="decimal" error={errores.tarifaHora?.message} {...register('tarifaHora')} />
          </div>
          <CampoTexto id="perfil-nota-honorarios" label={form.feesNote} labelHint={form.optional} icon="notes" maxLength={300} error={errores.notaHonorarios?.message} {...register('notaHonorarios')} />
        </Seccion>
        <Seccion titulo={sections.availability}>
          <label className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" {...register('aceptaNuevosCasos')} />
            <span className="text-body-md text-on-surface">{form.accepting}</span>
          </label>
          <CampoSelect
            id="perfil-modalidad"
            label={form.modality}
            icon="event_available"
            opciones={disponibilidades}
            placeholder={form.modality}
            error={errores.modalidad?.message}
            {...register('modalidad')}
          />
        </Seccion>
      </div>

      {error && <EstadoError mensaje={error} />}
      <div className="sticky bottom-0 -mx-4 sm:mx-0 p-4 rounded-xl bg-surface/95 backdrop-blur flex flex-col-reverse sm:flex-row sm:justify-end gap-2 shadow-[0_-1px_8px_rgba(0,0,0,0.05)]">
        <button type="button" onClick={onCancelar} className="h-11 px-5 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer">
          {form.cancel}
        </button>
        <button
          type="submit"
          disabled={guardar.isPending}
          className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold disabled:opacity-60 cursor-pointer"
        >
          <Icon name="save" size={18} />
          {guardar.isPending ? form.saving : form.save}
        </button>
      </div>
    </form>
  )
}
