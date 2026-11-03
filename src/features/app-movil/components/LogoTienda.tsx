import type { TiendaMovil } from '../types/app-movil.types'

interface LogoTiendaProps {
  tienda: TiendaMovil
}

export function LogoTienda({ tienda }: LogoTiendaProps) {
  if (tienda === 'google-play') {
    return (
      <svg className="w-7 h-7 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.6 1.4A1.6 1.6 0 0 0 3 2.8v18.4a1.6 1.6 0 0 0 .6 1.4l9.7-9.8L3.6 1.4z" fill="#00E676" />
        <path d="M16.9 8.9L13.3 12.8l3.6 3.9 4.1-2.3a1.5 1.5 0 0 0 0-2.6l-4.1-2.9z" fill="#FFD600" />
        <path d="M3.6 1.4L13.3 12.8 16.9 8.9 5.8 2.6c-.7-.4-1.5-.5-2.2-.2z" fill="#00B0FF" />
        <path d="M3.6 22.6c.7.3 1.5.2 2.2-.2l11.1-6.3-3.6-3.3L3.6 22.6z" fill="#FF3D00" />
      </svg>
    )
  }

  return (
    <svg className="w-7 h-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.64-.81 1.08-1.92.96-3.05-.98.04-2.12.67-2.79 1.48-.59.71-1.11 1.87-.97 2.98 1.09.08 2.16-.58 2.8-1.41z" />
    </svg>
  )
}
