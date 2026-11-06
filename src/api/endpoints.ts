// PROPUESTA: rutas por confirmar con el backend (ver docs/contrato-api-auth.md)
// Todas son relativas a VITE_API_URL. Cambiar aquí actualiza todos los servicios.
export const ENDPOINTS = {
  auth: {
    login: '/auth/login', // P02
    cerrarSesion: '/auth/cerrar-sesion', // J1 "Cerrar sesión"
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
    documentos: '/registro/documentos', // A4 (POST multipart: cédula o título)
    foto: '/registro/foto', // A5 (POST multipart: fotografía profesional)
    perfil: '/registro/perfil', // A5
    enviar: '/registro/enviar', // A5
  },
  abogado: {
    validacion: '/abogado/validacion', // A5A
    cuenta: '/abogado/cuenta', // Header y Sidebar (nombre y contadores)
    perfil: '/abogado/perfil', // I1 (GET, PUT)
    foto: '/abogado/perfil/foto', // I1 (POST multipart, DELETE)
    datosPersonales: '/abogado/datos-personales', // J1 (GET, PUT)
    contrasena: '/abogado/contrasena', // J1 (POST cambiar)
    sesiones: '/abogado/sesiones', // J1 (GET lista, DELETE cerrar las demás)
    sesion: (id: string) => `/abogado/sesiones/${encodeURIComponent(id)}`, // J1 (DELETE)
    notificaciones: '/abogado/preferencias/notificaciones', // J1 (GET, PUT)
    privacidad: '/abogado/preferencias/privacidad', // J1 (GET, PUT)
    exportarDatos: '/abogado/privacidad/exportacion', // J1 (POST solicitar copia de datos)
    cuentaDeposito: '/abogado/cuenta-deposito', // J1A (GET, PUT)
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
  reuniones: {
    listado: '/reuniones', // G1 (GET calendario/próximas/historial, POST programar)
    inmediata: '/reuniones/inmediata', // H1 "Videollamada"
    detalle: (id: string) => `/reuniones/${encodeURIComponent(id)}`, // G1 consultar, G1A
    cancelar: (id: string) => `/reuniones/${encodeURIComponent(id)}/cancelar`, // G1
    sala: (id: string) => `/reuniones/${encodeURIComponent(id)}/sala`, // G1A (credencial del proveedor de video)
    finalizar: (id: string) => `/reuniones/${encodeURIComponent(id)}/finalizar`, // G1A
  },
  agenda: {
    disponibilidad: '/agenda/disponibilidad', // G1 "Crear disponibilidad" (GET, PUT)
  },
  conversaciones: {
    listado: '/conversaciones', // H1 (GET lista, POST abrir/crear)
    mensajes: (id: string) => `/conversaciones/${encodeURIComponent(id)}/mensajes`, // H1 (GET historial, POST enviar)
    leida: (id: string) => `/conversaciones/${encodeURIComponent(id)}/leida`, // H1 (POST marcar como leída)
    adjunto: (id: string, adjuntoId: string) =>
      `/conversaciones/${encodeURIComponent(id)}/adjuntos/${encodeURIComponent(adjuntoId)}/url`, // H1 descarga
  },
} as const
