import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { CampoTexto } from '@/features/auth/components/CampoTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import { configuracionContent, ZONAS_HORARIAS } from '../content/configuracion.content'
import { useDatosPersonales, useGuardarDatosPersonales } from '../hooks/useConfiguracion'
import { datosPersonalesSchema, type DatosPersonalesFormValues } from '../schemas/configuracion.schema'
import type { DatosPersonales } from '../types/configuracion.types'
import { AvisoGuardado, botonPrimario } from './SeccionConfiguracion'

export function DatosPersonalesSeccion() {
  const datos = useDatosPersonales()
  if (datos.isPending) return <EstadoCarga texto={configuracionContent.personal.loading} />
  if (datos.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[datos.error.tipo]} onReintentar={() => void datos.refetch()} />
  return <Formulario datos={datos.data} />
}

function Formulario({ datos }: { datos: DatosPersonales }) {
  const { personal: textos } = configuracionContent
  const guardar = useGuardarDatosPersonales()
  const [guardado, setGuardado] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosPersonalesFormValues>({
    resolver: zodResolver(datosPersonalesSchema),
    defaultValues: { telefono: datos.telefono ?? '', zonaHoraria: datos.zonaHoraria },
  })

  const enviar = handleSubmit((v) => {
    setGuardado(false)
    guardar.mutate({ telefono: v.telefono.trim() || null, zonaHoraria: v.zonaHoraria }, { onSuccess: () => setGuardado(true) })
  })

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <CampoTexto id="config-nombre" label={textos.name} icon="person" value={datos.nombreCompleto} readOnly disabled />
          <p className="text-[11px] text-secondary">{textos.nameNote}</p>
        </div>
        <div className="space-y-1">
          <CampoTexto id="config-correo" label={textos.email} icon="mail" value={datos.correo} readOnly disabled />
          <p className="text-[11px] text-secondary">{textos.emailNote}</p>
        </div>
        <CampoTexto
          id="config-telefono"
          label={textos.phone}
          labelHint={textos.optional}
          icon="call"
          type="tel"
          inputMode="tel"
          maxLength={20}
          placeholder={textos.phonePlaceholder}
          error={errors.telefono?.message}
          {...register('telefono')}
        />
        <CampoSelect id="config-zona" label={textos.timezone} icon="schedule" opciones={ZONAS_HORARIAS} placeholder={textos.timezone} error={errors.zonaHoraria?.message} {...register('zonaHoraria')} />
      </div>
      {guardar.isError && <EstadoError mensaje={guardar.error.tipo === 'datos_invalidos' ? textos.invalidPhone : MENSAJES_ERROR_API[guardar.error.tipo]} />}
      {guardado && <AvisoGuardado texto={textos.saved} />}
      <button type="submit" disabled={guardar.isPending} className={botonPrimario}>
        {guardar.isPending ? textos.saving : textos.save}
      </button>
    </form>
  )
}
