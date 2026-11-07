import { z } from 'zod'
import { contrasenaSchema } from './contrasena.schema'

/** Letras (con acentos y ñ), espacios, apóstrofo, punto y guion. */
const PATRON_NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u

function campoNombre(requerido: string) {
  return z
    .string()
    .trim()
    .min(1, requerido)
    .max(50, 'Máximo 50 caracteres.')
    .regex(PATRON_NOMBRE, 'Usa solo letras.')
}

function telefonoValido(valor: string): boolean {
  if (valor === '') return true
  const digitos = valor.replace(/\D/g, '')
  return /^\+?[\d\s()-]+$/.test(valor) && digitos.length >= 10 && digitos.length <= 13
}

export const registroSchema = z
  .object({
    primerNombre: campoNombre('El primer nombre es requerido.'),
    segundoNombre: z
      .string()
      .trim()
      .max(50, 'Máximo 50 caracteres.')
      .refine((v): boolean => v === '' || PATRON_NOMBRE.test(v), 'Usa solo letras.'),
    apellidoPaterno: campoNombre('El apellido paterno es requerido.'),
    apellidoMaterno: campoNombre('El apellido materno es requerido.'),
    correo: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es requerido.')
      .email('Ingresa un correo electrónico válido.'),
    telefono: z
      .string()
      .trim()
      .refine(telefonoValido, 'Ingresa un teléfono válido de al menos 10 dígitos.'),
    contrasena: contrasenaSchema,
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
