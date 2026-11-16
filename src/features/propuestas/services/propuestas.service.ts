// D1 y D2 contra Back_Lexapp (PropuestasController y SolicitudCasoController).
// El backend no maneja borradores, cancelación, conceptos ni alcance por separado: D1 los
// compone dentro de `descripcionServicios` y la propuesta se envía al crearla.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import { formatearMonto } from '@/lib/moneda'
import type {
  FiltroPropuestas,
  FiltrosPropuestas,
  GenerarPropuestaApi,
  PeticionPropuesta,
  PropuestaApi,
  PropuestaDetalle,
  PropuestaResumen,
  RespuestaGuardarPropuesta,
  RespuestaPropuestas,
  ResumenSeguimientoApi,
  SeguimientoPropuestaApi,
} from '../types/propuestas.types'

const { propuestas } = ENDPOINTS

/** Folio visible: el backend solo tiene el id numérico. */
export function folioPropuesta(id: number | string): string {
  return `PRO-${String(id).padStart(5, '0')}`
}

function aResumen(p: SeguimientoPropuestaApi): PropuestaResumen {
  return {
    id: String(p.idPropuesta),
    folio: folioPropuesta(p.idPropuesta),
    cliente: { id: String(p.idCliente), nombre: p.nombreCliente || 'Cliente', organizacion: null },
    servicio: p.titulo,
    importe: p.costoEstimadoCentavos / 100,
    fechaCreacion: p.fechaCreacion,
    fechaVigencia: p.fechaExpiracion ? p.fechaExpiracion.slice(0, 10) : '',
    estado: p.estadoPropuesta,
    expedienteId: null,
  }
}

/** D2: el backend filtra por estado y búsqueda; la paginación se hace aquí. */
export async function listarPropuestas(filtros: FiltrosPropuestas): Promise<RespuestaPropuestas> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarPropuestasMock } = await import('./propuestas.mock')
    return listarPropuestasMock(filtros)
  }

  let datos: ResumenSeguimientoApi
  try {
    const respuesta = await api.get<ResumenSeguimientoApi>(propuestas.seguimiento, {
      params: {
        estado: filtros.estado === 'todas' ? undefined : filtros.estado,
        buscar: filtros.busqueda || undefined,
      },
    })
    datos = respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }

  const lista = datos.propuestas ?? []
  const inicio = (filtros.pagina - 1) * filtros.porPagina
  const totalesPorEstado: Record<FiltroPropuestas, number> = {
    todas: datos.totalPropuestas ?? 0,
    enviada: datos.totalEnviadas ?? 0,
    aceptada: datos.totalAceptadas ?? 0,
    rechazada: datos.totalRechazadas ?? 0,
    expirada: datos.totalExpiradas ?? 0,
  }
  return {
    propuestas: lista.slice(inicio, inicio + filtros.porPagina).map(aResumen),
    total: lista.length,
    totalesPorEstado,
  }
}

/** D2 "Ver propuesta": seguimiento (contacto y estado) + detalle (solicitud de origen). */
export async function obtenerPropuesta(id: string): Promise<PropuestaDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerPropuestaMock } = await import('./propuestas.mock')
    return obtenerPropuestaMock(id)
  }

  try {
    const [seguimiento, detalle] = await Promise.all([
      api.get<SeguimientoPropuestaApi>(propuestas.seguimientoDetalle(id)),
      api.get<PropuestaApi>(propuestas.detalle(id)).catch(() => null),
    ])
    const p = seguimiento.data
    const idSolicitud = detalle?.data.idSolicitud ?? null
    return {
      ...aResumen(p),
      solicitud: idSolicitud ? { id: String(idSolicitud), folio: `SOL-${String(idSolicitud).padStart(5, '0')}`, asunto: '' } : null,
      descripcion: p.descripcionServicios,
      alcance: '',
      condiciones: '',
      tiempoEstimado: p.tiempoEstimadoDias ? `${p.tiempoEstimadoDias} ${p.tiempoEstimadoDias === 1 ? 'día' : 'días'}` : '—',
      conceptos: [],
      fechaEnvio: p.fechaCreacion,
      motivoRechazo: null,
      tieneMovimientos: false,
    }
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

/** Une lo capturado en D1 en el único campo de texto que guarda el backend (máx. 5000). */
function componerDescripcion(peticion: PeticionPropuesta): string {
  const bloques = [peticion.descripcion.trim()]
  if (peticion.alcance.trim()) bloques.push(`Alcance:\n${peticion.alcance.trim()}`)
  if (peticion.conceptos.length > 0) {
    bloques.push(`Conceptos de cobro:\n${peticion.conceptos.map((c) => `• ${c.concepto}: ${formatearMonto(c.importe)}`).join('\n')}`)
  }
  if (peticion.condiciones.trim()) bloques.push(`Condiciones:\n${peticion.condiciones.trim()}`)
  return bloques.join('\n\n')
}

/** Fin del día de vigencia en hora local, en ISO (el backend la guarda como timestamp). */
function finDeDia(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(anio, mes - 1, dia, 23, 59, 59).toISOString()
}

/** D1: crea y envía la propuesta para la solicitud (requiere abogado verificado; 403 si no). */
export async function crearPropuesta(peticion: PeticionPropuesta): Promise<RespuestaGuardarPropuesta> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { crearPropuestaMock } = await import('./propuestas.mock')
    return crearPropuestaMock(peticion)
  }

  const cuerpo: GenerarPropuestaApi = {
    titulo: peticion.servicio.trim(),
    descripcionServicios: componerDescripcion(peticion),
    costoEstimadoCentavos: Math.round(peticion.honorarios * 100),
    tiempoEstimadoDias: peticion.tiempoEstimadoDias,
    fechaExpiracion: peticion.fechaVigencia ? finDeDia(peticion.fechaVigencia) : null,
  }

  try {
    const respuesta = await api.post<PropuestaApi>(ENDPOINTS.solicitudes.propuesta(peticion.solicitudId), cuerpo)
    return { id: String(respuesta.data.idPropuesta), estado: respuesta.data.estadoPropuesta }
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
