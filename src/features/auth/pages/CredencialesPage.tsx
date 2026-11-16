import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { FormularioCredenciales } from '../components/registro/FormularioCredenciales'
import { TarjetaRegistro } from '../components/registro/TarjetaRegistro'
import { credencialesContent } from '../content/credenciales.content'
import { leerBorradorRegistro } from '../lib/borrador-registro'

/** A4: credenciales profesionales (paso 2 de 3). Sin datos básicos en memoria → A3. */
export function CredencialesPage() {
  if (!leerBorradorRegistro().datosBasicos) {
    return <Navigate to={ROUTES.register} replace />
  }

  return (
    <MarcoAcceso>
      <TarjetaRegistro pasoActual={1} subtitle={credencialesContent.subtitle}>
        <FormularioCredenciales />
      </TarjetaRegistro>
    </MarcoAcceso>
  )
}
