import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { LandingPage } from '@/features/inicio-publico/pages/LandingPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
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
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.profileSelection,
    element: <PlaceholderPage id="P03" title="Selección de perfil" />,
  },
  {
    path: ROUTES.mobileApp,
    element: <PlaceholderPage id="P04" title="App móvil para clientes" />,
  },
  {
    path: ROUTES.verifyCode,
    element: <PlaceholderPage id="A2A" title="Verificación de código" />,
  },
  {
    path: ROUTES.recoverPassword,
    element: <PlaceholderPage id="A2B" title="Recuperar contraseña" />,
  },
  {
    path: ROUTES.recoveryCode,
    element: <PlaceholderPage id="A2C" title="Código de recuperación" />,
  },
  {
    path: ROUTES.newPassword,
    element: <PlaceholderPage id="A2D" title="Nueva contraseña" />,
  },
  {
    path: ROUTES.register,
    element: <PlaceholderPage id="A3" title="Registro: datos básicos" />,
  },
  {
    path: ROUTES.verifyEmail,
    element: <PlaceholderPage id="A3A" title="Verificación de correo" />,
  },
  {
    path: ROUTES.registerCredentials,
    element: <PlaceholderPage id="A4" title="Registro: credenciales profesionales" />,
  },
  {
    path: ROUTES.registerProfile,
    element: <PlaceholderPage id="A5" title="Registro: área de práctica y perfil" />,
  },
  {
    path: ROUTES.validationStatus,
    element: <PlaceholderPage id="A5A" title="Estado de validación profesional" />,
  },
  {
    // TODO: proteger la ruta cuando exista autenticación real
    path: ROUTES.dashboard,
    element: <PlaceholderPage id="B1" title="Dashboard del abogado" />,
  },
])
