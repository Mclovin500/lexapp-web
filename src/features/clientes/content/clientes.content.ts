import type { EstadoCliente, FiltroClientes } from '../types/clientes.types'

export const estadosCliente: Record<EstadoCliente, { label: string; icon: string; clases: string }> = {
  activo: { label: 'Activo', icon: 'verified', clases: 'bg-primary-container/15 text-primary' },
  en_propuesta: { label: 'En propuesta', icon: 'request_quote', clases: 'bg-tertiary/10 text-tertiary' },
  inactivo: { label: 'Sin casos abiertos', icon: 'pause_circle', clases: 'bg-surface-container-highest text-on-surface-variant' },
}

export const clientesContent = {
  title: 'Clientes',
  subtitle: 'Clientes con los que tienes una relación profesional en LexApp.',
  filters: {
    ariaLabel: 'Filtrar por estado del cliente',
    options: [
      { valor: 'todos', label: 'Todos' },
      { valor: 'activo', label: 'Activos' },
      { valor: 'en_propuesta', label: 'En propuesta' },
      { valor: 'inactivo', label: 'Sin casos abiertos' },
    ] satisfies { valor: FiltroClientes; label: string }[],
    searchLabel: 'Buscar clientes',
    searchPlaceholder: 'Buscar por nombre, empresa o correo',
  },
  table: {
    caption: 'Directorio de clientes',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    cases: 'Expedientes',
    activity: 'Última actividad',
    status: 'Estado',
    action: 'Acción',
    view: 'Ver cliente',
    noPhone: 'No registrado',
    casesCount: (total: number, abiertos: number) =>
      total === 0 ? 'Sin expedientes' : `${total} ${total === 1 ? 'expediente' : 'expedientes'} · ${abiertos} ${abiertos === 1 ? 'abierto' : 'abiertos'}`,
  },
  paginationLabel: 'clientes',
  porPagina: 8,
  loading: 'Cargando clientes…',
  empty: { title: 'No hay clientes con estos filtros', description: 'Prueba con otro estado o búsqueda.' },
}
