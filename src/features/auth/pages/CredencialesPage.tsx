import { MarcoAcceso } from '../components/MarcoAcceso'
import { ConProgresoRegistro } from '../components/registro/ConProgresoRegistro'
import { FormularioCredenciales } from '../components/registro/FormularioCredenciales'
import { TarjetaRegistro } from '../components/registro/TarjetaRegistro'
import { credencialesContent } from '../content/credenciales.content'

/** A4: credenciales profesionales (paso 2 de 3). Precarga lo guardado y continúa a A5. */
export function CredencialesPage() {
  return (
    <MarcoAcceso>
      <TarjetaRegistro pasoActual={1} subtitle={credencialesContent.subtitle}>
        <ConProgresoRegistro>
          {(progreso) => <FormularioCredenciales guardadas={progreso?.credenciales} />}
        </ConProgresoRegistro>
      </TarjetaRegistro>
    </MarcoAcceso>
  )
}
