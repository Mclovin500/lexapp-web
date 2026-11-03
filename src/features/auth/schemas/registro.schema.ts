import { z } from 'zod'

/**
 * Reglas de contraseña compartidas por la validación y el indicador visual.
 * Sus textos viven en registro.content.ts (passwordRules), con el mismo id.
 */
export const REGLAS_CONTRASENA = [
  { id: 'longitud', cumple: (valor: string) => valor.length >= 8 },
  { id: 'mayuscula', cumple: (valor: string) => /[A-ZÁÉÍÓÚÑ]/.test(valor) },
  { id: 'numero', cumple: (valor: string) => /\d/.test(valor) },
] as const

export type IdReglaContrasena = (typeof REGLAS_CONTRASENA)[number]['id']

function telefonoValido(valor: string): boolean {
  if (valor === '') return true
  const digitos = valor.replace(/\D/g, '')
  return /^\+?[\d\s()-]+$/.test(valor) && digitos.length >= 10 && digitos.length <= 13
}

export const registroSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(1, 'El nombre es requerido.')
      .max(80, 'El nombre no puede superar 80 caracteres.'),
    apellidos: z
      .string()
      .trim()
      .min(1, 'Los apellidos son requeridos.')
      .max(80, 'Los apellidos no pueden superar 80 caracteres.'),
    correo: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es requerido.')
      .email('Ingresa un correo electrónico válido.'),
    telefono: z
      .string()
      .trim()
      .refine(telefonoValido, 'Ingresa un teléfono válido de al menos 10 dígitos.'),
    contrasena: z
      .string()
      .refine((v) => REGLAS_CONTRASENA.every((regla) => regla.cumple(v)), {
        message: 'La contraseña no cumple los requisitos mínimos.',
      }),
    confirmarContrasena: z.string().min(1, 'Confirma tu contraseña.'),
    aceptaTerminos: z
      .boolean()
      .refine((v) => v, 'Debes aceptar las condiciones para continuar.'),
  })
  .refine((datos) => datos.contrasena === datos.confirmarContrasena, {
    path: ['confirmarContrasena'],
    message: 'Las contraseñas no coinciden.',
  })

export type RegistroFormValues = z.infer<typeof registroSchema>
