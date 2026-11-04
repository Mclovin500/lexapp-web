export const detalleSolicitudContent = {
  back: 'Volver a solicitudes',
  title: 'Detalle de solicitud',
  receivedAt: 'Fecha de solicitud',
  loading: 'Cargando la solicitud…',
  client: {
    title: 'Información del cliente',
    email: 'Correo',
    phone: 'Teléfono',
    notProvided: 'No proporcionado',
  },
  need: {
    title: 'Descripción de la necesidad',
    area: 'Área jurídica',
    quoteNote: 'Texto escrito por el cliente',
  },
  info: {
    title: 'Información proporcionada por el cliente',
    empty: 'El cliente no agregó información adicional.',
  },
  documents: {
    title: 'Documentos disponibles',
    empty: 'El cliente no adjuntó documentos.',
    download: 'Descargar',
    unavailable: 'Descarga no disponible',
  },
  // Aviso basado en C2 de Stitch: no afirmar que existe contratación en esta etapa.
  disclaimer:
    'Revisar esta solicitud no implica la aceptación del asunto ni una contratación formal. La relación profesional se establece cuando el cliente acepta tu propuesta.',
  actions: {
    title: 'Acciones',
    createProposal: 'Crear propuesta',
    review: 'Revisar información',
    reviewing: 'Marcando en revisión…',
    reviewDone: 'La solicitud está en revisión.',
    conversation: 'Abrir conversación',
    reject: 'Rechazar solicitud',
  },
  rejected: {
    title: 'Solicitud rechazada',
    reason: 'Motivo',
  },
  attended: 'Esta solicitud ya fue atendida.',
  rejectDialog: {
    title: 'Rechazar solicitud',
    description: 'El cliente verá el motivo en su aplicación. Esta acción no se puede deshacer.',
    reasonLabel: 'Motivo del rechazo',
    reasonPlaceholder: 'Ej. El asunto está fuera de mis áreas de práctica.',
    cancel: 'Cancelar',
    confirm: 'Rechazar solicitud',
    confirming: 'Rechazando…',
    done: 'La solicitud fue rechazada.',
  },
  errors: {
    no_encontrado: 'No encontramos esta solicitud. Puede que ya no esté disponible.',
    conflicto: 'La solicitud cambió de estado. Actualiza la página para ver su estado actual.',
  },
}
