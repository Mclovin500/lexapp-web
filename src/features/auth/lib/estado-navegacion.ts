import type {
  EstadoCodigoRecuperacion,
  EstadoContrasenaActualizada,
  EstadoNuevaContrasena,
  EstadoVerificacionCorreo,
  EstadoVerificacionLogin,
} from '../types/estado-navegacion.types'

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null
}

function esTexto(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.length > 0
}

function esSegundos(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0
}

export function esEstadoVerificacionLogin(valor: unknown): valor is EstadoVerificacionLogin {
  return (
    esObjeto(valor) &&
    esTexto(valor.correoEnmascarado) &&
    esSegundos(valor.reenviarEnSegundos) &&
    esSegundos(valor.expiraEnSegundos)
  )
}

export function esEstadoVerificacionCorreo(valor: unknown): valor is EstadoVerificacionCorreo {
  return esEstadoVerificacionLogin(valor)
}

export function esEstadoCodigoRecuperacion(valor: unknown): valor is EstadoCodigoRecuperacion {
  return (
    esObjeto(valor) &&
    esTexto(valor.correo) &&
    esTexto(valor.correoEnmascarado) &&
    esSegundos(valor.reenviarEnSegundos) &&
    esSegundos(valor.expiraEnSegundos)
  )
}

export function esEstadoNuevaContrasena(valor: unknown): valor is EstadoNuevaContrasena {
  return esObjeto(valor) && esTexto(valor.tokenRestablecimiento)
}

export function esEstadoContrasenaActualizada(
  valor: unknown,
): valor is EstadoContrasenaActualizada {
  return esObjeto(valor) && valor.contrasenaActualizada === true
}
