import { z } from 'zod'
import { extensionArchivo, formatearTamano } from '@/lib/archivos'
import { categoriasDocumento, REGLAS_ARCHIVO } from '../content/documentos.content'
import type { CategoriaDocumento } from '../types/documentos.types'

const CATEGORIAS = Object.keys(categoriasDocumento) as CategoriaDocumento[]

export function esCategoriaDocumento(valor: string): valor is CategoriaDocumento {
  return (CATEGORIAS as string[]).includes(valor)
}

export const cargaDocumentoSchema = z.object({
  archivo: z.custom<File | null>(() => true).superRefine((archivo, ctx) => {
    if (!(archivo instanceof File)) {
      ctx.addIssue({ code: 'custom', message: 'Selecciona un archivo.' })
      return
    }
    if (!REGLAS_ARCHIVO.extensiones.includes(extensionArchivo(archivo.name))) {
      ctx.addIssue({ code: 'custom', message: 'Formato no permitido. Usa PDF, Word, Excel, JPG o PNG.' })
    }
    if (archivo.size === 0) ctx.addIssue({ code: 'custom', message: 'El archivo está vacío.' })
    if (archivo.size > REGLAS_ARCHIVO.maximoBytes) {
      ctx.addIssue({ code: 'custom', message: `El archivo pesa ${formatearTamano(archivo.size)}; el máximo es 20 MB.` })
    }
    if (archivo.name.length > 150) ctx.addIssue({ code: 'custom', message: 'El nombre del archivo es demasiado largo (máximo 150 caracteres).' })
  }),
  categoria: z.string().refine((valor): boolean => esCategoriaDocumento(valor), 'Selecciona una categoría.'),
  descripcion: z.string().trim().max(500, 'Máximo 500 caracteres.'),
})

export type CargaDocumentoFormValues = z.infer<typeof cargaDocumentoSchema>

export const revisionDocumentoSchema = z.object({
  nota: z.string().trim().max(500, 'Máximo 500 caracteres.'),
})

export type RevisionDocumentoFormValues = z.infer<typeof revisionDocumentoSchema>
