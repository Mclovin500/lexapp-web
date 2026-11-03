import { Icon } from '@/components/ui/Icon'
import { loginContent } from '../content/login.content'

export function PanelInstitucional() {
  const { institutionalPanel } = loginContent
  const { cards, metrics } = institutionalPanel

  return (
    <section className="hidden lg:flex flex-col justify-between p-16 bg-inverse-surface text-inverse-on-surface relative overflow-hidden">
      {/* Fondos decorativos con gradiente sutil */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-tertiary/10 blur-3xl pointer-events-none" />

      {/* Cabecera de propuesta de valor */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/10 text-primary-fixed font-label-sm text-label-sm font-semibold tracking-wider uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed" />
          <span>{institutionalPanel.tag}</span>
        </div>
        <h2 className="font-display-lg text-display-lg font-bold text-white tracking-tight leading-snug mb-4 max-w-xl">
          {institutionalPanel.title}
        </h2>
        <p className="font-body-lg text-body-lg text-inverse-on-surface/80 max-w-lg leading-relaxed">
          {institutionalPanel.description}
        </p>
      </div>

      {/* Composición gráfica central: maquetas de interfaz jurídica */}
      <div className="relative z-10 my-10 space-y-4">
        {/* Tarjeta 1: Expediente Activo */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest/10 backdrop-blur-md shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                <Icon name="folder_special" size={20} />
              </div>
              <div>
                <span className="block font-label-lg text-label-lg font-bold text-white">
                  {cards.activeCase.docketNumber}
                </span>
                <span className="block font-label-sm text-label-sm text-inverse-on-surface/70">
                  {cards.activeCase.court}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-primary-fixed/20 text-primary-fixed font-label-sm text-label-sm font-semibold flex items-center gap-1">
              <Icon name="verified" size={14} />
              <span>{cards.activeCase.verificationBadge}</span>
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center font-label-sm text-label-sm">
              <span className="text-inverse-on-surface/70">
                {cards.activeCase.phaseLabel}
              </span>
              <span className="text-primary-fixed font-semibold">
                {cards.activeCase.termLabel}
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full"
                style={{ width: `${cards.activeCase.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mosaico inferior de 2 tarjetas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Tarjeta 2: Notificaciones y Citas */}
          <div className="p-4 rounded-xl bg-surface-container-lowest/10 backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-2 mb-2 text-primary-fixed font-label-md text-label-md font-semibold">
              <Icon name="notifications_active" size={18} />
              <span>{cards.termAlert.tag}</span>
            </div>
            <p className="font-label-sm text-label-sm text-white font-medium">
              {cards.termAlert.title}
            </p>
            <p className="font-body-sm text-body-sm text-inverse-on-surface/60 mt-1">
              {cards.termAlert.description}
            </p>
          </div>

          {/* Tarjeta 3: Canal Cifrado */}
          <div className="p-4 rounded-xl bg-surface-container-lowest/10 backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-2 mb-2 text-primary-fixed font-label-md text-label-md font-semibold">
              <Icon name="lock_reset" size={18} />
              <span>{cards.encryptedChannel.tag}</span>
            </div>
            <p className="font-label-sm text-label-sm text-white font-medium">
              {cards.encryptedChannel.title}
            </p>
            <p className="font-body-sm text-body-sm text-inverse-on-surface/60 mt-1">
              {cards.encryptedChannel.description}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas institucionales al pie */}
      <div className="relative z-10 pt-6 border-t-0 flex items-center justify-between">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="flex items-center">
            {index > 0 && <div className="h-8 w-px bg-white/20 mr-8" />}
            <div>
              <div
                className={`font-headline-lg text-headline-lg font-bold tracking-tight ${
                  metric.highlight ? 'text-primary-fixed' : 'text-white'
                }`}
              >
                {metric.value}
              </div>
              <div className="font-label-sm text-label-sm text-inverse-on-surface/60">
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

