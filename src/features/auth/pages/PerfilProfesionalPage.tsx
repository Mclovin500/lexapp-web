import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { FormularioPerfil } from '../components/registro/FormularioPerfil'
import { TarjetaRegistro } from '../components/registro/TarjetaRegistro'
import { perfilProfesionalContent } from '../content/perfil-profesional.content'
import { leerBorradorRegistro } from '../lib/borrador-registro'

/**
 * A5: perfil profesional (paso 3 de 3). "Crear mi cuenta" envía todo al backend → A3A.
 * Sin pasos previos en memoria (p. ej. tras recargar) → regresa al que falte.
 */
export function PerfilProfesionalPage() {
  const { datosBasicos, credenciales } = leerBorradorRegistro()
  if (!datosBasicos) return <Navigate to={ROUTES.register} replace />
  if (!credenciales) return <Navigate to={ROUTES.registerCredentials} replace />

  return (
    <MarcoAcceso>
      <TarjetaRegistro pasoActual={2} subtitle={perfilProfesionalContent.subtitle}>
        <FormularioPerfil datosBasicos={datosBasicos} credenciales={credenciales} />
      </TarjetaRegistro>
    </MarcoAcceso>
  )
}
