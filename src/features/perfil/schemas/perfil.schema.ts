import { z } from 'zod'
import { areasPractica, disponibilidades, especializaciones, valoresDe } from '@/features/auth/content/catalogos.content'
import { esImporteValido } from '@/lib/importes'
import { LIMITE_DESCRIPCION, MAX_AREAS, MAX_ELEMENTOS_LISTA, MAX_ESPECIALIDADES } from '../content/perfil.content'

const ANIO_ACTUAL = new Date().getFullYear()
const anio = z
  .string()
  .regex(/^\d{4}$/, 'Año de 4 dígitos.')
  .refine((v) => Number(v) >= 1950 && Number(v) <= ANIO_ACTUAL, `Entre 1950 y ${ANIO_ACTUAL}.`)
const anioOpcional = z.string().refine((v) => v === '' || (/^\d{4}$/.test(v) && Number(v) >= 1950 && Number(v) <= ANIO_ACTUAL), `Vacío o entre 1950 y ${ANIO_ACTUAL}.`)
const periodoValido = (d: { anioInicio: string; anioFin: string }) => d.anioFin === '' || Number(d.anioFin) >= Number(d.anioInicio)
const importeOpcional = z.string().trim().refine((v) => v === '' || esImporteValido(v), 'Importe no válido.')

export const perfilSchema = z.object({
  aniosExperiencia: z.string().regex(/^\d{1,2}$/, 'Escribe un número de 0 a 99.'),
  descripcion: z.string().trim().min(50, 'Describe tu trayectoria en al menos 50 caracteres.').max(LIMITE_DESCRIPCION, `Máximo ${LIMITE_DESCRIPCION} caracteres.`),
  idiomas: z.string().trim().max(150, 'Máximo 150 caracteres.'),
  areasPractica: z
    .array(z.string())
    .min(1, 'Elige al menos un área de práctica.')
    .max(MAX_AREAS, `Elige hasta ${MAX_AREAS} áreas.`)
    .refine((lista) => lista.every((v) => valoresDe(areasPractica).includes(v)), 'Selección no válida.'),
  especialidades: z
    .array(z.string())
    .max(MAX_ESPECIALIDADES, `Elige hasta ${MAX_ESPECIALIDADES} especialidades.`)
    .refine((lista) => lista.every((v) => valoresDe(especializaciones).includes(v)), 'Selección no válida.'),
  formacion: z
    .array(
      z
        .object({
          id: z.string(),
          titulo: z.string().trim().min(3, 'Escribe el título.').max(120, 'Máximo 120 caracteres.'),
          institucion: z.string().trim().min(3, 'Escribe la institución.').max(120, 'Máximo 120 caracteres.'),
          anioInicio: anio,
          anioFin: anioOpcional,
        })
        .refine(periodoValido, { path: ['anioFin'], message: 'No puede ser anterior al inicio.' }),
    )
    .max(MAX_ELEMENTOS_LISTA),
  experiencia: z
    .array(
      z
        .object({
          id: z.string(),
          cargo: z.string().trim().min(3, 'Escribe el cargo.').max(100, 'Máximo 100 caracteres.'),
          organizacion: z.string().trim().min(2, 'Escribe la organización.').max(120, 'Máximo 120 caracteres.'),
          anioInicio: anio,
          anioFin: anioOpcional,
          descripcion: z.string().trim().max(300, 'Máximo 300 caracteres.'),
        })
        .refine(periodoValido, { path: ['anioFin'], message: 'No puede ser anterior al inicio.' }),
    )
    .max(MAX_ELEMENTOS_LISTA),
  servicios: z
    .array(
      z.object({
        id: z.string(),
        nombre: z.string().trim().min(3, 'Escribe el servicio.').max(100, 'Máximo 100 caracteres.'),
        descripcion: z.string().trim().max(200, 'Máximo 200 caracteres.'),
      }),
    )
    .max(MAX_ELEMENTOS_LISTA),
  consultaInicial: z.string().trim().refine((v) => v === '0' || esImporteValido(v), 'Escribe un importe; 0 si es sin costo.'),
  tarifaHora: importeOpcional,
  notaHonorarios: z.string().trim().max(300, 'Máximo 300 caracteres.'),
  aceptaNuevosCasos: z.boolean(),
  modalidad: z.string().refine((v) => valoresDe(disponibilidades).includes(v), 'Selecciona la modalidad.'),
})

export type PerfilFormValues = z.infer<typeof perfilSchema>
