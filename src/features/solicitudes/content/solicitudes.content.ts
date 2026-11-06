import type {
  EstadoSolicitud,
  FiltroEstadoSolicitud,
  PrioridadSolicitud,
  TipoPersona,
} from '../types/solicitudes.types'

export const estadosSolicitud: Record<EstadoSolicitud, { label: string; icon: string; clases: string }> = {
  nueva: { label: 'Nueva', icon: 'fiber_new', clases: 'bg-primary-container/15 text-primary' },
  en_revision: { label: 'En revisión', icon: 'manage_search', clases: 'bg-tertiary-fixed/60 text-on-tertiary-fixed-variant' },
  atendida: { label: 'Atendida', icon: 'check_circle', clases: 'bg-surface-container text-secondary' },
  rechazada: { label: 'Rechazada', icon: 'block', clases: 'bg-error-container/60 text-on-error-container' },
  convertida_propuesta: { label: 'Convertida en propuesta', icon: 'request_quote', clases: 'bg-primary/10 text-primary' },
}

export const prioridadesSolicitud: Record<PrioridadSolicitud, { label: string; clases: string }> = {
  alta: { label: 'Prioridad alta', clases: 'bg-error/10 text-error' },
  media: { label: 'Prioridad media', clases: 'bg-tertiary/10 text-tertiary' },
  baja: { label: 'Prioridad baja', clases: 'bg-surface-container text-secondary' },
}

export const tiposPersona: Record<TipoPersona, string> = {
  fisica: 'Persona física',
  moral: 'Persona moral',
}

/** TODO: reemplazar por GET /catalogos/areas-juridicas cuando exista. */
export const areasJuridicas = [
  'Derecho Administrativo',
  'Derecho Civil',
  'Derecho Corporativo y Mercantil',
  'Derecho Familiar',
  'Derecho Fiscal',
  'Derecho Inmobiliario',
  'Derecho Laboral',
  'Propiedad Intelectual',
  'Protección de Datos',
]

export const solicitudesContent = {
  title: 'Solicitudes de clientes',
  subtitle: 'Revisa las solicitudes de servicios legales que te enviaron los clientes desde su aplicación.',
  filtros: {
    ariaLabel: 'Filtrar por estado',
    estados: [
      { valor: 'todas', label: 'Todas' },
      { valor: 'nueva', label: 'Nuevas' },
      { valor: 'en_revision', label: 'En revisión' },
      { valor: 'convertida_propuesta', label: 'Convertidas en propuesta' },
      { valor: 'atendida', label: 'Atendidas' },
    ] satisfies { valor: FiltroEstadoSolicitud; label: string }[],
    searchLabel: 'Buscar solicitudes',
    searchPlaceholder: 'Buscar por nombre del cliente o área jurídica',
    areaLabel: 'Área jurídica',
    areaAll: 'Todas las áreas',
    clear: 'Limpiar filtros',
  },
  table: {
    caption: 'Solicitudes de clientes',
    client: 'Cliente',
    matter: 'Necesidad o asunto',
    area: 'Área jurídica',
    date: 'Fecha',
    status: 'Estado',
    priority: 'Prioridad',
    action: 'Acción',
    view: 'Ver solicitud',
    noPriority: '—',
  },
  paginationLabel: 'solicitudes',
  porPagina: 8,
  loading: 'Cargando solicitudes…',
  empty: {
    title: 'No hay solicitudes con estos filtros',
    description: 'Prueba con otro estado, área o búsqueda.',
  },
}
