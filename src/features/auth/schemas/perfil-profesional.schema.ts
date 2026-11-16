import { z } from 'zod'
import { esImporteValido } from '@/lib/importes'

export const LIMITE_BIOGRAFIA = 500
export const LIMITE_DIRECCION = 255
/** `TarifaPorHoraCentavos` es `int` (32 bits) en el backend. */
const MAXIMO_CENTAVOS = 2_147_483_647

/**
 * A5: campos de `RegistroAbogadoRequest` (Bio, DireccionOficina, TarifaPorHoraCentavos).
 * `FotoUrl` no se captura: `abogados.foto_url` es un varchar corto y el backend no tiene
 * endpoint para subir imágenes; enviar la foto en base64 provoca un 500 (Postgres 22001).
 */
export const perfilProfesionalSchema = z.object({
  biografia: z
    .string()
    .trim()
    .min(1, 'Describe brevemente tu trayectoria profesional.')
    .max(LIMITE_BIOGRAFIA, `Máximo ${LIMITE_BIOGRAFIA} caracteres.`),
  /** Vacío = sin dirección. */
  direccionOficina: z.string().trim().max(LIMITE_DIRECCION, `Máximo ${LIMITE_DIRECCION} caracteres.`),
  /** Pesos MXN como texto; se envían en centavos (`int` en el backend). Vacío = sin tarifa. */
  tarifaHora: z
    .string()
    .trim()
    .refine((v) => v === '' || esImporteValido(v), 'Importe no válido.')
    .refine((v) => v === '' || Math.round(Number(v) * 100) <= MAXIMO_CENTAVOS, 'El importe es demasiado alto.'),
})

export type PerfilProfesionalFormValues = z.infer<typeof perfilProfesionalSchema>
