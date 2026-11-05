// MOCK: eliminar al conectar el backend
// Conversaciones en memoria. Al enviar un mensaje, el "cliente" responde a los pocos segundos
// para probar la actualización periódica de H1 (en el backend: WebSocket o notificaciones push).
import { esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { buscarContactoMock } from '@/features/clientes/services/clientes.mock'
import { expedientesMock } from '@/features/expedientes/services/expedientes.mock'
import { crearPdfFicticio } from '@/features/expedientes/services/pdf-ficticio.mock'
import type {
  AdjuntoMensaje,
  ConversacionResumen,
  FiltroConversaciones,
  Mensaje,
  PeticionAbrirConversacion,
  PeticionMensaje,
  RespuestaConversaciones,
  RespuestaMensajes,
} from '../types/chat.types'

/** Conversación de otro abogado: para probar el control de acceso (403). */
export const CONVERSACION_AJENA_MOCK = 'con-999'
const RESPUESTA_AUTOMATICA_MS = 4000
const DIA = 60 * 24

interface ConversacionMock {
  id: string
  clienteId: string
  expedienteId: string | null
  mensajes: Mensaje[]
}

let consecutivoMensaje = 1
function m(autor: Mensaje['autor'], texto: string, minutos: number, adjunto: AdjuntoMensaje | null = null, leido = true): Mensaje {
  return { id: `msg-${String(consecutivoMensaje++).padStart(4, '0')}`, autor, texto, fecha: haceMinutos(minutos), adjunto, leido }
}
function pdf(id: string, nombre: string, kb: number): AdjuntoMensaje {
  return { id, nombre, tipoArchivo: 'application/pdf', tamanoBytes: kb * 1024 }
}

const conversacionesMock: ConversacionMock[] = [
  {
    id: 'con-77', clienteId: 'cli-103', expedienteId: 'exp-298',
    mensajes: [
      m('abogado', 'Buenas tardes, Elena. Para revisar la liquidación necesito sus recibos de nómina de este año.', DIA + 120),
      m('cliente', 'Claro, licenciado. Los subo hoy al expediente.', DIA + 60),
      m('abogado', 'Perfecto. También le comparto el cálculo preliminar.', DIA + 30, pdf('adj-01', 'Calculo_preliminar_liquidacion.pdf', 220)),
      m('cliente', 'Gracias, licenciado. Le envío mañana la documentación que me pidió.', 60 * 20, null, false),
    ],
  },
  {
    id: 'con-78', clienteId: 'cli-110', expedienteId: 'exp-312',
    mensajes: [
      m('abogado', 'Jorge, el juzgado admitió la demanda de amparo. Le dejo el acuerdo.', 130, pdf('adj-02', 'Acuerdo_admision_amparo.pdf', 1380)),
      m('cliente', '¡Excelente noticia! ¿Eso significa que ya no tenemos que pagar la multa?', 110, null, false),
      m('cliente', '¿Podemos verlo en la reunión de mañana?', 100, null, false),
    ],
  },
  {
    id: 'con-79', clienteId: 'cli-108', expedienteId: 'exp-305',
    mensajes: [
      m('abogado', 'Roberto, le envié el proyecto de contrato de fideicomiso para sus comentarios.', DIA + 200),
      m('cliente', 'Quedo a la espera del borrador final del convenio modificatorio.', DIA, null, false),
    ],
  },
  {
    id: 'con-80', clienteId: 'cli-107', expedienteId: 'exp-320',
    mensajes: [
      m('abogado', 'Claudia, para avanzar necesito el inventario de datos personales que recaba la plataforma.', DIA * 2),
      m('cliente', 'Entendido, lo preparo con el equipo de producto.', DIA * 2 - 90),
    ],
  },
  {
    id: 'con-81', clienteId: 'cli-102', expedienteId: 'exp-290',
    mensajes: [
      m('cliente', 'Licenciado, ¿ya se emplazó a la parte demandada?', DIA * 6 + 30),
      m('abogado', 'Sí, Carlos. Ya corre el plazo para que conteste la demanda.', DIA * 6),
    ],
  },
  {
    id: 'con-82', clienteId: 'cli-104', expedienteId: null,
    mensajes: [m('abogado', 'Fernando, le envié la propuesta para la auditoría laboral preventiva. Quedo atento a sus dudas.', DIA - 20)],
  },
  {
    id: 'con-83', clienteId: 'cli-105', expedienteId: 'exp-282',
    mensajes: [
      m('abogado', 'Mariana, el IMPI ya asignó número a la solicitud de marca.', DIA * 4),
      m('cliente', 'Perfecto, nos vemos en la reunión virtual del jueves.', DIA * 4 - 45),
    ],
  },
]

const archivosCargados = new Map<string, File>()
const urlsGeneradas = new Map<string, string>()
let consecutivoConversacion = 90
let consecutivoAdjunto = 10

async function simularRed(milisegundos?: number): Promise<void> {
  await esperar(milisegundos)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function noLeidos(c: ConversacionMock): number {
  return c.mensajes.filter((x) => x.autor === 'cliente' && !x.leido).length
}

function aResumen(c: ConversacionMock): ConversacionResumen {
  const contacto = buscarContactoMock(c.clienteId)
  const expediente = expedientesMock.find((e) => e.id === c.expedienteId)
  const ultimo = c.mensajes.at(-1)
  return {
    id: c.id,
    cliente: { id: contacto.id, nombre: contacto.nombre, organizacion: contacto.organizacion, enDirectorio: contacto.enDirectorio },
    expediente: expediente ? { id: expediente.id, folio: expediente.folio, asunto: expediente.asunto } : null,
    ultimoMensaje: ultimo
      ? { texto: ultimo.texto || (ultimo.adjunto ? `📎 ${ultimo.adjunto.nombre}` : ''), fecha: ultimo.fecha, autor: ultimo.autor }
      : null,
    noLeidos: noLeidos(c),
  }
}

function buscar(id: string): ConversacionMock {
  if (id === CONVERSACION_AJENA_MOCK) throw new ErrorApi('sin_permiso')
  const c = conversacionesMock.find((x) => x.id === id)
  if (!c) throw new ErrorApi('no_encontrado')
  return c
}

const fechaUltimo = (c: ConversacionMock) => c.mensajes.at(-1)?.fecha ?? ''

/** Contador "Chat" del Sidebar y del Header. */
export function contarMensajesSinLeerMock(): number {
  return conversacionesMock.reduce((total, c) => total + noLeidos(c), 0)
}

export async function listarConversacionesMock(filtro: FiltroConversaciones, busqueda: string): Promise<RespuestaConversaciones> {
  await simularRed(300)
  const termino = normalizar(busqueda.trim())
  const base = conversacionesMock
    .map((c) => ({ c, r: aResumen(c) }))
    .filter(
      ({ r }) =>
        !termino ||
        [r.cliente.nombre, r.cliente.organizacion ?? '', r.expediente?.folio ?? '', r.expediente?.asunto ?? ''].some((campo) =>
          normalizar(campo).includes(termino),
        ),
    )
    .sort((a, b) => fechaUltimo(b.c).localeCompare(fechaUltimo(a.c)))
    .map(({ r }) => r)
  return {
    conversaciones: filtro === 'no_leidas' ? base.filter((r) => r.noLeidos > 0) : base,
    totales: { todas: base.length, no_leidas: base.filter((r) => r.noLeidos > 0).length },
  }
}

/** Abre la conversación del cliente (desde E2, F2, C2 o D2) o la crea si no existe. */
export async function abrirConversacionMock(peticion: PeticionAbrirConversacion): Promise<{ id: string }> {
  await simularRed(300)
  const contacto = buscarContactoMock(peticion.clienteId)
  const delCliente = conversacionesMock.filter((c) => c.clienteId === contacto.id)
  if (peticion.expedienteId === undefined && delCliente.length > 0) {
    return { id: [...delCliente].sort((a, b) => fechaUltimo(b).localeCompare(fechaUltimo(a)))[0].id }
  }
  const expedienteId = peticion.expedienteId ?? null
  if (expedienteId) {
    const expediente = expedientesMock.find((e) => e.id === expedienteId)
    if (!expediente || expediente.clienteId !== contacto.id) throw new ErrorApi('datos_invalidos')
  }
  const existente = delCliente.find((c) => c.expedienteId === expedienteId)
  if (existente) return { id: existente.id }
  const nueva: ConversacionMock = { id: `con-${consecutivoConversacion++}`, clienteId: contacto.id, expedienteId, mensajes: [] }
  conversacionesMock.push(nueva)
  return { id: nueva.id }
}

export async function obtenerMensajesMock(id: string): Promise<RespuestaMensajes> {
  await simularRed(300)
  const c = buscar(id)
  return { conversacion: aResumen(c), mensajes: c.mensajes.map((x) => ({ ...x, adjunto: x.adjunto && { ...x.adjunto } })) }
}

export async function marcarConversacionLeidaMock(id: string): Promise<void> {
  await simularRed(200)
  for (const mensaje of buscar(id).mensajes) if (mensaje.autor === 'cliente') mensaje.leido = true
}

export async function enviarMensajeMock(id: string, peticion: PeticionMensaje): Promise<Mensaje> {
  await simularRed(500)
  const c = buscar(id)
  const texto = peticion.texto.trim()
  if (!texto && !peticion.archivo) throw new ErrorApi('datos_invalidos')
  let adjunto: AdjuntoMensaje | null = null
  if (peticion.archivo) {
    adjunto = {
      id: `adj-${consecutivoAdjunto++}`,
      nombre: peticion.archivo.name,
      tipoArchivo: peticion.archivo.type || 'application/octet-stream',
      tamanoBytes: peticion.archivo.size,
    }
    archivosCargados.set(adjunto.id, peticion.archivo)
  }
  const mensaje: Mensaje = { id: `msg-${String(consecutivoMensaje++).padStart(4, '0')}`, autor: 'abogado', texto, fecha: new Date().toISOString(), adjunto, leido: false }
  c.mensajes.push(mensaje)

  // Simula que el cliente lee y contesta desde su app.
  setTimeout(() => {
    mensaje.leido = true
    c.mensajes.push({
      id: `msg-${String(consecutivoMensaje++).padStart(4, '0')}`,
      autor: 'cliente',
      texto: adjunto ? 'Recibido el archivo, licenciado. Lo reviso y le comento.' : 'Recibido, licenciado. Gracias.',
      fecha: new Date().toISOString(),
      adjunto: null,
      leido: false,
    })
  }, RESPUESTA_AUTOMATICA_MS)
  return { ...mensaje }
}

/** URL temporal del adjunto: el archivo real si se envió en la sesión, o un PDF ficticio. */
export async function obtenerUrlAdjuntoMock(conversacionId: string, adjuntoId: string): Promise<{ url: string; expiraEn: string }> {
  await simularRed(300)
  const mensaje = buscar(conversacionId).mensajes.find((x) => x.adjunto?.id === adjuntoId)
  if (!mensaje?.adjunto) throw new ErrorApi('no_encontrado')
  let url = urlsGeneradas.get(adjuntoId)
  if (!url) {
    const archivo = archivosCargados.get(adjuntoId)
    url = URL.createObjectURL(archivo ?? crearPdfFicticio(['LexApp - Adjunto ficticio de prueba', '', `Archivo: ${mensaje.adjunto.nombre}`]))
    urlsGeneradas.set(adjuntoId, url)
  }
  return { url, expiraEn: new Date(Date.now() + 10 * 60_000).toISOString() }
}
