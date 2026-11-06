import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import type { CuentaAbogado } from '@/features/dashboard/types/cuenta.types'
import { etiquetasShell, opcionesNavegacion } from './navegacion'

interface SidebarProps {
  contadores?: CuentaAbogado['contadores']
  abierto: boolean
  onCerrar: () => void
}

/** Sidebar único del panel (sección 7 de la especificación). */
export function Sidebar({ contadores, abierto, onCerrar }: SidebarProps) {
  return (
    <>
      {/* Fondo para cerrar el menú en pantallas angostas */}
      {abierto && (
        <button
          type="button"
          aria-label={etiquetasShell.closeMenu}
          onClick={onCerrar}
          className="fixed inset-0 z-40 bg-on-surface/30 lg:hidden"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex flex-col transition-transform lg:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <Icon name="balance" size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-headline-sm font-bold tracking-tight text-on-surface leading-none">
              {etiquetasShell.brand}
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-secondary font-semibold mt-0.5">
              {etiquetasShell.brandSubtitle}
            </span>
          </div>
        </div>

        <nav aria-label={etiquetasShell.navAriaLabel} className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {opcionesNavegacion.map((opcion) => {
              const contador = opcion.contador ? (contadores?.[opcion.contador] ?? 0) : 0
              return (
                <li key={opcion.id}>
                  <NavLink
                    to={opcion.to}
                    end={opcion.id === 'dashboard'}
                    onClick={onCerrar}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${
                        isActive
                          ? 'bg-primary-container/10 text-primary font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon name={opcion.icon} size={20} filled={isActive} />
                        <span className="flex-1">{opcion.label}</span>
                        {contador > 0 && (
                          <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary-container text-on-primary-container text-[11px] font-bold flex items-center justify-center">
                            {contador}
                            <span className="sr-only"> pendientes</span>
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
