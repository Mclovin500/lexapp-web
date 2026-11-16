// D3–D5: honorarios sobre las facturas de cada caso (`/api/casos/{id}/facturas`, CasosController).
// No hay listado global de facturas: se consultan las de cada caso del abogado.
// El id de un movimiento es "idCaso-idFactura".
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi } from '@/api/errores'
import { USAR_MOCKS } from '@/api/mocks'
import {
  enCadaCaso,
  folioExpediente,
  idCompuesto,
  listarFacturasApi,
  normalizarTexto,
  obtenerCasoApi,
  obtenerFacturaApi,
  separarId,
  type CasoResumenApi,
  type EstadoFacturaApi,
  type FacturaCasoApi,
} from '@/features/expedientes/services/casos.api'
import type {
  EstadoMovimiento,
  FiltroMovimientos,
  FiltrosMovimientos,
  MovimientoDetalle,
  MovimientoResumen,
  PeticionCobroAdicional,
  RespuestaCobroAdicional,
  RespuestaMovimientos,
  ResumenHonorarios,
} from '../types/pagos.types'

/** `vencida` sigue sin pagarse; `cancelada` ya no se cobrará. */
const ESTADO_MOVIMIENTO: Record<EstadoFacturaApi, EstadoMovimiento> = {
  pendiente: 'pendiente',
  vencida: 'pendiente',
  pagada: 'pagado',
  cancelada: 'rechazado',
}

const CONCEPTO_PREDETERMINADO = 'Honorarios por servicios jurídicos'

export function aMovimiento(f: FacturaCasoApi, caso: Pick<CasoResumenApi, 'idCaso' | 'idCliente' | 'nombreCliente'>): MovimientoResumen {
  return {
    id: idCompuesto(caso.idCaso, f.idFactura),
    folio: f.numeroFactura,
    cliente: { id: String(caso.idCliente), nombre: caso.nombreCliente },
    expediente: { id: String(caso.idCaso), folio: folioExpediente(caso.idCaso) },
    concepto: f.concepto?.trim() || CONCEPTO_PREDETERMINADO,
    importe: f.totalCentavos / 100,
    fecha: f.fechaEmision,
    estado: ESTADO_MOVIMIENTO[f.estadoFactura],
    origen: f.esCobroAdicional ? 'cobro_adicional' : 'propuesta',
    propuestaId: null,
  }
}

async function todosLosMovimientos(): Promise<MovimientoResumen[]> {
  const facturas = await enCadaCaso(listarFacturasApi)
  return facturas.map(({ caso, item }) => aMovimiento(item, caso)).sort((a, b) => b.fecha.localeCompare(a.fecha))
}

/** D3: resumen de ingresos. La pasarela no retiene fondos todavía (`null`). */
export async function obtenerResumenHonorarios(): Promise<ResumenHonorarios> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerResumenHonorariosMock } = await import('./pagos.mock')
    return obtenerResumenHonorariosMock()
  }

  const movimientos = await todosLosMovimientos()
  const sumar = (estado: EstadoMovimiento) => movimientos.filter((m) => m.estado === estado).reduce((total, m) => total + m.importe, 0)
  return {
    ingresosTotales: sumar('pagado'),
    pagosPendientes: sumar('pendiente'),
    pagosRecibidos: sumar('pagado'),
    fondosRetenidos: null,
    fondosLiberados: null,
  }
}

/** D3: búsqueda, filtro y paginación en el navegador. `propuestaId` no aplica: las facturas no guardan la propuesta. */
export async function listarMovimientos(filtros: FiltrosMovimientos): Promise<RespuestaMovimientos> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { listarMovimientosMock } = await import('./pagos.mock')
    return listarMovimientosMock(filtros)
  }

  const busqueda = normalizarTexto(filtros.busqueda.trim())
  const base = (await todosLosMovimientos()).filter(
    (m) => !busqueda || normalizarTexto(`${m.cliente.nombre} ${m.expediente?.folio ?? ''} ${m.concepto} ${m.folio}`).includes(busqueda),
  )
  const contar = (estado: FiltroMovimientos) => (estado === 'todos' ? base.length : base.filter((m) => m.estado === estado).length)
  const filtrados = base.filter((m) => filtros.estado === 'todos' || m.estado === filtros.estado)
  const inicio = (filtros.pagina - 1) * filtros.porPagina

  return {
    movimientos: filtrados.slice(inicio, inicio + filtros.porPagina),
    total: filtrados.length,
    totalesPorEstado: {
      todos: contar('todos'),
      pendiente: contar('pendiente'),
      pagado: contar('pagado'),
      en_proceso: contar('en_proceso'),
      rechazado: contar('rechazado'),
      retenido: contar('retenido'),
      liberado: contar('liberado'),
    },
  }
}

/** D5: detalle de una factura (solo lectura). */
export async function obtenerMovimiento(id: string): Promise<MovimientoDetalle> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { obtenerMovimientoMock } = await import('./pagos.mock')
    return obtenerMovimientoMock(id)
  }

  const { idCaso, idItem } = separarId(id)
  const [caso, factura] = await Promise.all([obtenerCasoApi(idCaso), obtenerFacturaApi(idCaso, idItem)])
  const resumen = aMovimiento(factura, caso)
  return {
    ...resumen,
    descripcion: null,
    fechaLimite: factura.fechaVencimiento,
    fechaPago: factura.fechaPago,
    metodoPago: null,
    referenciaTransaccion: null,
    historial: [
      { estado: 'pendiente', fecha: factura.fechaEmision, nota: null },
      ...(factura.fechaPago ? [{ estado: 'pagado' as const, fecha: factura.fechaPago, nota: null }] : []),
    ],
  }
}

/**
 * D4: `POST /casos/{expedienteId}/facturas` como cobro adicional.
 * La factura solo tiene un concepto (varchar(255) en la base): la descripción se agrega ahí. La fecha de emisión la pone el backend;
 * sin fecha límite, el backend vence la factura a los 30 días.
 */
export async function crearCobroAdicional(peticion: PeticionCobroAdicional): Promise<RespuestaCobroAdicional> {
  if (import.meta.env.DEV && USAR_MOCKS) {
    const { crearCobroAdicionalMock } = await import('./pagos.mock')
    return crearCobroAdicionalMock(peticion)
  }

  const descripcion = peticion.descripcion.trim()
  const concepto = (descripcion ? `${peticion.concepto.trim()}: ${descripcion}` : peticion.concepto.trim()).slice(0, 255)

  try {
    const respuesta = await api.post<FacturaCasoApi>(ENDPOINTS.casos.facturas(peticion.expedienteId), {
      subtotalCentavos: Math.round(peticion.importe * 100),
      // Sin esto el backend suma 16 % de IVA; el abogado captura el importe final que verá el cliente.
      impuestosCentavos: 0,
      concepto,
      fechaVencimiento: peticion.fechaLimite ? new Date(`${peticion.fechaLimite}T23:59:59`).toISOString() : null,
      esCobroAdicional: true,
    })
    return { id: idCompuesto(peticion.expedienteId, respuesta.data.idFactura) }
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}
