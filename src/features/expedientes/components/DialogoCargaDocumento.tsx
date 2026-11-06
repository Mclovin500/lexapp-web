import { useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { formatearTamano } from '@/lib/archivos'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import { categoriasDocumento, documentosContent, REGLAS_ARCHIVO } from '../content/documentos.content'
import { useCargarDocumento } from '../hooks/useDocumentos'
import { cargaDocumentoSchema, esCategoriaDocumento, type CargaDocumentoFormValues } from '../schemas/documento.schema'

interface DialogoCargaDocumentoProps {
  expedienteId: string
  abierto: boolean
  onCerrar: () => void
  onGuardado: () => void
}

/** E3 "Cargar documento": el archivo queda asociado al expediente (regla 9.3). */
export function DialogoCargaDocumento({ expedienteId, abierto, onCerrar, onGuardado }: DialogoCargaDocumentoProps) {
  const { uploadDialog } = documentosContent
  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo={uploadDialog.title} descripcion={uploadDialog.description} ancho="lg">
      <Formulario expedienteId={expedienteId} onCerrar={onCerrar} onGuardado={onGuardado} />
    </Dialogo>
  )
}

function Formulario({ expedienteId, onCerrar, onGuardado }: Omit<DialogoCargaDocumentoProps, 'abierto'>) {
  const { uploadDialog: textos, errors: mensajes } = documentosContent
  const cargar = useCargarDocumento(expedienteId)
  const entrada = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CargaDocumentoFormValues>({
    resolver: zodResolver(cargaDocumentoSchema),
    defaultValues: { archivo: null, categoria: '', descripcion: '' },
  })
  const [archivo, descripcion] = useWatch({ control, name: ['archivo', 'descripcion'] })

  const guardar = handleSubmit((valores) => {
    if (!(valores.archivo instanceof File) || !esCategoriaDocumento(valores.categoria)) return
    cargar.mutate(
      { archivo: valores.archivo, categoria: valores.categoria, descripcion: valores.descripcion.trim() },
      { onSuccess: onGuardado },
    )
  })

  const error = cargar.error
    ? cargar.error.tipo === 'conflicto' || cargar.error.tipo === 'sin_permiso'
      ? mensajes[cargar.error.tipo]
      : MENSAJES_ERROR_API[cargar.error.tipo]
    : null

  return (
    <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <p id="documento-archivo-etiqueta" className="text-label-md text-on-surface font-medium">
          {textos.file}
        </p>
        <input
          ref={entrada}
          id="documento-archivo"
          type="file"
          accept={REGLAS_ARCHIVO.accept}
          className="sr-only"
          aria-labelledby="documento-archivo-etiqueta"
          aria-describedby="documento-archivo-ayuda"
          onChange={(evento) => {
            setValue('archivo', evento.target.files?.[0] ?? null, { shouldValidate: true })
            // Permite volver a elegir el mismo archivo después de un error.
            evento.target.value = ''
          }}
        />
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-dashed ${
            errors.archivo ? 'border-error' : 'border-outline-variant'
          } bg-surface-container-low`}
        >
          <Icon name={archivo ? 'description' : 'upload_file'} size={28} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            {archivo && (
              <p className="text-label-md text-on-surface font-semibold break-all">
                {archivo.name} <span className="text-body-sm text-secondary font-normal">· {formatearTamano(archivo.size)}</span>
              </p>
            )}
            <p id="documento-archivo-ayuda" className="text-body-sm text-secondary">
              {textos.fileHint}
            </p>
          </div>
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-lowest text-on-surface text-label-md font-semibold shadow-sm hover:bg-surface-container cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Icon name="attach_file" size={18} />
            {archivo ? textos.change : textos.choose}
          </button>
        </div>
        {errors.archivo?.message && <MensajeCampo id="documento-archivo-error" mensaje={errors.archivo.message} />}
      </div>

      <CampoSelect
        id="documento-categoria"
        label={textos.category}
        icon="category"
        opciones={Object.entries(categoriasDocumento).map(([valor, etiqueta]) => ({ valor, etiqueta }))}
        placeholder={textos.categoryPlaceholder}
        error={errors.categoria?.message}
        {...register('categoria')}
      />
      <CampoAreaTexto
        id="documento-descripcion"
        label={textos.description2}
        labelHint={<span className="text-secondary font-normal">{textos.optional}</span>}
        icon="notes"
        rows={3}
        maxLength={500}
        longitud={descripcion.length}
        placeholder={textos.descriptionPlaceholder}
        error={errors.descripcion?.message}
        {...register('descripcion')}
      />
      {error && <EstadoError mensaje={error} />}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          onClick={onCerrar}
          className="h-11 px-5 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {textos.cancel}
        </button>
        <button
          type="submit"
          disabled={cargar.isPending}
          className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="cloud_upload" size={18} />
          {cargar.isPending ? textos.saving : textos.submit}
        </button>
      </div>
    </form>
  )
}
