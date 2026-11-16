import type { CampoCambioAbogado, EstadoCambio, SolicitudCambio } from '../types/solicitudes-cambio.types'

export const camposCambio: Record<SolicitudCambio['campo'], string> = {
  tarifa_por_hora_centavos: 'Tarifa por hora',
  experiencia_anos: 'Años de experiencia',
  cedula_profesional: 'Cédula profesional',
  tipo_documento: 'Tipo de documento',
  fecha_nacimiento: 'Fecha de nacimiento',
  documento_identidad: 'Documento de identidad',
}

export const estadosCambio: Record<EstadoCambio, { label: string; icon: string; clases: string }> = {
  pendiente: { label: 'En revisión', icon: 'hourglass_top', clases: 'bg-secondary-container text-on-secondary-container' },
  aprobado: { label: 'Aprobada', icon: 'check_circle', clases: 'bg-primary-container/15 text-primary' },
  rechazado: { label: 'Rechazada', icon: 'cancel', clases: 'bg-error/10 text-error' },
}

export const opcionesCampo: { valor: CampoCambioAbogado; etiqueta: string }[] = [
  { valor: 'tarifa_por_hora_centavos', etiqueta: camposCambio.tarifa_por_hora_centavos },
  { valor: 'experiencia_anos', etiqueta: camposCambio.experiencia_anos },
  { valor: 'cedula_profesional', etiqueta: camposCambio.cedula_profesional },
]

export const solicitudesCambioContent = {
  title: 'Solicitudes de cambio',
  description:
    'Tu tarifa por hora, tus años de experiencia y tu cédula profesional los revisa un administrador antes de publicarlos.',
  form: {
    field: 'Dato a cambiar',
    fee: 'Nueva tarifa por hora (MXN)',
    feePlaceholder: 'Ej. 1500',
    years: 'Años de experiencia',
    yearsPlaceholder: 'Ej. 8',
    cedula: 'Nueva cédula profesional',
    cedulaPlaceholder: 'Número de cédula',
    file: 'Archivo de la cédula',
    fileHint: 'PDF, JPG o PNG, máximo 10 MB.',
    justification: 'Justificación',
    justificationPlaceholder: 'Explica brevemente el motivo del cambio.',
    optional: '(opcional)',
    submit: 'Enviar solicitud',
    submitting: 'Enviando…',
    sent: 'Tu solicitud se envió. Te avisaremos cuando un administrador la revise.',
  },
  errors: {
    fee: 'Escribe una tarifa válida, p. ej. 1500 o 1500.50.',
    years: 'Escribe un número entero entre 0 y 80.',
    cedula: 'Escribe el número de cédula (máximo 50 caracteres).',
    file: 'Adjunta un PDF, JPG o PNG de máximo 10 MB.',
  },
  history: {
    title: 'Historial',
    empty: 'Aún no has enviado solicitudes de cambio.',
    loading: 'Cargando solicitudes…',
    requested: 'Solicitado',
    newValue: 'Valor solicitado',
    reason: 'Motivo del rechazo',
  },
}
