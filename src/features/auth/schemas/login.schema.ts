import { z } from 'zod'

export const loginSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es requerido.')
    .email('Ingresa un correo electrónico válido.'),
  contrasena: z
    .string()
    .min(1, 'La contraseña es requerida.'),
  recordarEquipo: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
