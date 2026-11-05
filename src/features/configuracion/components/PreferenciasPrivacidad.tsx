import { useState } from 'react'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { configuracionContent } from '../content/configuracion.content'
import { useGuardarPrivacidad, usePreferenciasPrivacidad, useSolicitarExportacion } from '../hooks/useConfiguracion'
import type { PreferenciasPrivacidad as Preferencias } from '../types/configuracion.types'
import { AvisoGuardado, botonPrimario, botonSecundario } from './SeccionConfiguracion'

export function PreferenciasPrivacidad() {
  const preferencias = usePreferenciasPrivacidad()
  if (preferencias.isPending) return <EstadoCarga texto={configuracionContent.privacy.loading} />
  if (preferencias.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[preferencias.error.tipo]} onReintentar={() => void preferencias.refetch()} />
  return <Formulario inicial={preferencias.data} />
}

function Formulario({ inicial }: { inicial: Preferencias }) {
  const { privacy: textos } = configuracionContent
  const guardar = useGuardarPrivacidad()
  const exportar = useSolicitarExportacion()
  const [valores, setValores] = useState(inicial)
  const [guardado, setGuardado] = useState(false)
  const claves = Object.keys(textos.options) as (keyof Preferencias)[]

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {claves.map((clave) => (
          <li key={clave}>
            <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low cursor-pointer">
              <input
                type="checkbox"
                checked={valores[clave]}
                onChange={() => {
                  setGuardado(false)
                  setValores((actual) => ({ ...actual, [clave]: !actual[clave] }))
                }}
                className="mt-1 w-4 h-4 accent-primary cursor-pointer"
              />
              <span>
                <span className="block text-body-md text-on-surface">{textos.options[clave].label}</span>
                <span className="block text-body-sm text-secondary">{textos.options[clave].detail}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      {guardar.isError && <EstadoError mensaje={MENSAJES_ERROR_API[guardar.error.tipo]} />}
      {guardado && <AvisoGuardado texto={textos.saved} />}
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={guardar.isPending} onClick={() => guardar.mutate(valores, { onSuccess: () => setGuardado(true) })} className={botonPrimario}>
          {guardar.isPending ? textos.saving : textos.save}
        </button>
        <button type="button" disabled={exportar.isPending || exportar.isSuccess} onClick={() => exportar.mutate()} className={`${botonSecundario} self-center`}>
          <Icon name="download" size={18} />
          {exportar.isPending ? textos.exporting : textos.export}
        </button>
      </div>
      {exportar.data && <AvisoGuardado texto={textos.exported(exportar.data.correo)} />}
      {exportar.isError && <EstadoError mensaje={MENSAJES_ERROR_API[exportar.error.tipo]} />}
    </div>
  )
}
