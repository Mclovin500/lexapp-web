import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { LandingPage } from '@/features/inicio-publico/pages/LandingPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SeleccionPerfilPage } from '@/features/auth/pages/SeleccionPerfilPage'
import { AppMovilPage } from '@/features/app-movil/pages/AppMovilPage'
import { BienvenidaPage } from '@/features/auth/pages/BienvenidaPage'
import { RegistroPage } from '@/features/auth/pages/RegistroPage'
import { VerificarCodigoPage } from '@/features/auth/pages/VerificarCodigoPage'
import { RecuperarContrasenaPage } from '@/features/auth/pages/RecuperarContrasenaPage'
import { CodigoRecuperacionPage } from '@/features/auth/pages/CodigoRecuperacionPage'
import { NuevaContrasenaPage } from '@/features/auth/pages/NuevaContrasenaPage'
import { VerificarCorreoPage } from '@/features/auth/pages/VerificarCorreoPage'
import { CredencialesPage } from '@/features/auth/pages/CredencialesPage'
import { PerfilProfesionalPage } from '@/features/auth/pages/PerfilProfesionalPage'
import { ValidacionProfesionalPage } from '@/features/auth/pages/ValidacionProfesionalPage'
import { PlaceholderPage } from '@/components/ui/PlaceholderPage'
import { AppLayout } from '@/components/layouts/AppLayout'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { NotificacionesPage } from '@/features/dashboard/pages/NotificacionesPage'
import { SolicitudesPage } from '@/features/solicitudes/pages/SolicitudesPage'
import { DetalleSolicitudPage } from '@/features/solicitudes/pages/DetalleSolicitudPage'

/** Pantallas internas aún no construidas: se muestran dentro del Sidebar y Header. */
const pendientes: { path: string; id: string; title: string }[] = [
  { path: ROUTES.newProposal, id: 'D1', title: 'Crear propuesta de servicio' },
  { path: ROUTES.proposals, id: 'D2', title: 'Seguimiento de propuestas' },
  { path: ROUTES.fees, id: 'D3', title: 'Honorarios y cobros' },
  { path: ROUTES.paymentDetail, id: 'D5', title: 'Detalle de pago y movimientos' },
  { path: ROUTES.cases, id: 'E1', title: 'Mis expedientes' },
  { path: ROUTES.caseDetail, id: 'E2', title: 'Detalle del expediente' },
  { path: ROUTES.caseDocuments, id: 'E3', title: 'Documentos del expediente' },
  { path: ROUTES.clients, id: 'F1', title: 'Directorio de clientes' },
  { path: ROUTES.agenda, id: 'G1', title: 'Agenda de citas virtuales' },
  { path: ROUTES.videoRoom, id: 'G1A', title: 'Sala de videollamada' },
  { path: ROUTES.chat, id: 'H1', title: 'Chat con clientes' },
  { path: ROUTES.profile, id: 'I1', title: 'Perfil profesional' },
  { path: ROUTES.settings, id: 'J1', title: 'Configuración' },
]

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.home,
        element: <LandingPage />,
      },
    ],
  },
  {
    path: ROUTES.welcome,
    element: <BienvenidaPage />,
  },
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.profileSelection,
    element: <SeleccionPerfilPage />,
  },
  {
    path: ROUTES.mobileApp,
    element: <AppMovilPage />,
  },
  {
    path: ROUTES.verifyCode,
    element: <VerificarCodigoPage />,
  },
  {
    path: ROUTES.recoverPassword,
    element: <RecuperarContrasenaPage />,
  },
  {
    path: ROUTES.recoveryCode,
    element: <CodigoRecuperacionPage />,
  },
  {
    path: ROUTES.newPassword,
    element: <NuevaContrasenaPage />,
  },
  {
    path: ROUTES.register,
    element: <RegistroPage />,
  },
  {
    path: ROUTES.verifyEmail,
    element: <VerificarCorreoPage />,
  },
  {
    path: ROUTES.registerCredentials,
    element: <CredencialesPage />,
  },
  {
    path: ROUTES.registerProfile,
    element: <PerfilProfesionalPage />,
  },
  {
    path: ROUTES.validationStatus,
    element: <ValidacionProfesionalPage />,
  },
  {
    // Panel del abogado: Sidebar + Header únicos (sección 7 de la especificación).
    // TODO: proteger estas rutas cuando exista autenticación real.
    element: <AppLayout />,
    children: [
      { path: ROUTES.dashboard, element: <DashboardPage /> },
      { path: ROUTES.notifications, element: <NotificacionesPage /> },
      { path: ROUTES.requests, element: <SolicitudesPage /> },
      { path: ROUTES.requestDetail, element: <DetalleSolicitudPage /> },
      ...pendientes.map(({ path, id, title }) => ({
        path,
        element: <PlaceholderPage id={id} title={title} interna />,
      })),
    ],
  },
])
