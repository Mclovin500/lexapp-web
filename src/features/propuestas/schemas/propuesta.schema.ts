import { z } from 'zod'
import { hoyIso } from '@/lib/fechas'
import { esImporteValido, sumarImportes } from '@/lib/importes'

const MENSAJE_IMPORTE = 'Escribe un importe válido mayor que cero, p. ej. 25000 o 25000.50.'
const importe = z.string().trim().refine(esImporteValido, MENSAJE_IMPORTE)

export const MAX_CONCEPTOS = 10

export const propuestaSchema = z
  .object({
    clienteId: z.string().min(1, 'Selecciona un cliente.'),
    /** El backend exige una solicitud: toda propuesta responde a una. */
    solicitudId: z.string().min(1, 'Selecciona la solicitud a la que respondes.'),
    servicio: z.string().trim().min(5, 'Escribe el nombre del servicio (mínimo 5 caracteres).').max(150, 'Máximo 150 caracteres.'),
    descripcion: z.string().trim().min(20, 'Describe el servicio en al menos 20 caracteres.').max(2000, 'Máximo 2000 caracteres.'),
    alcance: z.string().trim().max(1000, 'Máximo 1000 caracteres.'),
    honorarios: importe,
    conceptos: z
      .array(z.object({ concepto: z.string().trim().min(1, 'Escribe el concepto.').max(120, 'Máximo 120 caracteres.'), importe }))
      .max(MAX_CONCEPTOS, `Máximo ${MAX_CONCEPTOS} conceptos.`),
    condiciones: z.string().trim().min(10, 'Escribe las condiciones en al menos 10 caracteres.').max(1500, 'Máximo 1500 caracteres.'),
    /** Días (el backend acepta de 1 a 3650). */
    tiempoEstimado: z
      .string()
      .trim()
      .regex(/^\d{1,4}$/, 'Indica el tiempo estimado en días, p. ej. 30.')
      .refine((dias) => Number(dias) >= 1 && Number(dias) <= 3650, 'Entre 1 y 3650 días.'),
    fechaVigencia: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecciona la fecha de vigencia.')
      .refine((fecha) => fecha >= hoyIso(), 'La vigencia no puede ser anterior a hoy.'),
  })
  .refine(
    (datos) =>
      datos.conceptos.length === 0 ||
      datos.conceptos.some((c) => !esImporteValido(c.importe)) ||
      !esImporteValido(datos.honorarios) ||
      sumarImportes(datos.conceptos.map((c) => Number(c.importe))) === Number(datos.honorarios),
    { path: ['conceptos'], message: 'La suma de los conceptos debe ser igual a los honorarios.' },
  )

export type PropuestaFormValues = z.infer<typeof propuestaSchema>
