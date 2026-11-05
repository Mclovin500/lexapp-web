import { useState } from 'react'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { configuracionContent } from '../content/configuracion.content'
import { useGuardarNotificaciones, usePreferenciasNotificaciones } from '../hooks/useConfiguracion'
import type { CanalNotificacion, CategoriaNotificacion, PreferenciasNotificaciones as Preferencias } from '../types/configuracion.types'
import { AvisoGuardado, botonPrimario } from './SeccionConfiguracion'

const CANALES: CanalNotificacion[] = ['correo', 'push']

export function PreferenciasNotificaciones() {
  const preferencias = usePreferenciasNotificaciones()
  if (preferencias.isPending) return <EstadoCarga texto={configuracionContent.notifications.loading} />
  if (preferencias.isError) return <EstadoError mensaje={MENSAJES_ERROR_API[preferencias.error.tipo]} onReintentar={() => void preferencias.refetch()} />
  return <Matriz inicial={preferencias.data} />
}

function Matriz({ inicial }: { inicial: Preferencias }) {
  const { notifications: textos } = configuracionContent
  const guardar = useGuardarNotificaciones()
  const [valores, setValores] = useState(inicial)
  const [guardado, setGuardado] = useState(false)
  const categorias = Object.keys(textos.categories) as CategoriaNotificacion[]

  const alternar = (categoria: CategoriaNotificacion, canal: CanalNotificacion) => {
    setGuardado(false)
    setValores((actual) => ({ ...actual, [categoria]: { ...actual[categoria], [canal]: !actual[categoria][canal] } }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left">
          <thead>
            <tr className="text-label-sm uppercase tracking-wider text-secondary">
              <th scope="col" className="py-2 pr-4 font-semibold">{textos.event}</th>
              {CANALES.map((canal) => (
                <th key={canal} scope="col" className="py-2 px-4 font-semibold text-center">
                  {textos.channels[canal]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {categorias.map((categoria) => (
              <tr key={categoria}>
                <th scope="row" className="py-3 pr-4 text-body-md text-on-surface font-normal">
                  {textos.categories[categoria]}
                </th>
                {CANALES.map((canal) => (
                  <td key={canal} className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={valores[categoria][canal]}
                      onChange={() => alternar(categoria, canal)}
                      aria-label={`${textos.categories[categoria]}: ${textos.channels[canal]}`}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {guardar.isError && <EstadoError mensaje={MENSAJES_ERROR_API[guardar.error.tipo]} />}
      {guardado && <AvisoGuardado texto={textos.saved} />}
      <button type="button" disabled={guardar.isPending} onClick={() => guardar.mutate(valores, { onSuccess: () => setGuardado(true) })} className={botonPrimario}>
        {guardar.isPending ? textos.saving : textos.save}
      </button>
    </div>
  )
}
