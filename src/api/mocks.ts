/**
 * Único lugar donde se lee VITE_USAR_MOCKS.
 *
 * Uso obligatorio en los servicios:  `if (import.meta.env.DEV && USAR_MOCKS) { ... }`
 *
 * `import.meta.env.DEV` debe escribirse en cada `if`: Vite lo reemplaza por `false` en el
 * build de producción y así elimina el bloque y su `import('./x.mock')`. Esta constante,
 * al estar en otro módulo, no se reemplaza, y por sí sola dejaría los mocks en el bundle.
 */
export const USAR_MOCKS: boolean = import.meta.env.VITE_USAR_MOCKS === 'true'
