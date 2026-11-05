import { z } from 'zod'
import { cumpleReglasContrasena } from '@/features/auth/schemas/contrasena.schema'
import { cuentaDepositoContent } from '../content/configuracion.content'
import { validarClabe } from '../lib/clabe'

export const datosPersonalesSchema = z.object({
  telefono: z.string().trim().refine((v) => v === '' || /^[\d\s+()-]{8,20}$/.test(v), 'Escribe un teléfono válido (8 a 20 dígitos).'),
  zonaHoraria: z.string().min(1, 'Selecciona tu zona horaria.'),
})
export type DatosPersonalesFormValues = z.infer<typeof datosPersonalesSchema>

export const contrasenaFormSchema = z
  .object({
    actual: z.string().min(1, 'Escribe tu contraseña actual.'),
    nueva: z.string().refine(cumpleReglasContrasena, 'La contraseña no cumple los requisitos mínimos.'),
    confirmar: z.string().min(1, 'Confirma tu nueva contraseña.'),
  })
  .refine((d) => d.nueva === d.confirmar, { path: ['confirmar'], message: 'Las contraseñas no coinciden.' })
  .refine((d) => d.nueva !== d.actual, { path: ['nueva'], message: 'La nueva contraseña debe ser distinta de la actual.' })
export type ContrasenaFormValues = z.infer<typeof contrasenaFormSchema>

const { clabeErrors } = cuentaDepositoContent

export const cuentaDepositoSchema = z
  .object({
    titular: z.string().trim().min(5, 'Escribe el nombre completo del titular.').max(120, 'Máximo 120 caracteres.'),
    clabe: z.string().superRefine((valor, ctx) => {
      const { problema } = validarClabe(valor)
      if (problema) ctx.addIssue({ code: 'custom', message: clabeErrors[problema] })
    }),
    banco: z.string().min(1, 'Selecciona el banco.'),
    tipoCuenta: z.enum(['cheques', 'debito'], { error: 'Selecciona el tipo de cuenta.' }),
    pais: z.literal('MX'),
    moneda: z.literal('MXN'),
  })
  .refine((d) => validarClabe(d.clabe).problema !== null || d.clabe.slice(0, 3) === d.banco, { path: ['banco'], message: clabeErrors.mismatch })
export type CuentaDepositoFormValues = z.infer<typeof cuentaDepositoSchema>
