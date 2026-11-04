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
    // TODO: proteger la ruta cuando exista autenticación real
    path: ROUTES.dashboard,
    element: <PlaceholderPage id="B1" title="Dashboard del abogado" />,
  },
])
