/** `GET /abogado/datos-personales` (J1). Nombre y correo son de solo lectura. */
export interface DatosPersonales {
  nombreCompleto: string
  correo: string
  telefono: string | null
  zonaHoraria: string
}

/** `PUT /abogado/datos-personales`. */
export interface PeticionDatosPersonales {
  telefono: string | null
  zonaHoraria: string
}

/** `POST /abogado/contrasena`. Al cambiarla se cierran las demás sesiones. */
export interface PeticionCambioContrasena {
  contrasenaActual: string
  contrasenaNueva: string
}

/** `GET /abogado/sesiones`. */
export interface SesionActiva {
  id: string
  dispositivo: string
  navegador: string
  /** Ubicación aproximada (ciudad), sin IP completa. */
  ubicacion: string
  ultimaActividad: string
  actual: boolean
}

export type CategoriaNotificacion = 'solicitudes' | 'mensajes' | 'propuestas' | 'documentos' | 'pagos' | 'reuniones' | 'expedientes'
export type CanalNotificacion = 'correo' | 'push'

/** `GET` / `PUT /abogado/preferencias/notificaciones`. Las notificaciones dentro de la app (B1A) siempre están activas. */
export type PreferenciasNotificaciones = Record<CategoriaNotificacion, Record<CanalNotificacion, boolean>>

/** `GET` / `PUT /abogado/preferencias/privacidad`. */
export interface PreferenciasPrivacidad {
  mostrarTelefonoAClientes: boolean
  mostrarFotoEnPerfil: boolean
  recibirComunicacionesLexApp: boolean
}

/** Estados de J1A (especificación). */
export type EstadoCuentaDeposito = 'sin_cuenta' | 'pendiente' | 'verificada' | 'rechazada'
export type TipoCuentaBancaria = 'cheques' | 'debito'

/**
 * `GET /abogado/cuenta-deposito`. La CLABE nunca regresa completa: solo los últimos 4 dígitos.
 * Es la cuenta donde el abogado recibe sus honorarios; no es para tarjetas.
 */
export interface CuentaDeposito {
  estado: EstadoCuentaDeposito
  cuenta: {
    titular: string
    banco: { clave: string; nombre: string }
    clabeTerminacion: string
    tipoCuenta: TipoCuentaBancaria
    pais: 'MX'
    moneda: 'MXN'
  } | null
  motivoRechazo: string | null
  actualizadaEn: string | null
}

/** `PUT /abogado/cuenta-deposito`: la cuenta queda "pendiente" hasta que se verifica. */
export interface PeticionCuentaDeposito {
  titular: string
  /** Clave de 3 dígitos del banco (los primeros de la CLABE). */
  banco: string
  clabe: string
  tipoCuenta: TipoCuentaBancaria
  pais: 'MX'
  moneda: 'MXN'
}

/** J1A → J1: aviso al guardar la cuenta. */
export interface EstadoCuentaGuardada {
  cuentaGuardada: true
}
