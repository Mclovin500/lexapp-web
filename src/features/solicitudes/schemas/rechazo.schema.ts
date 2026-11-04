import { z } from 'zod'

export const LIMITE_MOTIVO_RECHAZO = 500

export const rechazoSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(10, 'Explica el motivo en al menos 10 caracteres.')
    .max(LIMITE_MOTIVO_RECHAZO, `Máximo ${LIMITE_MOTIVO_RECHAZO} caracteres.`),
})

export type RechazoFormValues = z.infer<typeof rechazoSchema>
