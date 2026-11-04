// Utilidades exclusivas de los archivos *.mock.ts (nunca importar desde la UI ni desde servicios).

/** Latencia simulada de la red en los mocks (ms). */
export const LATENCIA_MOCK = 700

/**
 * Cambia a `true` para simular que el servidor no responde en todos los mocks
 * que llaman a `simularRed()`.
 */
export const SIMULAR_ERROR_RED = false

/** Espera la latencia simulada. */
export function esperar(ms: number = LATENCIA_MOCK): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
