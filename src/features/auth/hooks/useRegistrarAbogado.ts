import { useMutation } from '@tanstack/react-query'
import { registrarAbogado } from '../services/registro.service'
import type { DatosRegistro, ErrorRegistro, RespuestaRegistro } from '../types/registro.types'

export function useRegistrarAbogado() {
  return useMutation<RespuestaRegistro, ErrorRegistro, DatosRegistro>({
    mutationFn: registrarAbogado,
  })
}
