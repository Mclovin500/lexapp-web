const formatoFechaHora = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
const formatoFechaLarga = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const formatoHora = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' })
const formatoDiaCorto = new Intl.DateTimeFormat('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
const relativo = new Intl.RelativeTimeFormat('es-MX', { numeric: 'auto' })

function aFecha(iso: string): Date | null {
  const fecha = new Date(iso)
  return Number.isNaN(fecha.getTime()) ? null : fecha
}

/** Fecha local de hoy en formato AAAA-MM-DD (para inputs `type="date"`). */
export function hoyIso(): string {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}

/** "20 nov 2026" a partir de AAAA-MM-DD (sin desfase por zona horaria). */
export function formatearFechaCorta(fechaIso: string): string {
  const [anio, mes, dia] = fechaIso.slice(0, 10).split('-').map(Number)
  if (!anio || !mes || !dia) return fechaIso
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(anio, mes - 1, dia))
}

/** "4 nov 2026, 09:15" */
export function formatearFechaHora(iso: string): string {
  const fecha = aFecha(iso)
  return fecha ? formatoFechaHora.format(fecha) : iso
}

/** "miércoles, 4 de noviembre de 2026" */
export function formatearFechaLarga(fecha: Date): string {
  return formatoFechaLarga.format(fecha)
}

/** "09:15" */
export function formatearHora(iso: string): string {
  const fecha = aFecha(iso)
  return fecha ? formatoHora.format(fecha) : iso
}

/** "mié 4 nov" */
export function formatearDiaCorto(iso: string): string {
  const fecha = aFecha(iso)
  return fecha ? formatoDiaCorto.format(fecha) : iso
}

/** "hace 24 minutos", "en 45 minutos", "ayer"… */
export function formatearRelativa(iso: string, ahora: number = Date.now()): string {
  const fecha = aFecha(iso)
  if (!fecha) return iso
  const segundos = Math.round((fecha.getTime() - ahora) / 1000)
  const abs = Math.abs(segundos)
  if (abs < 60) return relativo.format(segundos, 'second')
  if (abs < 3600) return relativo.format(Math.round(segundos / 60), 'minute')
  if (abs < 86_400) return relativo.format(Math.round(segundos / 3600), 'hour')
  return relativo.format(Math.round(segundos / 86_400), 'day')
}
