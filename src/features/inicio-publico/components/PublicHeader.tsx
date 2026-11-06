import { useState } from 'react'
import { ROUTES } from '@/app/routes'
import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { BotonTema } from '@/components/ui/BotonTema'
import { navItems } from '../content/inicio-publico.content'

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <Container className="flex h-20 items-center justify-between gap-2 sm:gap-space-lg">
        {/* Logotipo */}
        <a href="#inicio" className="group flex shrink-0 items-center gap-space-xs sm:gap-space-sm text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-primary transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container">
            <Icon name="balance" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-headline-sm font-semibold tracking-tight leading-none text-on-surface">
              LexApp
            </span>
            <span className="mt-0.5 text-label-sm uppercase tracking-wider text-on-surface-variant leading-tight">
              LEGAL SUITE
            </span>
          </div>
        </a>

        {/* Navegación Desktop */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-space-lg">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`transition-colors text-label-lg ${
                index === 0
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Acciones Desktop */}
        <div className="hidden sm:flex shrink-0 items-center gap-space-sm">
          <BotonTema />
          <Button variant="ghost" size="md" to={ROUTES.login}>
            Iniciar sesión
          </Button>
          <Button variant="primary" size="md" to={ROUTES.profileSelection}>
            Comenzar
          </Button>
        </div>

        {/* Botón Móvil Hamburguesa */}
        <div className="flex shrink-0 items-center gap-1.5 sm:hidden">
          <Button variant="primary" size="sm" to={ROUTES.profileSelection}>
            Comenzar
          </Button>
          <BotonTema />
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>

        {/* Botón hamburguesa visible solo en tablet (sm a lg) */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={mobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
          className="hidden sm:flex lg:hidden h-10 w-10 items-center justify-center rounded-lg text-on-surface hover:bg-surface-container transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
        </button>
      </Container>

      {/* Menú Móvil / Tablet Dropdown (< lg) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-surface-container bg-surface-container-lowest px-gutter py-space-md lg:hidden shadow-lg"
        >
          <nav aria-label="Navegación móvil" className="flex flex-col gap-space-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-lg px-space-sm py-2 text-label-lg font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-space-sm flex flex-col gap-space-sm border-t border-surface-container pt-space-sm sm:hidden">
              <Button variant="ghost" size="md" to={ROUTES.login} onClick={closeMobileMenu}>
                Iniciar sesión
              </Button>
              <Button variant="primary" size="md" to={ROUTES.profileSelection} onClick={closeMobileMenu}>
                Comenzar
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
