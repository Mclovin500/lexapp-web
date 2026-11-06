import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoError } from '@/components/ui/EstadoError'
import { CampoAreaTexto } from '@/features/auth/components/compartidos/CampoAreaTexto'
import { documentosContent } from '../content/documentos.content'
import { useRevisarDocumento } from '../hooks/useDocumentos'
import { revisionDocumentoSchema, type RevisionDocumentoFormValues } from '../schemas/documento.schema'
import type { DocumentoExpediente, PeticionRevisionDocumento } from '../types/documentos.types'

interface DialogoRevisionDocumentoProps {
  expedienteId: string
  documento: DocumentoExpediente | null
  onCerrar: () => void
  onGuardado: () => void
}

/** Revisión de un documento que cargó el cliente: "Revisado" o "Requiere corrección" (con comentario). */
export function DialogoRevisionDocumento({ expedienteId, documento, onCerrar, onGuardado }: DialogoRevisionDocumentoProps) {
  const { reviewDialog } = documentosContent
  return (
    <Dialogo abierto={documento !== null} onCerrar={onCerrar} titulo={reviewDialog.title} descripcion={documento?.nombre ?? reviewDialog.description}>
      {documento && <Formulario expedienteId={expedienteId} documentoId={documento.id} onGuardado={onGuardado} />}
    </Dialogo>
  )
}

function Formulario({ expedienteId, documentoId, onGuardado }: { expedienteId: string; documentoId: string; onGuardado: () => void }) {
  const { reviewDialog: textos, errors: mensajes } = documentosContent
  const revisar = useRevisarDocumento(expedienteId)
  const [accion, setAccion] = useState<PeticionRevisionDocumento['estado'] | null>(null)
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RevisionDocumentoFormValues>({ resolver: zodResolver(revisionDocumentoSchema), defaultValues: { nota: '' } })
  const nota = useWatch({ control, name: 'nota' })

  const enviar = (estado: PeticionRevisionDocumento['estado']) =>
    handleSubmit((valores) => {
      const texto = valores.nota.trim()
      if (estado === 'requiere_correccion' && texto.length < 10) {
        setError('nota', { message: textos.noteRequired })
        return
      }
      setAccion(estado)
      revisar.mutate({ documentoId, peticion: { estado, nota: texto || null } }, { onSuccess: onGuardado, onSettled: () => setAccion(null) })
    })

  const error = revisar.error
    ? revisar.error.tipo === 'conflicto'
      ? mensajes.conflicto
      : MENSAJES_ERROR_API[revisar.error.tipo]
    : null

  return (
    <form onSubmit={(evento) => evento.preventDefault()} noValidate className="flex flex-col gap-4">
      <CampoAreaTexto
        id="revision-nota"
        label={textos.note}
        icon="comment"
        rows={3}
        maxLength={500}
        longitud={nota.length}
        placeholder={textos.notePlaceholder}
        error={errors.nota?.message}
        {...register('nota')}
      />
      {error && <EstadoError mensaje={error} />}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          disabled={revisar.isPending}
          onClick={() => void enviar('requiere_correccion')()}
          className="h-11 px-5 rounded-lg bg-error/10 text-error text-label-lg font-semibold hover:bg-error/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {accion === 'requiere_correccion' ? textos.saving : textos.reject}
        </button>
        <button
          type="button"
          disabled={revisar.isPending}
          onClick={() => void enviar('revisado')()}
          className="h-11 px-5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {accion === 'revisado' ? textos.saving : textos.approve}
        </button>
      </div>
    </form>
  )
}
