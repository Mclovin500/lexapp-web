import { useState } from 'react'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { CampoSelect } from '@/features/auth/components/compartidos/CampoSelect'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { useOpcionesClientes } from '@/features/clientes/hooks/useOpcionesClientes'
import { useOpcionesExpedientes } from '@/features/expedientes/hooks/useOpcionesExpedientes'
import { chatContent } from '../content/chat.content'
import { useAbrirConversacion } from '../hooks/useChat'

interface DialogoNuevaConversacionProps {
  abierto: boolean
  onCerrar: () => void
  onAbierta: (id: string) => void
}

export function DialogoNuevaConversacion({ abierto, onCerrar, onAbierta }: DialogoNuevaConversacionProps) {
  const { newDialog } = chatContent
  return (
    <Dialogo abierto={abierto} onCerrar={onCerrar} titulo={newDialog.title} descripcion={newDialog.description}>
      <Formulario onCerrar={onCerrar} onAbierta={onAbierta} />
    </Dialogo>
  )
}

function Formulario({ onCerrar, onAbierta }: Omit<DialogoNuevaConversacionProps, 'abierto'>) {
  const { newDialog: textos } = chatContent
  const clientes = useOpcionesClientes()
  const abrir = useAbrirConversacion()
  const [clienteId, setClienteId] = useState('')
  const [expedienteId, setExpedienteId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const expedientes = useOpcionesExpedientes(clienteId)

  if (clientes.isPending) return <EstadoCarga texto={textos.loading} />
  if (clientes.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[clientes.error.tipo]} onReintentar={() => void clientes.refetch()} />

  const enviar = () => {
    if (!clienteId) {
      setError(textos.clientPlaceholder)
      return
    }
    abrir.mutate({ clienteId, expedienteId: expedienteId || null }, { onSuccess: ({ id }) => onAbierta(id) })
  }

  return (
    <div className="flex flex-col gap-4">
      <CampoSelect
        id="conversacion-cliente"
        label={textos.client}
        icon="person"
        opciones={clientes.data.map((c) => ({ valor: c.id, etiqueta: c.organizacion ? `${c.nombre} · ${c.organizacion}` : c.nombre }))}
        placeholder={textos.clientPlaceholder}
        value={clienteId}
        error={error ?? undefined}
        onChange={(evento) => {
          setClienteId(evento.target.value)
          setExpedienteId('')
          setError(null)
        }}
      />
      <CampoSelect
        id="conversacion-expediente"
        label={textos.case}
        icon="folder_managed"
        opciones={(expedientes.data ?? []).map((e) => ({ valor: e.id, etiqueta: `${e.folio} · ${e.asunto}` }))}
        placeholder={textos.caseNone}
        placeholderSeleccionable
        disabled={!clienteId || expedientes.isPending}
        value={expedienteId}
        onChange={(evento) => setExpedienteId(evento.target.value)}
      />
      {abrir.isError && <MensajeCampo id="conversacion-error" mensaje={MENSAJES_ERROR_API[abrir.error.tipo]} />}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button type="button" onClick={onCerrar} className="h-11 px-5 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer">
          {textos.cancel}
        </button>
        <button
          type="button"
          onClick={enviar}
          disabled={abrir.isPending}
          className="h-11 px-5 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold disabled:opacity-60 cursor-pointer"
        >
          {abrir.isPending ? textos.opening : textos.submit}
        </button>
      </div>
    </div>
  )
}
