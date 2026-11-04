const formatoMxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

/** "$45,000.00" (MXN). El importe llega del backend en pesos. */
export function formatearMonto(monto: number): string {
  return formatoMxn.format(monto)
}
