import { useState } from 'react'
import { LanzadorAsistente } from './components/LanzadorAsistente'
import { PanelAsistente } from './components/PanelAsistente'
import { useAsistente } from './hooks/useAsistente'

/**
 * Asistente flotante de LexApp (maqueta de diseño).
 * FAB + panel superpuesto; las respuestas son simuladas en el cliente, sin backend.
 */
export function Asistente() {
  const [abierto, setAbierto] = useState(false)
  const { mensajes, estado, enviar, reiniciar } = useAsistente()

  return (
    <>
      <LanzadorAsistente abierto={abierto} onAlternar={() => setAbierto((valor) => !valor)} />
      <div id="panel-asistente">
        <PanelAsistente
          abierto={abierto}
          mensajes={mensajes}
          estado={estado}
          onCerrar={() => setAbierto(false)}
          onReiniciar={reiniciar}
          onEnviar={enviar}
        />
      </div>
    </>
  )
}
