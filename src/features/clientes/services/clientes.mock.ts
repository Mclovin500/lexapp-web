// MOCK: eliminar al conectar el backend
import { esperar, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import type { OpcionCliente } from '../types/clientes.types'

/** Mismos identificadores que las solicitudes, propuestas y movimientos ficticios. */
export const clientesMock: OpcionCliente[] = [
  { id: 'cli-101', nombre: 'Valeria Gómez Rivas', organizacion: 'Fintech Nova S.A.P.I. de C.V.' },
  { id: 'cli-102', nombre: 'Carlos Mendoza Prieto', organizacion: 'Grupo Inmobiliario Nexus' },
  { id: 'cli-103', nombre: 'Elena Santillán Ruiz', organizacion: null },
  { id: 'cli-104', nombre: 'Fernando Garay Luna', organizacion: 'Soluciones Logísticas S.A. de C.V.' },
  { id: 'cli-105', nombre: 'Mariana Bosque Ortiz', organizacion: 'BioPharma Lab S.A.' },
  { id: 'cli-107', nombre: 'Claudia Treviño Garza', organizacion: 'TechHub México S.A.S.' },
  { id: 'cli-108', nombre: 'Roberto Garza Sada', organizacion: 'Inversiones del Norte' },
  { id: 'cli-110', nombre: 'Jorge Villaseñor Cano', organizacion: 'Constructora del Bajío' },
  { id: 'cli-111', nombre: 'Lucía Hernández Prado', organizacion: null },
  { id: 'cli-112', nombre: 'Héctor Salinas Ibarra', organizacion: 'Agroexportadora del Pacífico' },
  { id: 'cli-113', nombre: 'Mariana Torreblanca Ríos', organizacion: 'Torreblanca Consultores S.C.' },
]

export function buscarClienteMock(id: string): OpcionCliente {
  const cliente = clientesMock.find((c) => c.id === id)
  if (!cliente) throw new ErrorApi('datos_invalidos')
  return cliente
}

export async function listarOpcionesClientesMock(): Promise<OpcionCliente[]> {
  await esperar(300)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
  return [...clientesMock].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}
