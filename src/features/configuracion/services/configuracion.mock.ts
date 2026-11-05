// MOCK: eliminar al conectar el backend
import { esperar, haceMinutos, SIMULAR_ERROR_RED } from '@/api/mock-utils'
import { ErrorApi } from '@/api/errores'
import { NOMBRE_ABOGADO_MOCK } from '@/features/perfil/services/perfil.mock'
import { BANCOS } from '../lib/clabe'
import type {
  CuentaDeposito,
  DatosPersonales,
  EstadoCuentaDeposito,
  PeticionCambioContrasena,
  PeticionCuentaDeposito,
  PeticionDatosPersonales,
  PreferenciasNotificaciones,
  PreferenciasPrivacidad,
  SesionActiva,
} from '../types/configuracion.types'

/** La misma contraseña de prueba que P02 (`abogado@demo.com`). */
const CONTRASENA_ACTUAL_MOCK = 'Demo1234!'
/** Tiempo que tarda la "verificación" de una cuenta nueva. */
const VERIFICACION_MS = 15_000

let datos: DatosPersonales = {
  nombreCompleto: `Lic. ${NOMBRE_ABOGADO_MOCK}`,
  correo: 'alejandro.morales@despacho.mx',
  telefono: '55 1234 5678',
  zonaHoraria: 'America/Mexico_City',
}

let sesiones: SesionActiva[] = [
  { id: 'ses-1', dispositivo: 'Computadora Windows', navegador: 'Chrome', ubicacion: 'Ciudad de México, MX', ultimaActividad: haceMinutos(0), actual: true },
  { id: 'ses-2', dispositivo: 'iPhone', navegador: 'Safari', ubicacion: 'Ciudad de México, MX', ultimaActividad: haceMinutos(18), actual: false },
  { id: 'ses-3', dispositivo: 'MacBook', navegador: 'Firefox', ubicacion: 'Monterrey, MX', ultimaActividad: haceMinutos(60 * 50), actual: false },
]

const todos = (correo: boolean, push: boolean) => ({ correo, push })
let notificaciones: PreferenciasNotificaciones = {
  solicitudes: todos(true, true),
  mensajes: todos(false, true),
  propuestas: todos(true, true),
  documentos: todos(true, false),
  pagos: todos(true, true),
  reuniones: todos(true, true),
  expedientes: todos(false, true),
}

let privacidad: PreferenciasPrivacidad = { mostrarTelefonoAClientes: false, mostrarFotoEnPerfil: true, recibirComunicacionesLexApp: false }

interface CuentaMock {
  estado: EstadoCuentaDeposito
  cuenta: CuentaDeposito['cuenta']
  motivoRechazo: string | null
  actualizadaEn: string | null
  verificarEn: number | null
}

const BBVA = BANCOS[1]
let cuentaDeposito: CuentaMock = {
  estado: 'verificada',
  cuenta: { titular: NOMBRE_ABOGADO_MOCK, banco: { ...BBVA }, clabeTerminacion: '4519', tipoCuenta: 'cheques', pais: 'MX', moneda: 'MXN' },
  motivoRechazo: null,
  actualizadaEn: haceMinutos(60 * 24 * 40),
  verificarEn: null,
}
/** `?estado=` en J1A cambia el estado inicial (solo hasta guardar una cuenta). */
let cuentaModificada = false

async function simularRed(milisegundos?: number): Promise<void> {
  await esperar(milisegundos)
  if (SIMULAR_ERROR_RED) throw new ErrorApi('red')
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ').trim().toLowerCase()
}

export async function obtenerDatosPersonalesMock(): Promise<DatosPersonales> {
  await simularRed(300)
  return { ...datos }
}

export async function guardarDatosPersonalesMock(peticion: PeticionDatosPersonales): Promise<void> {
  await simularRed(500)
  if (peticion.telefono !== null && !/^[\d\s+()-]{8,20}$/.test(peticion.telefono)) throw new ErrorApi('datos_invalidos')
  datos = { ...datos, ...peticion }
}

/** 422 si la contraseña actual no coincide. Al cambiarla se cierran las demás sesiones. */
export async function cambiarContrasenaMock(peticion: PeticionCambioContrasena): Promise<void> {
  await simularRed(700)
  if (peticion.contrasenaActual !== CONTRASENA_ACTUAL_MOCK) throw new ErrorApi('datos_invalidos')
  if (peticion.contrasenaNueva === peticion.contrasenaActual) throw new ErrorApi('conflicto')
  sesiones = sesiones.filter((s) => s.actual)
}

