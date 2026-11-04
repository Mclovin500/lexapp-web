/** Importe capturado como texto: hasta 8 enteros y 2 decimales, mayor que cero. */
export const PATRON_IMPORTE = /^\d{1,8}(\.\d{1,2})?$/

export function esImporteValido(texto: string): boolean {
  return PATRON_IMPORTE.test(texto.trim()) && Number(texto) > 0
}

/** Suma importes en centavos para evitar errores de redondeo. */
export function sumarImportes(importes: number[]): number {
  return importes.reduce((total, importe) => total + Math.round(importe * 100), 0) / 100
}
