// MOCK: eliminar al conectar el backend
import { esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import type { TipoPersona } from '@/features/solicitudes/types/solicitudes.types'
import type { OpcionCliente } from '../types/clientes.types'

/** Datos base del cliente. El directorio (F1/F2) los combina en `clientes-directorio.mock.ts`. */
export interface ClienteRegistroMock extends OpcionCliente {
  tipoPersona: TipoPersona
  correo: string
  telefono: string | null
  clienteDesde: string
}

const DIA = 60 * 24

/** Mismos identificadores y datos de contacto que las solicitudes, propuestas y movimientos ficticios. */
export const clientesMock: ClienteRegistroMock[] = [
  { id: 'cli-101', nombre: 'Valeria Gómez Rivas', organizacion: 'Fintech Nova S.A.P.I. de C.V.', tipoPersona: 'moral', correo: 'valeria.gomez@novapay.mx', telefono: '55 4192 8830', clienteDesde: haceMinutos(DIA * 2) },
  { id: 'cli-102', nombre: 'Carlos Mendoza Prieto', organizacion: 'Grupo Inmobiliario Nexus', tipoPersona: 'moral', correo: 'cmendoza@nexus.mx', telefono: '81 2233 4455', clienteDesde: haceMinutos(DIA * 120) },
  { id: 'cli-103', nombre: 'Elena Santillán Ruiz', organizacion: null, tipoPersona: 'fisica', correo: 'elena.santillan@correo.mx', telefono: null, clienteDesde: haceMinutos(DIA * 35) },
  { id: 'cli-104', nombre: 'Fernando Garay Luna', organizacion: 'Soluciones Logísticas S.A. de C.V.', tipoPersona: 'moral', correo: 'fgaray@sollog.mx', telefono: '33 1020 3040', clienteDesde: haceMinutos(DIA * 300) },
  { id: 'cli-105', nombre: 'Mariana Bosque Ortiz', organizacion: 'BioPharma Lab S.A.', tipoPersona: 'moral', correo: 'mbosque@biopharma.mx', telefono: '55 7788 9900', clienteDesde: haceMinutos(DIA * 60) },
  { id: 'cli-107', nombre: 'Claudia Treviño Garza', organizacion: 'TechHub México S.A.S.', tipoPersona: 'moral', correo: 'claudia@techhub.mx', telefono: null, clienteDesde: haceMinutos(DIA * 8) },
  { id: 'cli-108', nombre: 'Roberto Garza Sada', organizacion: 'Inversiones del Norte', tipoPersona: 'moral', correo: 'rgarza@invnorte.mx', telefono: '81 5566 7788', clienteDesde: haceMinutos(DIA * 50) },
  { id: 'cli-110', nombre: 'Jorge Villaseñor Cano', organizacion: 'Constructora del Bajío', tipoPersona: 'moral', correo: 'jvillasenor@cbajio.mx', telefono: '477 123 4567', clienteDesde: haceMinutos(DIA * 45) },
  { id: 'cli-111', nombre: 'Lucía Hernández Prado', organizacion: null, tipoPersona: 'fisica', correo: 'lucia.hp@correo.mx', telefono: '55 1111 2222', clienteDesde: haceMinutos(DIA * 400) },
  { id: 'cli-112', nombre: 'Héctor Salinas Ibarra', organizacion: 'Agroexportadora del Pacífico', tipoPersona: 'moral', correo: 'hsalinas@agropac.mx', telefono: '667 222 3344', clienteDesde: haceMinutos(DIA * 250) },
  { id: 'cli-113', nombre: 'Mariana Torreblanca Ríos', organizacion: 'Torreblanca Consultores S.C.', tipoPersona: 'moral', correo: 'mtorreblanca@tconsultores.mx', telefono: '55 3344 5566', clienteDesde: haceMinutos(DIA * 15) },
]

/** Valida que el cliente tenga relación con el abogado (D1, D4). */
export function buscarClienteMock(id: string): ClienteRegistroMock {
  const cliente = clientesMock.find((c) => c.id === id)
  if (!cliente) throw new ErrorApi('datos_invalidos')
  return cliente
}

export async function listarOpcionesClientesMock(): Promise<OpcionCliente[]> {
  await esperar(300)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
  return [...clientesMock]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    .map(({ id, nombre, organizacion }) => ({ id, nombre, organizacion }))
}
