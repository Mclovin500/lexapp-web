import type { FiltroNotificaciones, TipoNotificacion } from '../types/notificaciones.types'

export const tiposNotificacion: Record<TipoNotificacion, { label: string; icon: string; accion: string }> = {
  nueva_solicitud: { label: 'Nueva solicitud', icon: 'inbox', accion: 'Revisar solicitud' },
  nuevo_mensaje: { label: 'Nuevo mensaje', icon: 'chat', accion: 'Ir al chat' },
  propuesta_aceptada: { label: 'Propuesta aceptada', icon: 'assignment_turned_in', accion: 'Ver propuestas' },
  propuesta_rechazada: { label: 'Propuesta rechazada', icon: 'assignment_late', accion: 'Ver propuestas' },
  documento_recibido: { label: 'Documento recibido', icon: 'description', accion: 'Ver documentos' },
  documento_pendiente: { label: 'Documento pendiente', icon: 'pending_actions', accion: 'Revisar documento' },
  nuevo_cobro: { label: 'Nuevo cobro', icon: 'receipt_long', accion: 'Ver cobro' },
  pago_realizado: { label: 'Pago realizado', icon: 'payments', accion: 'Ver pago' },
  actualizacion_expediente: { label: 'Actualización de expediente', icon: 'folder_open', accion: 'Ver expediente' },
  proxima_videollamada: { label: 'Próxima videollamada', icon: 'videocam', accion: 'Ingresar a la sala' },
}

export const notificacionesContent = {
  title: 'Notificaciones',
  subtitle: 'Actividad reciente de tus solicitudes, clientes, expedientes y cobros.',
  filters: {
    ariaLabel: 'Filtrar notificaciones',
    options: [
      { valor: 'todas', label: 'Todas' },
      { valor: 'no_leidas', label: 'No leídas' },
      { valor: 'leidas', label: 'Leídas' },
    ] satisfies { valor: FiltroNotificaciones; label: string }[],
  },
  markAll: 'Marcar todas como leídas',
  markingAll: 'Marcando…',
  markRead: 'Marcar como leída',
  unread: 'No leída',
  loading: 'Cargando notificaciones…',
  loadError: 'No pudimos cargar tus notificaciones.',
  actionError: 'No pudimos actualizar la notificación. Inténtalo de nuevo.',
  empty: {
    todas: { title: 'No tienes notificaciones', description: 'Aquí verás la actividad de tus clientes y expedientes.' },
    no_leidas: { title: 'Estás al día', description: 'No tienes notificaciones sin leer.' },
    leidas: { title: 'Sin notificaciones leídas', description: 'Las notificaciones que leas aparecerán aquí.' },
  } satisfies Record<FiltroNotificaciones, { title: string; description: string }>,
}
