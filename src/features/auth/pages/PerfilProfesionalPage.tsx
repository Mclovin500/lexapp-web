import { MarcoAcceso } from '../components/MarcoAcceso'
import { ConProgresoRegistro } from '../components/registro/ConProgresoRegistro'
import { FormularioPerfil } from '../components/registro/FormularioPerfil'
import { TarjetaRegistro } from '../components/registro/TarjetaRegistro'
import { perfilProfesionalContent } from '../content/perfil-profesional.content'

/** A5: área de práctica y perfil (paso 3 de 3). "Crear mi cuenta" envía a validación → A5A. */
export function PerfilProfesionalPage() {
  return (
    <MarcoAcceso>
      <TarjetaRegistro pasoActual={2} subtitle={perfilProfesionalContent.subtitle}>
        <ConProgresoRegistro>
          {(progreso) => <FormularioPerfil guardado={progreso?.perfil} />}
        </ConProgresoRegistro>
      </TarjetaRegistro>
    </MarcoAcceso>
  )
}
