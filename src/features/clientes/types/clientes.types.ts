/** `GET /clientes/opciones`: clientes con relación profesional, para selectores (D1, D4). */
export interface OpcionCliente {
  id: string
  nombre: string
  organizacion: string | null
}
