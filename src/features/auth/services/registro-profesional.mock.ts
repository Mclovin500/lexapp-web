// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorAutenticacion } from '../types/auth.types'
import type {
  CredencialesProfesionales,
  DocumentoRegistro,
  PerfilProfesional,
  ProgresoRegistro,
  RespuestaEnvioRegistro,
  TipoDocumentoRegistro,
} from '../types/registro-profesional.types'

/** Cédula que el mock trata como ya registrada (409). */
const CEDULA_REGISTRADA = '1234567'

/** Progreso guardado en memoria mientras dura la pestaña (nunca en storage). */
const progresoMock: ProgresoRegistro = {}

async function simularRed(): Promise<void> {
  await esperar()
  if (SIMULAR_ERROR_RED) throw new ErrorAutenticacion('red')
}

export async function obtenerProgresoRegistroMock(): Promise<ProgresoRegistro> {
  await simularRed()
  return { ...progresoMock }
}

const TIPOS_DOCUMENTO = ['application/pdf', 'image/jpeg', 'image/png']
const MAXIMO_DOCUMENTO = 5 * 1024 * 1024
let consecutivoDocumento = 1
/** Ids de los documentos cargados en la sesión (para validar que existan al guardar). */
const documentosCargados = new Set<string>()

export async function subirDocumentoRegistroMock(tipo: TipoDocumentoRegistro, archivo: File): Promise<DocumentoRegistro> {
  await simularRed()
  if (!TIPOS_DOCUMENTO.includes(archivo.type) || archivo.size === 0 || archivo.size > MAXIMO_DOCUMENTO) {
    throw new ErrorAutenticacion('datos_invalidos')
  }
  const id = `docreg-${consecutivoDocumento++}`
  documentosCargados.add(id)
  return { id, tipo, nombre: archivo.name, tamanoBytes: archivo.size }
}

export async function subirFotoRegistroMock(archivo: File): Promise<{ fotoUrl: string }> {
  await simularRed()
  if (!['image/jpeg', 'image/png'].includes(archivo.type) || archivo.size > 4 * 1024 * 1024) throw new ErrorAutenticacion('datos_invalidos')
  return { fotoUrl: URL.createObjectURL(archivo) }
}

export async function guardarCredencialesMock(datos: CredencialesProfesionales): Promise<void> {
  await simularRed()
  if (datos.numeroCedula === CEDULA_REGISTRADA) throw new ErrorAutenticacion('conflicto')
  const cedula = datos.documentos.find((d) => d.tipo === 'cedula')
  if (!cedula || datos.documentos.some((d) => !documentosCargados.has(d.id))) throw new ErrorAutenticacion('datos_invalidos')
  progresoMock.credenciales = { ...datos, documentos: datos.documentos.map((d) => ({ ...d })) }
}

export async function guardarPerfilMock(datos: PerfilProfesional): Promise<void> {
  await simularRed()
  progresoMock.perfil = {
    ...datos,
    especializaciones: [...datos.especializaciones],
    servicios: datos.servicios.map((s) => ({ ...s })),
    honorarios: { ...datos.honorarios },
  }
}

export async function enviarRegistroMock(): Promise<RespuestaEnvioRegistro> {
  await simularRed()
  return {
    estadoValidacion: 'pendiente',
    folio: 'LEX-MOCK-000123',
    fechaEnvio: new Date().toISOString(),
  }
}
