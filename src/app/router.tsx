import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routes'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { BienvenidaPage } from '@/features/inicio-publico/pages/BienvenidaPage'
import { LoginPlaceholder } from '@/features/auth/pages/LoginPlaceholder'
import { RegisterPlaceholder } from '@/features/auth/pages/RegisterPlaceholder'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.home,
        element: <BienvenidaPage />,
      },
    ],
  },
  {
    path: ROUTES.login,
    element: <LoginPlaceholder />,
  },
  {
    path: ROUTES.register,
    element: <RegisterPlaceholder />,
  },
])
