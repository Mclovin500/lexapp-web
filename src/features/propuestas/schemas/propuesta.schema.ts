import { z } from 'zod'
import { hoyIso } from '@/lib/fechas'
import { esImporteValido, sumarImportes } from '@/lib/importes'

const MENSAJE_IMPORTE = 'Escribe un importe válido mayor que cero, p. ej. 25000 o 25000.50.'
const importe = z.string().trim().refine(esImporteValido, MENSAJE_IMPORTE)

export const MAX_CONCEPTOS = 10

export const propuestaSchema = z
  .object({
    clienteId: z.string().min(1, 'Selecciona un cliente.'),
    /** '' = sin solicitud relacionada. */
    solicitudId: z.string(),
    servicio: z.string().trim().min(3, 'Escribe el nombre del servicio.').max(150, 'Máximo 150 caracteres.'),
    descripcion: z.string().trim().min(10, 'Describe el servicio en al menos 10 caracteres.').max(2000, 'Máximo 2000 caracteres.'),
    alcance: z.string().trim().max(2000, 'Máximo 2000 caracteres.'),
    honorarios: importe,
    conceptos: z
      .array(z.object({ concepto: z.string().trim().min(1, 'Escribe el concepto.').max(120, 'Máximo 120 caracteres.'), importe }))
      .max(MAX_CONCEPTOS, `Máximo ${MAX_CONCEPTOS} conceptos.`),
    condiciones: z.string().trim().min(10, 'Escribe las condiciones en al menos 10 caracteres.').max(3000, 'Máximo 3000 caracteres.'),
    tiempoEstimado: z.string().trim().min(1, 'Indica el tiempo estimado.').max(100, 'Máximo 100 caracteres.'),
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
