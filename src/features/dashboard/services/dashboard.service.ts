// B1: el backend no tiene `GET /dashboard/resumen`. El resumen se arma con lo que sí existe:
// expedientes (dashboard), bandeja de solicitudes, seguimiento de propuestas, citas y facturas.
// Si una parte falla, esa sección se muestra vacía en lugar de tumbar todo el panel.
import { USAR_MOCKS } from '@/api/mocks'
import { listarReuniones } from '@/features/agenda/services/agenda.service'
import { obtenerDashboardExpedientesApi, type DashboardExpedientesApi } from '@/features/expedientes/services/casos.api'
import { listarMovimientos } from '@/features/pagos/services/pagos.service'
import { listarPropuestas } from '@/features/propuestas/services/propuestas.service'
import { listarSolicitudes } from '@/features/solicitudes/services/solicitudes.service'
import type { ActividadReciente, ResumenDashboard } from '../types/dashboard.types'

const MAXIMO_LISTA = 3
const MAXIMO_ACTIVIDAD = 5

function valor<T>(resultado: PromiseSettledResult<T>): T | null {
  return resultado.status === 'fulfilled' ? resultado.value : null
}

/** Últimos expedientes con movimiento: mensajes sin leer o actualización reciente. */
function actividadDe(dashboard: DashboardExpedientesApi | null): ActividadReciente[] {
  if (!dashboard) return []
  return [...dashboard.expedientes]
    .sort((a, b) => b.ultimaActualizacion.localeCompare(a.ultimaActualizacion))
    .slice(0, MAXIMO_ACTIVIDAD)
    .map((e) =>
      e.mensajesNoLeidos > 0
        ? {
            id: `mensaje-${e.idCaso}`,
            tipo: 'mensaje' as const,
            descripcion: `${e.nombreContraparte}: ${e.mensajesNoLeidos} mensaje(s) sin leer en "${e.titulo}"`,
            fecha: e.ultimaActualizacion,
          }
        : {
            id: `expediente-${e.idCaso}`,
            tipo: 'expediente' as const,
            descripcion: `Expediente actualizado: ${e.titulo} (${e.nombreContraparte})`,
            fecha: e.ultimaActualizacion,
          },
    )
}

/** B1: resumen del panel del abogado. */
export async function obtenerResumenDashboard(): Promise<ResumenDashboard> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerResumenDashboardMock } = await import('./dashboard.mock')
    return obtenerResumenDashboardMock()
  }

  const [expedientes, solicitudes, propuestas, reuniones, movimientos] = await Promise.allSettled([
    obtenerDashboardExpedientesApi(),
    listarSolicitudes({ estado: 'nueva', area: null, busqueda: '', pagina: 1, porPagina: MAXIMO_LISTA }),
    listarPropuestas({ estado: 'enviada', busqueda: '', pagina: 1, porPagina: 1 }),
    listarReuniones({ alcance: 'proximas' }),
    listarMovimientos({ estado: 'todos', busqueda: '', propuestaId: null, pagina: 1, porPagina: MAXIMO_LISTA }),
  ])

  const dashboard = valor(expedientes)
  const bandeja = valor(solicitudes)
  const proximas = valor(reuniones) ?? []

  return {
    indicadores: {
      solicitudesNuevas: bandeja?.total ?? 0,
      expedientesActivos: dashboard ? dashboard.totalAbiertos + dashboard.totalEnProgreso : 0,
      propuestasPendientes: valor(propuestas)?.totalesPorEstado.enviada ?? 0,
      proximasReuniones: proximas.length,
    },
    solicitudesNuevas: bandeja?.solicitudes ?? [],
    proximasReuniones: proximas.slice(0, MAXIMO_LISTA).map((r) => ({
      id: r.id,
      titulo: r.titulo,
      cliente: r.cliente.nombre,
      inicio: r.inicio,
      fin: r.fin,
      expediente: r.expediente?.folio ?? null,
    })),
    cobrosRelevantes: valor(movimientos)?.movimientos ?? [],
    actividadReciente: actividadDe(dashboard),
  }
}
