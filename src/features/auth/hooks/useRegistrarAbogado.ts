import { useMutation } from '@tanstack/react-query'
import { registrarAbogado } from '../services/registro.service'
import { enviarCodigoCorreo } from '../services/verificacion-correo.service'
import type { ErrorAutenticacion } from '../types/auth.types'
import type { DatosRegistroAbogado } from '../types/registro.types'

/**
 * A5 "Crear mi cuenta": crea la cuenta y pide el código de verificación del correo.
 * Si el envío del código falla, la cuenta ya existe: A3A permite reenviarlo.
 */
export function useRegistrarAbogado() {
  return useMutation<{ codigoEnviado: boolean }, ErrorAutenticacion, DatosRegistroAbogado>({
    mutationFn: async (datos) => {
      await registrarAbogado(datos)
      try {
        await enviarCodigoCorreo({ correo: datos.correo })
        return { codigoEnviado: true }
      } catch {
        return { codigoEnviado: false }
      }
    },
  })
}
