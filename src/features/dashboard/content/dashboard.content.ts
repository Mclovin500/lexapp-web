import { ROUTES } from '@/app/routes'
import type { TipoActividad } from '../types/dashboard.types'

export const dashboardContent = {
  greeting: '¡Bienvenido de nuevo, Licenciado!',
  intro: 'Este es el resumen de tu actividad: revisa primero las solicitudes nuevas de tus clientes.',
  loading: 'Cargando tu resumen…',
  loadError: 'No pudimos cargar tu resumen.',
  quickAccess: {
    title: 'Accesos rápidos',
    items: [
      { label: 'Ver solicitudes', icon: 'inbox', to: ROUTES.requests },
      { label: 'Nueva propuesta', icon: 'post_add', to: ROUTES.newProposal },
      { label: 'Abrir agenda', icon: 'event', to: ROUTES.agenda },
      { label: 'Ir al chat', icon: 'forum', to: ROUTES.chat },
    ],
  },
  indicators: {
    solicitudesNuevas: { label: 'Nuevas solicitudes', icon: 'inbox', to: `${ROUTES.requests}?estado=nueva` },
    expedientesActivos: { label: 'Expedientes activos', icon: 'folder_managed', to: ROUTES.cases },
    propuestasPendientes: { label: 'Propuestas pendientes', icon: 'request_quote', to: ROUTES.proposals },
    proximasReuniones: { label: 'Próximas reuniones', icon: 'videocam', to: ROUTES.agenda },
  },
  requests: {
    title: 'Nuevas solicitudes de clientes',
    pending: (n: number) => `${n} ${n === 1 ? 'pendiente' : 'pendientes'}`,
    viewAll: 'Ver todas las solicitudes',
    review: 'Revisar solicitud',
    empty: 'No tienes solicitudes nuevas.',
  },
  meetings: {
    title: 'Próximas reuniones',
    subtitle: 'Todas las reuniones son virtuales.',
    join: 'Ingresar a la sala',
    viewAgenda: 'Ver agenda',
    empty: 'No tienes reuniones programadas.',
    noCase: 'Sin expediente asociado',
  },
  payments: {
    title: 'Pagos y cobros relevantes',
    viewAll: 'Ver honorarios y cobros',
    detail: 'Ver detalle',
    empty: 'No hay movimientos recientes.',
  },
  activity: {
    title: 'Actividad reciente',
    empty: 'Aún no hay actividad.',
    icons: {
      solicitud: 'inbox',
      propuesta: 'request_quote',
      expediente: 'folder_open',
      documento: 'description',
      pago: 'payments',
      mensaje: 'chat',
    } satisfies Record<TipoActividad, string>,
  },
}
