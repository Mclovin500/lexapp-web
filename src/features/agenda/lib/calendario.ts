/** Utilidades del calendario de G1 (fechas locales en formato AAAA-MM-DD). */

/** Mismas reglas que el backend (ver contrato): la sala abre 60 min antes y cierra 30 min después. */
export const SALA_ABRE_ANTES_MIN = 60
export const SALA_CIERRA_DESPUES_MIN = 30

export function aFechaLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
}

export function deFechaLocal(texto: string): Date | null {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto)
  if (!coincidencia) return null
  const fecha = new Date(Number(coincidencia[1]), Number(coincidencia[2]) - 1, Number(coincidencia[3]))
  return Number.isNaN(fecha.getTime()) || aFechaLocal(fecha) !== texto ? null : fecha
}

/** 42 días (6 semanas) que se muestran en la cuadrícula del mes, empezando en lunes. */
export function diasDeCuadricula(mes: Date): Date[] {
  const primero = new Date(mes.getFullYear(), mes.getMonth(), 1)
  const desfase = (primero.getDay() + 6) % 7
  return Array.from({ length: 42 }, (_, i) => new Date(primero.getFullYear(), primero.getMonth(), 1 - desfase + i))
}

export function sumarMeses(fecha: Date, meses: number): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth() + meses, 1)
}

/** "noviembre de 2026" */
export function nombreMes(fecha: Date): string {
  return new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(fecha)
}

/** Si la sala de una reunión abierta ya se puede usar. */
export function salaDisponible(inicio: string, fin: string, ahora: number): boolean {
  return ahora >= Date.parse(inicio) - SALA_ABRE_ANTES_MIN * 60_000 && ahora <= Date.parse(fin) + SALA_CIERRA_DESPUES_MIN * 60_000
}

/** "1 h 05 min", "28 min 42 s" */
export function formatearDuracion(segundos: number): string {
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = Math.floor(segundos % 60)
  if (h > 0) return `${h} h ${String(m).padStart(2, '0')} min`
  return m > 0 ? `${m} min ${String(s).padStart(2, '0')} s` : `${s} s`
}

/** Cronómetro "00:24:18". */
export function formatearCronometro(segundos: number): string {
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = Math.floor(segundos % 60)
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}
