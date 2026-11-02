import { Outlet } from 'react-router-dom'
import { PublicHeader } from '@/features/inicio-publico/components/PublicHeader'
import { PublicFooter } from '@/features/inicio-publico/components/PublicFooter'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-sans text-on-surface antialiased">
      <PublicHeader />
      <main id="main-content" className="w-full flex-1 pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
