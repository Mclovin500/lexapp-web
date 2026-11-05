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
    cuenta: '/abogado/cuenta', // Header y Sidebar (nombre y contadores)
  },
  dashboard: {
    resumen: '/dashboard/resumen', // B1
  },
  notificaciones: {
    listado: '/notificaciones', // B1A
    detalle: (id: string) => `/notificaciones/${encodeURIComponent(id)}`, // B1A (marcar como leída)
    marcarTodasLeidas: '/notificaciones/marcar-todas-leidas', // B1A
  },
  solicitudes: {
    listado: '/solicitudes', // C1
    opciones: '/solicitudes/opciones', // D1 "Solicitud relacionada" (?clienteId=)
    detalle: (id: string) => `/solicitudes/${encodeURIComponent(id)}`, // C2
    revisar: (id: string) => `/solicitudes/${encodeURIComponent(id)}/revisar`, // C2 "Revisar información"
    rechazar: (id: string) => `/solicitudes/${encodeURIComponent(id)}/rechazar`, // C2
  },
  propuestas: {
    listado: '/propuestas', // D2 (GET) y D1 (POST crear)
    detalle: (id: string) => `/propuestas/${encodeURIComponent(id)}`, // D2 ver / D1 editar (GET, PUT)
    cancelar: (id: string) => `/propuestas/${encodeURIComponent(id)}/cancelar`, // D2
    crearExpediente: (id: string) => `/propuestas/${encodeURIComponent(id)}/expediente`, // D2 (aceptada)
  },
  honorarios: {
    resumen: '/honorarios/resumen', // D3
    movimientos: '/honorarios/movimientos', // D3 listado
    movimiento: (id: string) => `/honorarios/movimientos/${encodeURIComponent(id)}`, // D5
    cobros: '/honorarios/cobros', // D4 (POST crear cobro adicional)
  },
  clientes: {
    opciones: '/clientes/opciones', // D1, D4 (selectores)
    listado: '/clientes', // F1
    detalle: (id: string) => `/clientes/${encodeURIComponent(id)}`, // F2
  },
  expedientes: {
    opciones: '/expedientes/opciones', // D4 (?clienteId=)
    listado: '/expedientes', // E1
    detalle: (id: string) => `/expedientes/${encodeURIComponent(id)}`, // E2
    actualizaciones: (id: string) => `/expedientes/${encodeURIComponent(id)}/actualizaciones`, // E2 (POST)
    estado: (id: string) => `/expedientes/${encodeURIComponent(id)}/estado`, // E2 (PATCH)
    documentos: (id: string) => `/expedientes/${encodeURIComponent(id)}/documentos`, // E3 (GET listado, POST cargar)
    documento: (id: string, documentoId: string) =>
      `/expedientes/${encodeURIComponent(id)}/documentos/${encodeURIComponent(documentoId)}`, // E3 (PATCH revisar)
    urlDocumento: (id: string, documentoId: string) =>
      `/expedientes/${encodeURIComponent(id)}/documentos/${encodeURIComponent(documentoId)}/url`, // E3 vista previa y descarga
  },
} as const
