import type { FiltroMovimientos } from '../types/pagos.types'

export const honorariosContent = {
  title: 'Honorarios y Cobros',
  subtitle: 'Consulta tus ingresos, los pagos de tus clientes y el historial de cobros.',
  actions: {
    newCharge: 'Crear cobro adicional',
    proposals: 'Consultar propuestas',
    depositAccount: 'Cuenta de depósito',
  },
  // Regla 9.1 de la especificación.
  clientPaysNote:
    'Tus clientes pagan desde su aplicación móvil. En LexApp web solo creas cobros y consultas su estado; nunca se capturan tarjetas del cliente.',
  summary: {
    ariaLabel: 'Resumen de ingresos',
    ingresosTotales: { label: 'Ingresos totales', detail: 'Pagado, retenido y liberado', icon: 'query_stats' },
    pagosRecibidos: { label: 'Pagos recibidos', detail: 'Confirmados por la pasarela', icon: 'account_balance_wallet' },
    pagosPendientes: { label: 'Pagos pendientes', detail: 'Cobros sin pagar', icon: 'schedule' },
    fondosRetenidos: { label: 'Fondos retenidos', detail: 'Se liberan al cumplir lo acordado', icon: 'lock_clock' },
    fondosLiberados: { label: 'Fondos liberados', detail: 'Enviados a tu cuenta de depósito', icon: 'lock_open' },
    loadError: 'No pudimos cargar el resumen de ingresos.',
  },
  history: { title: 'Historial de cobros' },
  filters: {
    ariaLabel: 'Filtrar por estado del pago',
    options: [
      { valor: 'todos', label: 'Todos' },
      { valor: 'pendiente', label: 'Pendientes' },
      { valor: 'pagado', label: 'Pagados' },
      { valor: 'en_proceso', label: 'En proceso' },
      { valor: 'rechazado', label: 'Rechazados' },
      { valor: 'retenido', label: 'Retenidos' },
      { valor: 'liberado', label: 'Liberados' },
    ] satisfies { valor: FiltroMovimientos; label: string }[],
    searchLabel: 'Buscar cobros',
    searchPlaceholder: 'Buscar por cliente, expediente o concepto',
    byProposal: (id: string) => `Movimientos de la propuesta ${id}`,
    clearProposal: 'Quitar filtro de propuesta',
  },
  table: {
    caption: 'Historial de cobros',
    client: 'Cliente',
    case: 'Expediente',
    concept: 'Concepto',
    amount: 'Importe',
    date: 'Fecha',
    status: 'Estado',
    action: 'Acción',
    view: 'Ver detalle',
    noCase: 'Sin expediente',
    fromProposal: 'Honorarios de propuesta',
    additional: 'Cobro adicional',
  },
  paginationLabel: 'movimientos',
  porPagina: 8,
  loading: 'Cargando cobros…',
  empty: { title: 'No hay cobros con estos filtros', description: 'Prueba con otro estado o búsqueda.' },
}
