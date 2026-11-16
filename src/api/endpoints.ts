// Todas son relativas a VITE_API_URL. Cambiar aquí actualiza todos los servicios.
// Rutas reales del backend (Back_Lexapp/controllers): auth, registro, verificación,
// recuperación, abogado.validacion, solicitudes, propuestas, perfilCambios y casos.
// El resto siguen siendo PROPUESTA (ver docs/contrato-api-*.md).
export const ENDPOINTS = {
  auth: {
    login: '/auth/login', // P02 (AuthController): devuelve el JWT
    sesion: '/auth/sesion', // A1 y RutaProtegida (AuthController, requiere Bearer)
    cerrarSesion: '/auth/cerrar-sesion', // J1 "Cerrar sesión" (PROPUESTA: no existe en el backend)
  },
  registro: {
    abogado: '/Registro/abogado', // A5 "Crear mi cuenta": POST multipart con lo capturado en A3, A4 y A5
  },
  verificacion: {
    enviar: '/Verificacion/enviar', // A3A enviar / reenviar el código al correo
    verificar: '/Verificacion/verificar', // A3A validar el código
  },
  recuperacion: {
    solicitar: '/PasswordReset/solicitar', // A2B y "Reenviar" en A2C
    verificar: '/PasswordReset/verificar', // A2C (valida sin consumir el código)
    confirmar: '/PasswordReset/confirmar', // A2D (código + nueva contraseña)
  },
  abogado: {
    validacion: '/abogado/validacion', // A5A (AbogadosController, rol abogado)
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
    bandeja: '/solicitudes-caso/abogado/bandeja', // C1, C2, B1 (solo las pendientes del abogado)
    rechazar: (id: string) => `/solicitudes-caso/abogado/${encodeURIComponent(id)}/rechazar`, // C2
    propuesta: (id: string) => `/solicitudes-caso/abogado/${encodeURIComponent(id)}/propuesta`, // D1 (AbogadoVerificado)
  },
  propuestas: {
    seguimiento: '/propuestas/abogado/seguimiento', // D2 (?estado=&buscar=)
    seguimientoDetalle: (id: string) => `/propuestas/abogado/seguimiento/${encodeURIComponent(id)}`, // D2 ver
    detalle: (id: string) => `/propuestas/${encodeURIComponent(id)}`, // D2 ver (id de la solicitud de origen)
  },
  perfilCambios: {
    listado: '/perfil/solicitudes', // I1 historial de solicitudes de cambio
    cedula: '/perfil/abogado/solicitudes/cedula', // I1 (multipart)
    tarifa: '/perfil/abogado/solicitudes/tarifa', // I1
    experiencia: '/perfil/abogado/solicitudes/experiencia', // I1
  },
  casos: {
    misCasos: '/casos/mis-casos', // E1, H1, G1, D3, F1 (CasosController)
    detalle: (id: string) => `/casos/${encodeURIComponent(id)}`, // E2
    documentos: (id: string) => `/casos/${encodeURIComponent(id)}/documentos`, // E3 (GET listado, POST multipart)
    mensajes: (id: string) => `/casos/${encodeURIComponent(id)}/mensajes`, // H1 (GET historial, POST enviar)
    citas: (id: string) => `/casos/${encodeURIComponent(id)}/citas`, // G1 (GET, POST agendar)
    estadoCita: (id: string, citaId: string) =>
      `/casos/${encodeURIComponent(id)}/citas/${encodeURIComponent(citaId)}/estado`, // G1 cancelar / finalizar (PATCH)
    facturas: (id: string) => `/casos/${encodeURIComponent(id)}/facturas`, // D3 (GET), D4 (POST cobro)
    factura: (id: string, facturaId: string) =>
      `/casos/${encodeURIComponent(id)}/facturas/${encodeURIComponent(facturaId)}`, // D5
  },
} as const
