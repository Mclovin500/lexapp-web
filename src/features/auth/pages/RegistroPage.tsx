import { FormularioRegistro } from '../components/FormularioRegistro'
import { MarcoAcceso } from '../components/MarcoAcceso'
import { TarjetaRegistro } from '../components/registro/TarjetaRegistro'
import { registroContent } from '../content/registro.content'

/** A3: registro básico del abogado. Al enviarse correctamente → A3A (verificación de correo). */
export function RegistroPage() {
  return (
    <MarcoAcceso>
      <TarjetaRegistro pasoActual={0} subtitle={registroContent.subtitle}>
        <FormularioRegistro />
      </TarjetaRegistro>
    </MarcoAcceso>
  )
}
