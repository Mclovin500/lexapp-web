import { Container } from '@/components/ui/Container'
import { Icon } from '@/components/ui/Icon'
import { footerContent } from '../content/inicio-publico.content'

export function PublicFooter() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-2xl">
      <Container className="py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl">
          {/* Columna Marca */}
          <div className="lg:col-span-2 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary">
                <Icon name="balance" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-headline-sm font-semibold tracking-tight leading-none text-on-surface">
                  {footerContent.brandName}
                </span>
                <span className="mt-0.5 text-label-sm uppercase tracking-wider text-on-surface-variant leading-tight">
                  {footerContent.brandSubtitle}
                </span>
              </div>
            </div>
            <p className="max-w-md text-body-md text-on-surface-variant leading-relaxed">
              {footerContent.description}
            </p>
          </div>

          {/* Columna Plataforma */}
          <div className="flex flex-col gap-space-sm">
            <span className="text-label-md uppercase tracking-wider text-on-surface font-semibold">
              {footerContent.navColumn.title}
            </span>
            <ul className="flex flex-col gap-space-xs">
              {footerContent.navColumn.links.map((link) => (
                <li key={link.href} className="list-none">
                  <a
                    href={link.href}
                    className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Legal */}
          <div className="flex flex-col gap-space-sm">
            <span className="text-label-md uppercase tracking-wider text-on-surface font-semibold">
              {footerContent.legalColumn.title}
            </span>
            <ul className="flex flex-col gap-space-xs">
              {/* TODO: ruta cuando exista la página */}
              {footerContent.legalColumn.items.map((item) => (
                <li key={item} className="list-none">
                  <span className="text-body-sm text-on-surface-variant cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Soporte */}
          <div className="flex flex-col gap-space-sm">
            <span className="text-label-md uppercase tracking-wider text-on-surface font-semibold">
              {footerContent.supportColumn.title}
            </span>
            <ul className="flex flex-col gap-space-xs">
              {/* TODO: ruta cuando exista la página */}
              {footerContent.supportColumn.items.map((item) => (
                <li key={item} className="list-none">
                  <span className="text-body-sm text-on-surface-variant cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-space-md pt-space-lg text-center md:text-left border-t border-surface-container">
          <p className="text-body-sm text-on-surface-variant">{footerContent.copyright}</p>
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <Icon name="verified_user" size={16} className="text-primary" />
            <span className="text-label-sm font-medium">{footerContent.securityLabel}</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
