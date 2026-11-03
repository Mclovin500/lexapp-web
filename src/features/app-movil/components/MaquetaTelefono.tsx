import { Icon } from '@/components/ui/Icon'
import { appMovilContent } from '../content/app-movil.content'

/**
 * Ilustración decorativa de la app del cliente.
 * Todo su contenido está oculto para lectores de pantalla y se resume en `srDescription`.
 */
export function MaquetaTelefono() {
  const { mockup } = appMovilContent
  const { notification, client, activeCase, lawyer, nextEvent, tabs } = mockup

  return (
    <div className="relative flex justify-center items-center py-6">
      <p className="sr-only">{mockup.srDescription}</p>

      <div aria-hidden="true" className="relative">
        {/* Halo decorativo */}
        <div className="absolute -inset-4 bg-linear-to-tr from-primary-fixed/20 via-primary-container/10 to-transparent rounded-full blur-2xl -z-10" />

        {/* Notificación flotante */}
        <div className="absolute -top-3 -right-2 lg:-right-6 z-30 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl max-w-xs transition-transform hover:-translate-y-1 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <Icon name="gavel" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-label-sm font-bold text-primary uppercase">{notification.tag}</span>
                <span className="text-[10px] text-secondary">{notification.time}</span>
              </div>
              <p className="text-label-md font-semibold text-on-surface truncate">{notification.title}</p>
              <p className="text-[11px] text-on-surface-variant">{notification.detail}</p>
            </div>
          </div>
        </div>

        {/* Chip de seguridad flotante */}
        <div className="absolute bottom-12 -left-4 lg:-left-8 z-30 bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
          <span className="text-label-sm font-semibold text-on-surface">{mockup.secureChannel}</span>
        </div>

        {/* Chasis del teléfono */}
        <div className="relative w-[300px] sm:w-[320px] h-[610px] sm:h-[650px] bg-slate-900 rounded-[48px] p-3 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-800/80">
          <div className="absolute inset-0 rounded-[48px] pointer-events-none ring-1 ring-white/15" />

          {/* Pantalla */}
          <div className="w-full h-full bg-surface-container-lowest rounded-[38px] overflow-hidden flex flex-col relative select-none">
            {/* Barra de estado */}
            <div className="h-10 w-full pt-2.5 px-6 flex items-center justify-between z-20">
              <span className="text-[12px] font-bold text-on-surface">{mockup.statusTime}</span>
              <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-end px-1.5">
                <div className="w-2 h-2 rounded-full bg-primary-container/80 mr-1 animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <div className="flex items-center gap-1.5 text-on-surface">
                <Icon name="signal_cellular_alt" size={14} />
                <Icon name="wifi" size={14} />
                <Icon name="battery_full" size={16} />
              </div>
            </div>

            {/* Contenido de la app */}
            <div className="flex-1 overflow-hidden px-4 py-2 space-y-3.5">
              {/* Encabezado del cliente */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-bold text-sm shadow-sm">
                    {client.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-secondary uppercase font-semibold">{client.greeting}</span>
                    <span className="text-sm font-bold text-on-surface leading-tight">{client.name}</span>
                  </div>
                </div>
                <div className="relative w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <Icon name="notifications" size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error" />
                </div>
              </div>

              {/* Caso activo */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                    {activeCase.status}
                  </span>
                  <span className="text-[10px] text-secondary">{activeCase.docket}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface leading-snug">{activeCase.title}</p>
                  <p className="text-[11px] text-on-surface-variant">{activeCase.court}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-on-surface font-semibold">{activeCase.progressLabel}</span>
                    <span className="text-primary font-bold">{activeCase.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full"
                      style={{ width: `${activeCase.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-secondary block pt-0.5">{activeCase.stage}</span>
                </div>
              </div>

              {/* Abogado asignado */}
              <div className="p-3 rounded-2xl bg-surface-container-lowest shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-secondary">{lawyer.label}</span>
                  <span className="inline-flex items-center gap-1 text-[9px] text-primary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                    {lawyer.availability}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container shrink-0 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                    {lawyer.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-bold text-on-surface block truncate">{lawyer.name}</span>
                    <span className="text-[10px] text-on-surface-variant block">{lawyer.role}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-primary-container text-on-primary text-[11px] font-semibold shadow-xs">
                    <Icon name="chat" size={12} />
                    <span>{lawyer.messageAction}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-surface-container text-on-surface text-[11px] font-semibold">
                    <Icon name="call" size={12} />
                    <span>{lawyer.callAction}</span>
                  </div>
                </div>
              </div>

              {/* Próximo evento */}
              <div className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center">
                    <Icon name="event" size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-on-surface leading-tight">{nextEvent.title}</span>
                    <span className="text-[10px] text-on-surface-variant">{nextEvent.detail}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-secondary bg-surface-container px-2 py-1 rounded-md">
                  {nextEvent.time}
                </span>
              </div>
            </div>

            {/* Barra de navegación inferior */}
            <div className="h-14 bg-surface-container-lowest shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-4 flex items-center justify-around z-20">
              {tabs.map((tab) => (
                <div
                  key={tab.label}
                  className={`relative flex flex-col items-center gap-0.5 ${tab.active ? 'text-primary' : 'text-secondary'}`}
                >
                  <Icon name={tab.icon} size={20} filled={tab.active} />
                  {tab.badge && <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-primary-container" />}
                  <span className={`text-[9px] ${tab.active ? 'font-bold' : ''}`}>{tab.label}</span>
                </div>
              ))}
            </div>

            {/* Indicador de inicio */}
            <div className="h-3 w-full flex items-center justify-center pb-1">
              <div className="w-24 h-1 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
