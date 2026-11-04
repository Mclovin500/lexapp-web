import type { EstadoValidacion } from '../types/sesion.types'

interface TextoEstado {
  icon: string
  badge: string
  title: string
  message: string
}

export const validacionProfesionalContent = {
  title: 'Validación de perfil profesional',
  subtitle: 'Consulta el estado de la revisión de tus credenciales profesionales.',
  loading: 'Consultando el estado de tu validación…',
  details: {
    title: 'Datos enviados a revisión',
    name: 'Nombre',
    cedula: 'Cédula profesional',
    specialty: 'Especialidad',
    status: 'Estado',
    submittedAt: 'Fecha de envío',
    folio: 'Folio',
  },
  /** Textos por estado. Nunca se muestra "validado" si el backend no lo devuelve. */
  states: {
    pendiente: {
      icon: 'hourglass_top',
      badge: 'Pendiente de revisión',
      title: 'Tu información está en revisión',
      message:
        'Recibimos tus credenciales y las estamos cotejando. Te avisaremos cuando la revisión concluya; mientras tanto, algunas funciones permanecen restringidas.',
    },
    validado: {
      icon: 'verified',
      badge: 'Validado',
      title: 'Tu perfil profesional fue validado',
      message: 'Tus credenciales fueron revisadas y aprobadas. Ya puedes ingresar a tu despacho.',
    },
    requiere_correccion: {
      icon: 'edit_note',
      badge: 'Requiere corrección',
      title: 'Tu registro necesita correcciones',
      message: 'Revisamos tu información y encontramos observaciones. Corrígelas para continuar con la revisión.',
    },
    rechazado: {
      icon: 'cancel',
      badge: 'Rechazado',
      title: 'Tu validación no fue aprobada',
      message:
        'No fue posible validar tu perfil profesional con la información proporcionada. Puedes corregirla y volver a enviarla a revisión.',
    },
  } satisfies Record<EstadoValidacion, TextoEstado>,
  reasonLabel: 'Motivo',
  actions: {
    title: 'Acciones disponibles',
    enterOffice: 'Ingresar a mi despacho',
    enterOfficeDetail: 'Accede a tu panel de trabajo.',
    fixCredentials: 'Corregir credenciales',
    fixCredentialsDetail: 'Cédula, universidad y especialidad (A4).',
    editProfile: 'Modificar perfil',
    editProfileDetail: 'Área de práctica y especializaciones (A5).',
    reviewCredentials: 'Revisar credenciales',
    reviewCredentialsDetail: 'Consulta o actualiza tu cédula y especialidad (A4).',
    reviewProfile: 'Revisar perfil',
    reviewProfileDetail: 'Consulta o actualiza tu área de práctica (A5).',
    resubmitNote: 'Al terminar en A5, vuelve a enviar tu registro a revisión.',
    refresh: 'Actualizar estado',
    refreshing: 'Actualizando…',
    refreshDetail: 'Consulta si tu revisión ya concluyó.',
  },
  restricted: {
    title: 'Funciones restringidas hasta la aprobación',
    description: 'Estas funciones se habilitan cuando tu perfil sea validado:',
    // PLACEHOLDER: confirmar con negocio qué funciones se restringen
    items: [
      { icon: 'person_search', title: 'Perfil visible para clientes', detail: 'Tu perfil no aparece en la búsqueda de la app de clientes.' },
      { icon: 'inbox', title: 'Solicitudes de clientes', detail: 'No recibirás solicitudes nuevas.' },
      { icon: 'request_quote', title: 'Propuestas y cobros', detail: 'No podrás enviar propuestas ni crear cobros.' },
    ],
  },
  errors: {
    sesion_expirada: 'Tu sesión venció. Inicia sesión para consultar tu validación.',
    loginLink: 'Ir a iniciar sesión',
    red: 'No pudimos conectar con el servidor.',
    desconocido: 'No pudimos consultar el estado de tu validación.',
    retry: 'Reintentar',
  },
}

/** Fecha de envío en formato es-MX; si no es una fecha válida, se muestra tal cual. */
export function formatearFechaEnvio(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return iso
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeStyle: 'short' }).format(fecha)
}
