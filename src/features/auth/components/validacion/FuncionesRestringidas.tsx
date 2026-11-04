import { Icon } from '@/components/ui/Icon'
import { validacionProfesionalContent } from '../../content/validacion-profesional.content'

/** A5A en `pendiente`: funciones que permanecen restringidas hasta la aprobación. */
export function FuncionesRestringidas() {
  const { restricted } = validacionProfesionalContent

  return (
    <section aria-labelledby="funciones-restringidas-titulo" className="rounded-xl bg-surface-container-low p-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="lock" size={20} className="text-secondary" />
        <h2 id="funciones-restringidas-titulo" className="text-headline-sm text-on-surface">
          {restricted.title}
        </h2>
      </div>
      <p className="text-body-sm text-on-surface-variant mb-4">{restricted.description}</p>
      <ul className="space-y-3">
        {restricted.items.map((item) => (
          <li key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest">
            <Icon name={item.icon} size={20} className="text-outline shrink-0 mt-0.5" />
            <div>
              <p className="text-label-md text-on-surface font-semibold">{item.title}</p>
              <p className="text-body-sm text-secondary">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
