import type { EstadoConexion } from '../services/videollamada.service'

/** Estados de G1A (especificación). */
export type FaseSala = 'preparando' | EstadoConexion | 'finalizada'

export const fasesSala: Record<FaseSala, { label: string; icon: string; clases: string }> = {
  preparando: { label: 'Preparando dispositivo', icon: 'settings', clases: 'bg-surface-container-highest text-on-surface' },
  esperando_cliente: { label: 'Esperando al cliente', icon: 'hourglass_top', clases: 'bg-tertiary/15 text-tertiary' },
  conectando: { label: 'Conectando', icon: 'sync', clases: 'bg-secondary-container text-on-secondary-container' },
  activa: { label: 'Activa', icon: 'radio_button_checked', clases: 'bg-primary-container/20 text-primary' },
  interrumpida: { label: 'Conexión interrumpida', icon: 'wifi_off', clases: 'bg-error/15 text-error' },
  finalizada: { label: 'Finalizada', icon: 'task_alt', clases: 'bg-surface-container-highest text-on-surface' },
}

export const salaContent = {
  loading: 'Preparando la sala…',
  backAgenda: 'Volver a la agenda',
  backChat: 'Volver al chat',
  noCase: 'Sin expediente relacionado',
  duration: 'Duración',
  you: 'Tú',
  clientVideo: 'Video del cliente',
  prepare: {
    title: 'Revisa tu cámara y micrófono',
    description: 'El navegador te pedirá permiso para usarlos. Puedes entrar aunque no los actives.',
    requesting: 'Solicitando acceso a la cámara y al micrófono…',
    ready: 'Cámara y micrófono listos.',
    denied: 'No diste permiso para usar la cámara y el micrófono. Puedes activarlos desde la configuración del navegador.',
    noDevices: 'No encontramos cámara o micrófono en este equipo.',
    unsupported: 'Este navegador no permite videollamadas. Usa una versión reciente de Chrome, Edge, Firefox o Safari.',
    error: 'No pudimos acceder a la cámara o al micrófono.',
    retry: 'Volver a intentar',
    enter: 'Entrar a la sala',
    entering: 'Entrando…',
  },
  waiting: 'El cliente aún no entra a la sala. Recibió la invitación en su aplicación.',
  connecting: 'Estableciendo la conexión segura…',
  interrupted: 'Se perdió la conexión. Reintentando automáticamente…',
  controls: {
    micOn: 'Silenciar micrófono',
    micOff: 'Activar micrófono',
    camOn: 'Apagar cámara',
    camOff: 'Encender cámara',
    share: 'Compartir pantalla',
    stopShare: 'Dejar de compartir',
    end: 'Finalizar llamada',
  },
  endDialog: {
    title: '¿Finalizar la videollamada?',
    description: 'Se cerrará la sala para ti y para el cliente.',
    summary: 'Resumen para el expediente',
    summaryPlaceholder: 'Acuerdos y siguientes pasos de la reunión.',
    optional: '(opcional)',
    confirm: 'Finalizar llamada',
    ending: 'Finalizando…',
    cancel: 'Continuar en la llamada',
  },
  ended: {
    title: 'Videollamada finalizada',
    duration: 'Duración total',
    client: 'Cliente',
    case: 'Expediente',
    viewCase: 'Ver expediente',
  },
  unavailable: {
    finalizada: 'Esta reunión ya finalizó.',
    cancelada: 'Esta reunión fue cancelada.',
    no_realizada: 'El horario de esta reunión ya pasó.',
    notYet: (hora: string) => `La sala se abre a las ${hora}, una hora antes de la reunión.`,
  },
  errors: {
    sin_permiso: 'No tienes acceso a esta reunión.',
    no_encontrado: 'No encontramos esta reunión.',
    conflicto: 'La sala ya no está disponible para esta reunión.',
    provider: 'El servicio de videollamada todavía no está conectado.',
  },
}
