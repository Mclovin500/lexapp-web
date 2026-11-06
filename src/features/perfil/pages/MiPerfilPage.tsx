import { useState } from 'react'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { EncabezadoPerfil } from '../components/EncabezadoPerfil'
import { FormularioPerfil } from '../components/FormularioPerfil'
import { VistaPerfil } from '../components/VistaPerfil'
import { perfilContent } from '../content/perfil.content'
import { usePerfil } from '../hooks/usePerfil'

/** I1: consultar y editar el perfil profesional en la misma pantalla. */
export function MiPerfilPage() {
  const contenido = perfilContent
  const perfil = usePerfil()
  const [editando, setEditando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-headline-lg text-on-surface tracking-tight">{editando ? contenido.form.title : contenido.title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{contenido.subtitle}</p>
      </div>

      {perfil.isPending && <EstadoCarga texto={contenido.loading} />}
      {perfil.isError && <EstadoError mensaje={MENSAJES_ERROR_API[perfil.error.tipo]} onReintentar={() => void perfil.refetch()} />}

      {aviso && !editando && (
        <p role="status" className="flex items-start gap-2 p-4 rounded-lg bg-primary-container/10 text-body-md text-primary">
          <Icon name="check_circle" size={20} className="shrink-0" />
          {aviso}
        </p>
      )}

      {perfil.data && (
        <>
          <EncabezadoPerfil
            perfil={perfil.data}
            accion={
              !editando && (
                <button
                  type="button"
                  onClick={() => {
                    setAviso(null)
                    setEditando(true)
                  }}
                  className="self-start md:self-center h-11 px-5 inline-flex items-center gap-2 rounded-lg bg-primary-container hover:bg-primary-hover text-on-primary-container hover:text-on-primary text-label-lg font-semibold shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon name="edit" size={18} />
                  {contenido.edit}
                </button>
              )
            }
          />
          {editando ? (
            <FormularioPerfil
              perfil={perfil.data}
              onCancelar={() => setEditando(false)}
              onGuardado={() => {
                setEditando(false)
                setAviso(contenido.saved)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          ) : (
            <VistaPerfil perfil={perfil.data} />
          )}
        </>
      )}
    </div>
  )
}
