import { z } from 'zod'
import {
  areasPractica,
  disponibilidades,
  especializaciones,
  valoresDe,
} from '../content/catalogos.content'

export const LIMITE_BIOGRAFIA = 500
export const MAX_ESPECIALIZACIONES = 5

export const perfilProfesionalSchema = z.object({
  areaPractica: z
    .string()
    .refine((v) => valoresDe(areasPractica).includes(v), 'Selecciona tu área de práctica principal.'),
  especializaciones: z
    .array(z.string())
    .max(MAX_ESPECIALIZACIONES, `Selecciona hasta ${MAX_ESPECIALIZACIONES} especializaciones.`)
    .refine((lista) => lista.every((v) => valoresDe(especializaciones).includes(v)), 'Selección no válida.'),
  biografia: z
    .string()
    .trim()
    .min(1, 'Describe brevemente tu trayectoria profesional.')
    .max(LIMITE_BIOGRAFIA, `Máximo ${LIMITE_BIOGRAFIA} caracteres.`),
  idiomas: z.string().trim().max(150, 'Máximo 150 caracteres.'),
  jurisdicciones: z.string().trim().max(150, 'Máximo 150 caracteres.'),
  disponibilidad: z
    .string()
    .refine((v) => valoresDe(disponibilidades).includes(v), 'Selecciona tu disponibilidad inicial.'),
})

export type PerfilProfesionalFormValues = z.infer<typeof perfilProfesionalSchema>
