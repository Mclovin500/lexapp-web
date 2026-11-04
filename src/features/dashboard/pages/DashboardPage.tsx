import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { EstadoCarga } from '@/components/ui/EstadoCarga'
import { EstadoError } from '@/components/ui/EstadoError'
import { formatearFechaLarga } from '@/lib/fechas'
import { AccesosRapidos } from '../components/AccesosRapidos'
import { ListaActividad } from '../components/ListaActividad'
import { ListaCobros } from '../components/ListaCobros'
import { ListaReuniones } from '../components/ListaReuniones'
import { ListaSolicitudesNuevas } from '../components/ListaSolicitudesNuevas'
import { PanelSeccion } from '../components/PanelSeccion'
import { TarjetaIndicador } from '../components/TarjetaIndicador'
import { dashboardContent } from '../content/dashboard.content'
import { useResumenDashboard } from '../hooks/useResumenDashboard'

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** B1: pantalla principal del abogado (especificación B1 y flujo 6.5: B1 → C1 → C2). */
export function DashboardPage() {
  const contenido = dashboardContent
  const resumen = useResumenDashboard()
  const datos = resumen.data

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-label-md text-secondary">{capitalizar(formatearFechaLarga(new Date()))}</p>
          <h1 className="mt-1 text-headline-lg text-on-surface tracking-tight">{contenido.greeting}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{contenido.intro}</p>
        </div>
        <AccesosRapidos />
      </div>

      {resumen.isPending && <EstadoCarga texto={contenido.loading} />}

      {resumen.isError && (
        <EstadoError
          mensaje={`${contenido.loadError} ${MENSAJES_ERROR_API[resumen.error.tipo]}`}
          onReintentar={() => void resumen.refetch()}
        />
      )}

      {datos && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <TarjetaIndicador {...contenido.indicators.solicitudesNuevas} valor={datos.indicadores.solicitudesNuevas} destacada />
            <TarjetaIndicador {...contenido.indicators.expedientesActivos} valor={datos.indicadores.expedientesActivos} />
            <TarjetaIndicador {...contenido.indicators.propuestasPendientes} valor={datos.indicadores.propuestasPendientes} />
            <TarjetaIndicador {...contenido.indicators.proximasReuniones} valor={datos.indicadores.proximasReuniones} />
          </div>

          <PanelSeccion
            id="dashboard-solicitudes"
            icon="notification_important"
            title={contenido.requests.title}
            subtitle={contenido.requests.pending(datos.indicadores.solicitudesNuevas)}
            accion={{ to: ROUTES.requests, label: contenido.requests.viewAll }}
            destacado
          >
            <ListaSolicitudesNuevas solicitudes={datos.solicitudesNuevas} />
          </PanelSeccion>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7">
              <PanelSeccion
                id="dashboard-reuniones"
                icon="videocam"
                title={contenido.meetings.title}
                subtitle={contenido.meetings.subtitle}
                accion={{ to: ROUTES.agenda, label: contenido.meetings.viewAgenda }}
              >
                <ListaReuniones reuniones={datos.proximasReuniones} />
              </PanelSeccion>
            </div>
            <div className="xl:col-span-5">
              <PanelSeccion
                id="dashboard-cobros"
                icon="payments"
                title={contenido.payments.title}
                accion={{ to: ROUTES.fees, label: contenido.payments.viewAll }}
              >
                <ListaCobros cobros={datos.cobrosRelevantes} />
              </PanelSeccion>
            </div>
          </div>

          <PanelSeccion id="dashboard-actividad" icon="history" title={contenido.activity.title}>
            <ListaActividad actividades={datos.actividadReciente} />
          </PanelSeccion>
        </>
      )}
    </div>
  )
}
