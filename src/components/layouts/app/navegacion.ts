import { ROUTES } from '@/app/routes'

export type ContadorNavegacion = 'solicitudesNuevas' | 'mensajesSinLeer'

export interface OpcionNavegacion {
  id: string
  label: string
  icon: string
  to: string
  /** Contador que se muestra como insignia (Stitch: "indicadores numéricos en Mensajes y Solicitudes"). */
  contador?: ContadorNavegacion
}

/**
 * Sidebar único del abogado: estructura exacta de la sección 7 de la especificación.
 * Las notificaciones NO van aquí: se abren desde la campana del Header (B1A).
 */
export const opcionesNavegacion: OpcionNavegacion[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: ROUTES.dashboard },
  { id: 'solicitudes', label: 'Solicitudes', icon: 'inbox', to: ROUTES.requests, contador: 'solicitudesNuevas' },
  { id: 'propuestas', label: 'Propuestas', icon: 'request_quote', to: ROUTES.proposals },
  { id: 'expedientes', label: 'Mis Expedientes', icon: 'folder_managed', to: ROUTES.cases },
  { id: 'clientes', label: 'Clientes', icon: 'groups', to: ROUTES.clients },
  { id: 'honorarios', label: 'Honorarios y Cobros', icon: 'payments', to: ROUTES.fees },
  { id: 'agenda', label: 'Agenda', icon: 'event', to: ROUTES.agenda },
  { id: 'chat', label: 'Chat', icon: 'forum', to: ROUTES.chat, contador: 'mensajesSinLeer' },
  { id: 'perfil', label: 'Perfil Profesional', icon: 'badge', to: ROUTES.profile },
  { id: 'configuracion', label: 'Configuración', icon: 'settings', to: ROUTES.settings },
]

export const etiquetasShell = {
  brand: 'LexApp',
  brandSubtitle: 'Legal Suite',
  navAriaLabel: 'Navegación principal',
  skipLink: 'Saltar al contenido',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  searchPlaceholder: 'Búsqueda general (próximamente)',
  notifications: (n: number) => (n > 0 ? `Notificaciones, ${n} sin leer` : 'Notificaciones'),
  messages: (n: number) => (n > 0 ? `Chat, ${n} mensajes sin leer` : 'Chat'),
  profile: 'Ir a mi perfil profesional',
  validation: {
    pendiente: 'Validación pendiente',
    validado: 'Perfil validado',
    requiere_correccion: 'Requiere corrección',
    rechazado: 'Validación rechazada',
  },
}
