// Capa común sobre CasosController (`/api/casos`) de Back_Lexapp.
// Expedientes, documentos, chat, agenda, pagos y clientes se arman a partir de estas respuestas.
import { api } from '@/api/cliente'
import { ENDPOINTS } from '@/api/endpoints'
import { aErrorApi, ErrorApi } from '@/api/errores'
import { leerToken } from '@/api/token'
import type { RespuestaSesion } from '@/features/auth/types/sesion.types'
import type { EstadoExpediente } from '../types/expedientes.types'

// ---------- Respuestas del backend (camelCase) ----------

export type EstadoCasoApi = 'abierto' | 'en_progreso' | 'cerrado' | 'cancelado'
export type EstadoCitaApi = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
export type EstadoFacturaApi = 'pendiente' | 'pagada' | 'vencida' | 'cancelada'

export interface CasoResumenApi {
  idCaso: number
  idCliente: number
  nombreCliente: string
  idAbogado: number
  nombreAbogado: string
  titulo: string
  estadoCaso: EstadoCasoApi
  costoTotalCentavos: number | null
  progresoPorcentaje: number | null
  fechaCreacion: string
}

export interface CasoDetalleApi extends CasoResumenApi {
  emailCliente: string | null
  telefonoCliente: string | null
  emailAbogado: string | null
  telefonoAbogado: string | null
  descripcion: string | null
  updatedAt: string
  totalDocumentos: number
  totalMensajes: number
  totalCitas: number
  totalFacturas: number
}

export interface DocumentoCasoApi {
  idDocumento: number
  idCaso: number
  nombreArchivo: string
  rutaArchivo: string
  tipoDocumento: string | null
  fechaSubida: string
}

export interface MensajeChatApi {
  idMensaje: number
  idCaso: number
  idRemitente: number
  nombreRemitente: string
  mensajeTexto: string
  fechaHora: string
  leido: boolean
  tipoMensaje: string | null
  archivoUrl: string | null
  archivoNombre: string | null
}

export interface CitaCasoApi {
  idCita: number
  idCaso: number
  fechaHoraInicio: string
  fechaHoraFin: string | null
  ubicacion: string | null
  estadoCita: EstadoCitaApi
  enlaceReunion: string | null
  modalidad: string | null
}

export interface FacturaCasoApi {
  idFactura: number
  idCaso: number
  numeroFactura: string
  subtotalCentavos: number
  impuestosCentavos: number
  totalCentavos: number
  estadoFactura: EstadoFacturaApi
  fechaEmision: string
  fechaVencimiento: string | null
  fechaPago: string | null
  concepto: string | null
  esCobroAdicional: boolean
}

// ---------- Peticiones ----------

const { casos } = ENDPOINTS

async function obtener<T>(url: string): Promise<T> {
  try {
    const respuesta = await api.get<T>(url)
    return respuesta.data
  } catch (error: unknown) {
    throw aErrorApi(error)
  }
}

export const listarCasosApi = () => obtener<CasoResumenApi[]>(casos.misCasos)
export const obtenerCasoApi = (idCaso: string) => obtener<CasoDetalleApi>(casos.detalle(idCaso))
export const listarDocumentosApi = (idCaso: string) => obtener<DocumentoCasoApi[]>(casos.documentos(idCaso))
export const listarMensajesApi = (idCaso: string) => obtener<MensajeChatApi[]>(casos.mensajes(idCaso))
export const listarCitasApi = (idCaso: string) => obtener<CitaCasoApi[]>(casos.citas(idCaso))
export const listarFacturasApi = (idCaso: string) => obtener<FacturaCasoApi[]>(casos.facturas(idCaso))
export const obtenerFacturaApi = (idCaso: string, idFactura: string) => obtener<FacturaCasoApi>(casos.factura(idCaso, idFactura))

/** Ejecuta `consulta` en cada caso y junta los resultados (citas y facturas no tienen listado global). */
export async function enCadaCaso<T>(consulta: (idCaso: string) => Promise<T[]>, lista?: CasoResumenApi[]) {
  const todos = lista ?? (await listarCasosApi())
  const porCaso = await Promise.all(todos.map(async (caso) => ({ caso, items: await consulta(String(caso.idCaso)) })))
  return porCaso.flatMap(({ caso, items }) => items.map((item) => ({ caso, item })))
}

// ---------- Identificadores compuestos ----------
// Citas y facturas solo se consultan dentro de su caso: el id de la web es "idCaso-idItem".

export function idCompuesto(idCaso: number | string, idItem: number | string): string {
  return `${idCaso}-${idItem}`
}

export function separarId(id: string): { idCaso: string; idItem: string } {
  const [idCaso, idItem] = id.split('-')
  if (!idCaso || !idItem || !/^\d+$/.test(idCaso) || !/^\d+$/.test(idItem)) throw new ErrorApi('no_encontrado')
  return { idCaso, idItem }
}

// ---------- Conversiones comunes ----------

export function folioExpediente(idCaso: number | string): string {
  return `EXP-${String(idCaso).padStart(6, '0')}`
}

export function estadoExpediente(estado: EstadoCasoApi): EstadoExpediente {
  return estado === 'cerrado' || estado === 'cancelado' ? 'finalizado' : 'activo'
}

/** El backend aún no guarda el área jurídica del caso. */
export const AREA_SIN_ESPECIFICAR = 'Sin área especificada'

export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Funciones de la web que el backend todavía no expone. */
export function noDisponible(): never {
  throw new ErrorApi('no_disponible')
}

let idUsuarioActual: { token: string | null; id: Promise<number> } | null = null

/** `idUsuario` de la sesión (para saber qué mensajes escribió el abogado). Se consulta una vez por token. */
export function obtenerIdUsuarioActual(): Promise<number> {
  const token = leerToken()
  if (idUsuarioActual?.token !== token) {
    const id = obtener<RespuestaSesion>(ENDPOINTS.auth.sesion).then((sesion) => sesion.idUsuario)
    id.catch(() => {
      idUsuarioActual = null
    })
    idUsuarioActual = { token, id }
  }
  return idUsuarioActual!.id
}
