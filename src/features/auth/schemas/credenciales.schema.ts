import { z } from 'zod'
import { especialidades, gradosAcademicos, valoresDe } from '../content/catalogos.content'
import type { DocumentoRegistro } from '../types/registro-profesional.types'

const MENSAJE_ANIOS = 'Indica un número entero de años entre 0 y 60.'

export const credencialesSchema = z.object({
  // PROVISIONAL: confirmar formato con backend
  numeroCedula: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, 'La cédula debe tener 7 u 8 dígitos, sin letras ni espacios.'),
  gradoAcademico: z.string().refine((v): boolean => valoresDe(gradosAcademicos).includes(v), 'Selecciona tu grado académico.'),
  tituloObtenido: z.string().trim().min(5, 'Escribe el título que obtuviste, p. ej. Licenciatura en Derecho.').max(150, 'Máximo 150 caracteres.'),
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
  /** "Documentación requerida": la cédula es obligatoria; el título, opcional. */
  documentoCedula: z.custom<DocumentoRegistro | null>().refine((v): boolean => v !== null, 'Sube tu cédula profesional (PDF, JPG o PNG).'),
  documentoTitulo: z.custom<DocumentoRegistro | null>(),
})

export type CredencialesFormValues = z.infer<typeof credencialesSchema>
