import { z } from 'zod'
import { esImporteValido } from '@/lib/importes'

const FECHA = /^\d{4}-\d{2}-\d{2}$/

export const cobroSchema = z
  .object({
    clienteId: z.string().min(1, 'Selecciona un cliente.'),
    expedienteId: z.string().min(1, 'Selecciona el expediente relacionado.'),
    concepto: z.string().trim().min(3, 'Escribe el concepto del cobro.').max(120, 'Máximo 120 caracteres.'),
    descripcion: z.string().trim().min(10, 'Describe el cobro en al menos 10 caracteres.').max(1000, 'Máximo 1000 caracteres.'),
    importe: z.string().trim().refine(esImporteValido, 'Escribe un importe válido mayor que cero, p. ej. 12800 o 12800.50.'),
    fechaEmision: z.string().regex(FECHA, 'Selecciona la fecha.'),
    /** '' = no corresponde. */
    fechaLimite: z.string().refine((v) => v === '' || FECHA.test(v), 'Fecha no válida.'),
  })
  .refine((d) => d.fechaLimite === '' || d.fechaLimite >= d.fechaEmision, {
    path: ['fechaLimite'],
    message: 'La fecha límite no puede ser anterior a la fecha del cobro.',
  })

export type CobroFormValues = z.infer<typeof cobroSchema>
