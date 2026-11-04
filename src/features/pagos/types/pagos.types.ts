/** Estados de D3 y D5 (especificación). "Retenido" y "liberado" solo si el proveedor de pagos lo contempla. */
export type EstadoMovimiento = 'pendiente' | 'pagado' | 'en_proceso' | 'rechazado' | 'retenido' | 'liberado'
export type FiltroMovimientos = 'todos' | EstadoMovimiento
export type OrigenMovimiento = 'propuesta' | 'cobro_adicional'

export interface MovimientoResumen {
  id: string
  /** Identificador visible del movimiento. */
  folio: string
  cliente: { id: string; nombre: string }
  expediente: { id: string; folio: string } | null
  concepto: string
  /** MXN. */
  importe: number
  /** Fecha de creación (ISO 8601). */
  fecha: string
  estado: EstadoMovimiento
  origen: OrigenMovimiento
  propuestaId: string | null
}

export interface CambioEstadoMovimiento {
  estado: EstadoMovimiento
  fecha: string
  nota: string | null
}

/** `GET /honorarios/movimientos/{id}` (D5). Solo lectura: una transacción confirmada no se modifica. */
export interface MovimientoDetalle extends MovimientoResumen {
  descripcion: string | null
  fechaLimite: string | null
  fechaPago: string | null
  /** Solo información no sensible, p. ej. "Transferencia SPEI" o "Tarjeta •••• 4912". */
  metodoPago: string | null
  /** Referencia de la pasarela, cuando exista. */
  referenciaTransaccion: string | null
  historial: CambioEstadoMovimiento[]
}

/** `GET /honorarios/resumen` (D3). `null` = no aplica (el proveedor no maneja retención). */
export interface ResumenHonorarios {
  ingresosTotales: number
  pagosPendientes: number
  pagosRecibidos: number
  fondosRetenidos: number | null
  fondosLiberados: number | null
}

export interface FiltrosMovimientos {
  estado: FiltroMovimientos
  /** Cliente, expediente o concepto. */
  busqueda: string
  /** Movimientos de una propuesta (enlace desde D2). */
  propuestaId: string | null
  pagina: number
  porPagina: number
}

/** `GET /honorarios/movimientos?estado=&busqueda=&propuestaId=&pagina=&porPagina=` (D3). */
export interface RespuestaMovimientos {
  movimientos: MovimientoResumen[]
  total: number
  totalesPorEstado: Record<FiltroMovimientos, number>
}

/** `POST /honorarios/cobros` (D4). */
export interface PeticionCobroAdicional {
  clienteId: string
  expedienteId: string
  concepto: string
  descripcion: string
  importe: number
  /** AAAA-MM-DD */
  fechaEmision: string
  /** AAAA-MM-DD o `null` si no corresponde. */
  fechaLimite: string | null
}

export interface RespuestaCobroAdicional {
  id: string
}

/** D4 → D5: aviso de cobro recién enviado. */
export interface EstadoCobroEnviado {
  cobroEnviado: true
}
