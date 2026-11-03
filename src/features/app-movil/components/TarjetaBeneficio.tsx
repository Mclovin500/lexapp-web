import { Icon } from '@/components/ui/Icon'

interface TarjetaBeneficioProps {
  icon: string
  title: string
  description: string
}

export function TarjetaBeneficio({ icon, title, description }: TarjetaBeneficioProps) {
  return (
    <article className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-3">
        <Icon name={icon} size={20} />
      </div>
      <div>
        <h2 className="text-[15px] font-semibold text-on-surface leading-snug mb-1">{title}</h2>
        <p className="text-body-sm text-on-surface-variant leading-relaxed">{description}</p>
      </div>
    </article>
  )
}
