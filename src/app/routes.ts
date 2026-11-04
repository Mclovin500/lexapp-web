export const ROUTES = {
  home: '/',                               // P01
  welcome: '/bienvenida',                  // A1 (pantalla de carga)
  login: '/login',                         // P02
  profileSelection: '/seleccion-perfil',   // P03
  mobileApp: '/app-movil',                 // P04
  verifyCode: '/verificar-codigo',         // A2A
  recoverPassword: '/recuperar-contrasena',// A2B
  recoveryCode: '/codigo-recuperacion',    // A2C
  newPassword: '/nueva-contrasena',        // A2D
  register: '/registro',                   // A3
  verifyEmail: '/verificar-correo',        // A3A
  registerCredentials: '/registro/credenciales', // A4
  registerProfile: '/registro/perfil',     // A5
  validationStatus: '/validacion-profesional',   // A5A
  dashboard: '/dashboard',                 // B1
  notifications: '/notificaciones',        // B1A
  requests: '/solicitudes',                // C1
  requestDetail: '/solicitudes/:solicitudId', // C2
  newProposal: '/propuestas/nueva',        // D1
  editProposal: '/propuestas/:propuestaId/editar', // D1 (editar borrador)
  proposals: '/propuestas',                // D2
  fees: '/honorarios',                     // D3
  newCharge: '/honorarios/cobros/nuevo',   // D4
  paymentDetail: '/honorarios/movimientos/:movimientoId', // D5
  cases: '/expedientes',                   // E1
  caseDetail: '/expedientes/:expedienteId', // E2
  caseDocuments: '/expedientes/:expedienteId/documentos', // E3
  clients: '/clientes',                    // F1
  clientDetail: '/clientes/:clienteId',    // F2
  agenda: '/agenda',                       // G1
  videoRoom: '/agenda/sala/:reunionId',    // G1A
  chat: '/chat',                           // H1
  profile: '/perfil',                      // I1
  settings: '/configuracion',              // J1
  depositAccount: '/configuracion/cuenta-deposito', // J1A
} as const
