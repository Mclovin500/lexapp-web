// PROPUESTA: rutas por confirmar con el backend (ver docs/contrato-api-auth.md)
// Todas son relativas a VITE_API_URL. Cambiar aquí actualiza todos los servicios.
export const ENDPOINTS = {
  auth: {
    login: '/auth/login', // P02
    verificarCodigo: '/auth/verificar-codigo', // A2A
    reenviarCodigo: '/auth/reenviar-codigo', // A2A
    sesion: '/auth/sesion', // A1
    registro: '/auth/registro', // A3
    recuperacion: {
      solicitar: '/auth/recuperacion/solicitar', // A2B
      verificarCodigo: '/auth/recuperacion/verificar-codigo', // A2C
      reenviarCodigo: '/auth/recuperacion/reenviar-codigo', // A2C
      nuevaContrasena: '/auth/recuperacion/nueva-contrasena', // A2D
    },
  },
  registro: {
    verificarCorreo: '/registro/verificar-correo', // A3A
    reenviarCodigo: '/registro/reenviar-codigo', // A3A
    progreso: '/registro/progreso', // A4 y A5 (precarga)
    credenciales: '/registro/credenciales', // A4
    perfil: '/registro/perfil', // A5
    enviar: '/registro/enviar', // A5
  },
  abogado: {
    validacion: '/abogado/validacion', // A5A
  },
} as const
