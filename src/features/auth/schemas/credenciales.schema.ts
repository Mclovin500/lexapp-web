import { z } from 'zod'
import { valoresDe } from '../content/catalogos.content'
import { especialidadesRegistro } from '../content/especialidades.content'

export const MAX_ESPECIALIDADES = 5

const MENSAJE_ANIOS = 'Indica un número entero de años entre 0 y 60.'

/** Formatos que acepta el backend (Utilities/FileValidator): PDF, JPG o PNG. */
export const TIPOS_ARCHIVO_CEDULA = ['application/pdf', 'image/jpeg', 'image/png']
/** El backend admite hasta 10 MB por petición; se deja margen para el resto del formulario. */
export const MAXIMO_ARCHIVO_CEDULA = 5 * 1024 * 1024

export function esArchivoCedulaValido(archivo: File): boolean {
  return TIPOS_ARCHIVO_CEDULA.includes(archivo.type) && archivo.size > 0 && archivo.size <= MAXIMO_ARCHIVO_CEDULA
}

/** A4: campos de `RegistroAbogadoRequest` (CedulaProfesional, ArchivoCedula, ExperienciaAnios, EspecialidadesIds). */
export const credencialesSchema = z.object({
  /** IDs de la tabla `especialidades` (como texto). */
  especialidades: z
    .array(z.string())
    .min(1, 'Selecciona al menos una especialidad.')
    .max(MAX_ESPECIALIDADES, `Selecciona hasta ${MAX_ESPECIALIDADES} especialidades.`)
    .refine((lista) => lista.every((v) => valoresDe(especialidadesRegistro).includes(v)), 'Selección no válida.'),
  numeroCedula: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, 'La cédula debe tener 7 u 8 dígitos, sin letras ni espacios.'),
  /** Se captura como texto y se convierte a número al enviar. */
  aniosExperiencia: z
    .string()
    .trim()
    .regex(/^\d{1,2}$/, MENSAJE_ANIOS)
    .refine((v) => Number(v) <= 60, MENSAJE_ANIOS),
  /** Archivo de la cédula profesional: obligatorio. Se sube junto con el registro en A5. */
  archivoCedula: z
    .custom<File | null>()
    .refine((v): boolean => v instanceof File, 'Sube tu cédula profesional (PDF, JPG o PNG).'),
})

export type CredencialesFormValues = z.infer<typeof credencialesSchema>
