import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Dialogo } from '@/components/ui/Dialogo'
import { EstadoError } from '@/components/ui/EstadoError'
import { Icon } from '@/components/ui/Icon'
import { configuracionContent } from '../content/configuracion.content'
import { useCerrarSesion } from '../hooks/useConfiguracion'

/** J1 "Cerrar sesión" → P02 (la antigua A2 se sustituyó por P02, ver flujo-navegacion.md). */
export function CerrarSesion() {
  const { logout: textos } = configuracionContent
  const navigate = useNavigate()
  const cerrar = useCerrarSesion()
  const [confirmar, setConfirmar] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmar(true)}
        className="h-11 px-5 inline-flex items-center gap-2 self-start rounded-lg bg-error/10 text-error text-label-lg font-semibold hover:bg-error/20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="logout" size={20} />
        {textos.button}
      </button>
      <Dialogo abierto={confirmar} onCerrar={() => setConfirmar(false)} titulo={textos.confirmTitle} descripcion={textos.confirmDescription}>
        <div className="flex flex-col gap-4">
          {cerrar.isError && <EstadoError mensaje={MENSAJES_ERROR_API[cerrar.error.tipo]} />}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <button type="button" onClick={() => setConfirmar(false)} className="h-11 px-5 rounded-lg bg-surface-container text-on-surface text-label-lg font-semibold hover:bg-surface-container-high cursor-pointer">
              {textos.cancel}
            </button>
            <button
              type="button"
              disabled={cerrar.isPending}
              onClick={() => cerrar.mutate(undefined, { onSuccess: () => navigate(ROUTES.login, { replace: true }) })}
              className="h-11 px-5 rounded-lg bg-error text-on-error text-label-lg font-semibold hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {cerrar.isPending ? textos.closing : textos.confirm}
            </button>
          </div>
        </div>
      </Dialogo>
    </>
  )
}
