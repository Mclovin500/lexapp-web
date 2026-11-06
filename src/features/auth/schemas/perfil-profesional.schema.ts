import { z } from 'zod'
import { esImporteValido } from '@/lib/importes'
import {
  areasPractica,
  disponibilidades,
  especializaciones,
  valoresDe,
} from '../content/catalogos.content'

export const LIMITE_BIOGRAFIA = 500
export const MAX_ESPECIALIZACIONES = 5
export const MAX_SERVICIOS = 5

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
  servicios: z
    .array(
      z.object({
        nombre: z.string().trim().min(3, 'Escribe el servicio.').max(100, 'Máximo 100 caracteres.'),
        descripcion: z.string().trim().max(200, 'Máximo 200 caracteres.'),
      }),
    )
    .min(1, 'Agrega al menos un servicio que ofreces.')
    .max(MAX_SERVICIOS, `Máximo ${MAX_SERVICIOS} servicios.`),
  consultaInicial: z.string().trim().refine((v) => v === '0' || esImporteValido(v), 'Escribe un importe; 0 si la primera consulta es sin costo.'),
  tarifaHora: z.string().trim().refine((v) => v === '' || esImporteValido(v), 'Importe no válido.'),
  fotoUrl: z.custom<string | null>(),
})

export type PerfilProfesionalFormValues = z.infer<typeof perfilProfesionalSchema>
