import type { FiltroExpedientes } from '../types/expedientes.types'

export const expedientesContent = {
  title: 'Mis expedientes',
  subtitle: 'Todos los casos que administras, con su estado y su última actualización.',
  filters: {
    ariaLabel: 'Filtrar por estado del expediente',
    options: [
      { valor: 'todos', label: 'Todos' },
      { valor: 'activo', label: 'Activos' },
      { valor: 'en_espera', label: 'En espera' },
      { valor: 'finalizado', label: 'Finalizados' },
    ] satisfies { valor: FiltroExpedientes; label: string }[],
    searchLabel: 'Buscar expedientes',
    searchPlaceholder: 'Buscar por número, cliente o asunto',
    areaLabel: 'Área jurídica',
    areaAll: 'Todas las áreas',
    clear: 'Limpiar filtros',
  },
  table: {
    caption: 'Expedientes del abogado',
    id: 'Identificador',
    client: 'Cliente',
    subject: 'Asunto',
    area: 'Área jurídica',
    status: 'Estado',
    date: 'Fecha de apertura',
    updated: 'Última actualización',
    action: 'Acción',
    view: 'Ver expediente',
  },
  paginationLabel: 'expedientes',
  porPagina: 8,
  loading: 'Cargando expedientes…',
  empty: {
    title: 'No hay expedientes con estos filtros',
    description: 'Los expedientes se crean cuando un cliente acepta tu propuesta.',
    proposals: 'Ir a propuestas',
  },
}