export async function listarSesionesMock(): Promise<SesionActiva[]> {
  await simularRed(300)
  return sesiones.map((s) => (s.actual ? { ...s, ultimaActividad: new Date().toISOString() } : { ...s }))
}

export async function cerrarSesionRemotaMock(id: string): Promise<void> {
  await simularRed(400)
  const sesion = sesiones.find((s) => s.id === id)
  if (!sesion) throw new ErrorApi('no_encontrado')
  if (sesion.actual) throw new ErrorApi('conflicto')
  sesiones = sesiones.filter((s) => s.id !== id)
}

export async function cerrarOtrasSesionesMock(): Promise<void> {
  await simularRed(400)
  sesiones = sesiones.filter((s) => s.actual)
}

export async function obtenerNotificacionesMock(): Promise<PreferenciasNotificaciones> {
  await simularRed(300)
  return structuredClone(notificaciones)
}

export async function guardarNotificacionesMock(preferencias: PreferenciasNotificaciones): Promise<void> {
  await simularRed(500)
  notificaciones = structuredClone(preferencias)
}

export async function obtenerPrivacidadMock(): Promise<PreferenciasPrivacidad> {
  await simularRed(300)
  return { ...privacidad }
}

export async function guardarPrivacidadMock(preferencias: PreferenciasPrivacidad): Promise<void> {
  await simularRed(500)
  privacidad = { ...preferencias }
}

export async function solicitarExportacionMock(): Promise<{ correo: string }> {
  await simularRed(500)
  return { correo: datos.correo }
}

function estadoInicialDeUrl(): EstadoCuentaDeposito | null {
  const valor = new URLSearchParams(window.location.search).get('estado')
  return valor === 'sin_cuenta' || valor === 'pendiente' || valor === 'verificada' || valor === 'rechazada' ? valor : null
}

/** "Verifica" la cuenta pendiente al pasar el tiempo: aprobada si el titular coincide con el abogado. */
function resolverVerificacion(): void {
  if (cuentaDeposito.estado !== 'pendiente' || cuentaDeposito.verificarEn === null || Date.now() < cuentaDeposito.verificarEn) return
  const coincide = normalizar(cuentaDeposito.cuenta?.titular ?? '') === normalizar(NOMBRE_ABOGADO_MOCK)
  cuentaDeposito = {
    ...cuentaDeposito,
    estado: coincide ? 'verificada' : 'rechazada',
    motivoRechazo: coincide ? null : 'El titular de la cuenta no coincide con el nombre del abogado registrado. Solo se aceptan cuentas a tu nombre.',
    verificarEn: null,
    actualizadaEn: new Date().toISOString(),
  }
}

export async function obtenerCuentaDepositoMock(): Promise<CuentaDeposito> {
  await simularRed(400)
  resolverVerificacion()
  const forzado = cuentaModificada ? null : estadoInicialDeUrl()
  if (forzado === 'sin_cuenta') return { estado: 'sin_cuenta', cuenta: null, motivoRechazo: null, actualizadaEn: null }
  if (forzado) {
    return {
      estado: forzado,
      cuenta: cuentaDeposito.cuenta && { ...cuentaDeposito.cuenta, banco: { ...cuentaDeposito.cuenta.banco } },
      motivoRechazo: forzado === 'rechazada' ? 'La CLABE no corresponde a una cuenta a tu nombre.' : null,
      actualizadaEn: cuentaDeposito.actualizadaEn,
    }
  }
  const { estado, cuenta, motivoRechazo, actualizadaEn } = cuentaDeposito
  return { estado, cuenta: cuenta && { ...cuenta, banco: { ...cuenta.banco } }, motivoRechazo, actualizadaEn }
}

export async function guardarCuentaDepositoMock(peticion: PeticionCuentaDeposito): Promise<void> {
  await simularRed(800)
  const banco = BANCOS.find((b) => b.clave === peticion.banco)
  if (!banco || !/^\d{18}$/.test(peticion.clabe) || peticion.clabe.slice(0, 3) !== banco.clave || peticion.titular.trim().length < 5) {
    throw new ErrorApi('datos_invalidos')
  }
  cuentaModificada = true
  cuentaDeposito = {
    estado: 'pendiente',
    cuenta: { titular: peticion.titular.trim(), banco: { ...banco }, clabeTerminacion: peticion.clabe.slice(-4), tipoCuenta: peticion.tipoCuenta, pais: 'MX', moneda: 'MXN' },
    motivoRechazo: null,
    actualizadaEn: new Date().toISOString(),
    verificarEn: Date.now() + VERIFICACION_MS,
  }
}

export async function cerrarSesionMock(): Promise<void> {
  await simularRed(400)
}
