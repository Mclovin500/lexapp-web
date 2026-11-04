import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useCuentaAbogado } from '@/features/dashboard/hooks/useCuentaAbogado'
import { EncabezadoApp } from './app/EncabezadoApp'
import { etiquetasShell } from './app/navegacion'
import { Sidebar } from './app/Sidebar'

/**
 * Estructura única de las pantallas internas (B1 en adelante): Sidebar + Header + Workspace.
 * TODO: proteger estas rutas cuando exista autenticación real (sesión con cookie httpOnly).
 */
export function AppLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { data: cuenta } = useCuentaAbogado()

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary-container focus:text-on-primary"
      >
        {etiquetasShell.skipLink}
      </a>
      <Sidebar contadores={cuenta?.contadores} abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
      <div className="lg:pl-64">
        <EncabezadoApp cuenta={cuenta} onAbrirMenu={() => setMenuAbierto(true)} />
        <main id="contenido" className="px-4 sm:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
