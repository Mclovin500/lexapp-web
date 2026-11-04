import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { nuevaContrasenaContent } from '../../content/nueva-contrasena.content'

/** A2D tras guardar: confirmación y acceso a P02. */
export function ConfirmacionContrasena() {
  const { success } = nuevaContrasenaContent

  return (
    <div className="flex flex-col items-center text-center py-6" role="status">
      <div className="w-16 h-16 rounded-full bg-primary-container/15 flex items-center justify-center text-primary-container mb-5">
        <Icon name="check_circle" size={40} filled />
      </div>
      <span className="text-label-sm uppercase tracking-wider text-primary font-semibold mb-2">
        {success.tag}
      </span>
      <h1 className="text-headline-lg text-on-surface tracking-tight mb-3">{success.title}</h1>
      <p className="text-body-md text-secondary max-w-md leading-relaxed mb-8">{success.description}</p>
      <Link
        to={ROUTES.login}
        replace
        className="inline-flex h-12 px-6 items-center justify-center gap-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-label-lg font-semibold shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span>{success.loginButton}</span>
        <Icon name="login" size={20} />
      </Link>
    </div>
  )
}
