import { z } from 'zod'

export const actualizacionSchema = z.object({
  titulo: z.string().trim().min(3, 'Escribe un título de al menos 3 caracteres.').max(120, 'Máximo 120 caracteres.'),
  descripcion: z.string().trim().min(10, 'Describe la actualización en al menos 10 caracteres.').max(1500, 'Máximo 1500 caracteres.'),
  visibleCliente: z.boolean(),
})

export type ActualizacionFormValues = z.infer<typeof actualizacionSchema>

export const cambioEstadoSchema = z.object({
  estado: z.enum(['activo', 'en_espera', 'finalizado'], { error: 'Selecciona el nuevo estado.' }),
  nota: z.string().trim().min(10, 'Explica el motivo en al menos 10 caracteres.').max(500, 'Máximo 500 caracteres.'),
})

export type CambioEstadoFormValues = z.infer<typeof cambioEstadoSchema>
