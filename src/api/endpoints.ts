// PROPUESTA: rutas por confirmar con el backend (ver docs/contrato-api-auth.md)
// Todas son relativas a VITE_API_URL. Cambiar aquí actualiza todos los servicios.
export const ENDPOINTS = {
  auth: {
    login: '/auth/login', // P02
    verificarCodigo: '/auth/verificar-codigo', // A2A
    sesion: '/auth/sesion', // A1
    registro: '/auth/registro', // A3
  },
} as const
