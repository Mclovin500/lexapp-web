import { z } from 'zod'
import { especialidades, valoresDe } from '../content/catalogos.content'

const MENSAJE_ANIOS = 'Indica un número entero de años entre 0 y 60.'

export const credencialesSchema = z.object({
  // PROVISIONAL: confirmar formato con backend
  numeroCedula: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, 'La cédula debe tener 7 u 8 dígitos, sin letras ni espacios.'),
  universidad: z
    .string()
    .trim()
    .min(1, 'Indica tu universidad de procedencia.')
    .max(150, 'Máximo 150 caracteres.'),
  especialidad: z
    .string()
    .refine((v) => valoresDe(especialidades).includes(v), 'Selecciona tu especialidad profesional.'),
  /** Se captura como texto y se convierte a número al enviar. */
  aniosExperiencia: z
    .string()
    .trim()
    .regex(/^\d{1,2}$/, MENSAJE_ANIOS)
    .refine((v) => Number(v) <= 60, MENSAJE_ANIOS),
  /** Campo extra del diseño: opcional. */
  colegio: z.string().trim().max(150, 'Máximo 150 caracteres.'),
})

export type CredencialesFormValues = z.infer<typeof credencialesSchema>
