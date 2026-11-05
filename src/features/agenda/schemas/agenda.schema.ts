import { z } from 'zod'
import { DURACIONES_MINUTOS } from '../content/agenda.content'

const FECHA = /^\d{4}-\d{2}-\d{2}$/
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/

export const reunionSchema = z
  .object({
    clienteId: z.string().min(1, 'Selecciona un cliente.'),
    /** '' = sin expediente. */
    expedienteId: z.string(),
    titulo: z.string().trim().min(3, 'Escribe el asunto de la reunión.').max(120, 'Máximo 120 caracteres.'),
    fecha: z.string().regex(FECHA, 'Selecciona el día.'),
    hora: z.string().regex(HORA, 'Selecciona la hora.'),
    duracion: z.string().refine((v) => DURACIONES_MINUTOS.includes(Number(v)), 'Selecciona la duración.'),
    notas: z.string().trim().max(500, 'Máximo 500 caracteres.'),
  })
  .refine((d) => !FECHA.test(d.fecha) || !HORA.test(d.hora) || new Date(`${d.fecha}T${d.hora}`).getTime() > Date.now(), {
    path: ['hora'],
    message: 'La reunión debe ser en una fecha y hora futuras.',
  })

export type ReunionFormValues = z.infer<typeof reunionSchema>

export const disponibilidadSchema = z
  .object({
    dias: z.array(z.object({ dia: z.number(), activo: z.boolean(), inicio: z.string().regex(HORA), fin: z.string().regex(HORA) })),
    duracionMinutos: z.string(),
    margenMinutos: z.string(),
  })
  .refine((d) => d.dias.some((x) => x.activo), { path: ['dias'], message: 'Activa al menos un día.' })
  .refine((d) => d.dias.every((x) => !x.activo || x.inicio < x.fin), { path: ['dias'], message: 'La hora final debe ser posterior a la inicial.' })

export type DisponibilidadFormValues = z.infer<typeof disponibilidadSchema>
