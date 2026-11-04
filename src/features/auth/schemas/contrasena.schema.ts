import { z } from 'zod'

/**
 * Reglas únicas de contraseña (A3 y A2D). Las usan la validación y el indicador visual.
 * Sus textos viven en content/contrasena.content.ts con el mismo id.
 * "Sin datos personales obvios" NO está aquí: el backend es quien la valida.
 */
export const REGLAS_CONTRASENA = [
  { id: 'longitud', cumple: (valor: string) => valor.length >= 10 },
  { id: 'mayuscula', cumple: (valor: string) => /\p{Lu}/u.test(valor) },
  { id: 'minuscula', cumple: (valor: string) => /\p{Ll}/u.test(valor) },
  { id: 'numero', cumple: (valor: string) => /\d/.test(valor) },
  { id: 'especial', cumple: (valor: string) => /[^\p{L}\d\s]/u.test(valor) },
] as const

export type IdReglaContrasena = (typeof REGLAS_CONTRASENA)[number]['id']

export function cumpleReglasContrasena(valor: string): boolean {
  return REGLAS_CONTRASENA.every((regla) => regla.cumple(valor))
}

export const contrasenaSchema = z
  .string()
  .refine(cumpleReglasContrasena, 'La contraseña no cumple los requisitos mínimos.')

/** Nueva contraseña + confirmación (A2D). A3 aplica la misma comparación en su schema. */
export const nuevaContrasenaSchema = z
  .object({
    contrasena: contrasenaSchema,
    confirmarContrasena: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((datos) => datos.contrasena === datos.confirmarContrasena, {
    path: ['confirmarContrasena'],
    message: 'Las contraseñas no coinciden.',
  })

export type NuevaContrasenaFormValues = z.infer<typeof nuevaContrasenaSchema>
