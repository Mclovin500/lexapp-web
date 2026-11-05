/** Catálogo de bancos por clave CLABE (3 dígitos). TODO: GET /catalogos/bancos */
export const BANCOS: { clave: string; nombre: string }[] = [
  { clave: '002', nombre: 'Banamex' },
  { clave: '012', nombre: 'BBVA México' },
  { clave: '014', nombre: 'Santander' },
  { clave: '021', nombre: 'HSBC' },
  { clave: '030', nombre: 'BanBajío' },
  { clave: '036', nombre: 'Inbursa' },
  { clave: '044', nombre: 'Scotiabank' },
  { clave: '058', nombre: 'Banregio' },
  { clave: '072', nombre: 'Banorte' },
  { clave: '127', nombre: 'Banco Azteca' },
  { clave: '137', nombre: 'BanCoppel' },
  { clave: '646', nombre: 'STP' },
]

const PESOS = [3, 7, 1]

/** Dígito de control de una CLABE a partir de sus primeros 17 dígitos (algoritmo de Banxico). */
export function digitoControlClabe(primeros17: string): number {
  const suma = [...primeros17].reduce((total, digito, i) => total + ((Number(digito) * PESOS[i % 3]) % 10), 0)
  return (10 - (suma % 10)) % 10
}

export type ProblemaClabe = 'longitud' | 'digitos' | 'control' | 'banco' | 'tarjeta'

/** Valida estructura, dígito de control y banco. Detecta si se escribió un número de tarjeta. */
export function validarClabe(clabe: string): { banco: (typeof BANCOS)[number] | null; problema: ProblemaClabe | null } {
  if (!/^\d*$/.test(clabe)) return { banco: null, problema: 'digitos' }
  if (clabe.length === 15 || clabe.length === 16) return { banco: null, problema: 'tarjeta' }
  if (clabe.length !== 18) return { banco: null, problema: 'longitud' }
  if (digitoControlClabe(clabe.slice(0, 17)) !== Number(clabe[17])) return { banco: null, problema: 'control' }
  const banco = BANCOS.find((b) => b.clave === clabe.slice(0, 3)) ?? null
  return { banco, problema: banco ? null : 'banco' }
}

/** "012 180 00123456789 7" para leerla mejor. */
export function formatearClabe(clabe: string): string {
  return [clabe.slice(0, 3), clabe.slice(3, 6), clabe.slice(6, 17), clabe.slice(17)].filter(Boolean).join(' ')
}
