/** `GET /expedientes/opciones?clienteId=`: expedientes activos del cliente, para D4. */
export interface OpcionExpediente {
  id: string
  folio: string
  asunto: string
  clienteId: string
}
