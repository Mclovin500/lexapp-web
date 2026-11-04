import { z } from 'zod'

export const recuperacionSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es requerido.')
    .email('Ingresa un correo electrónico válido.'),
})

export type RecuperacionFormValues = z.infer<typeof recuperacionSchema>
