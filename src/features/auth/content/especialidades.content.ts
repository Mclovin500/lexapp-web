import type { OpcionCatalogo } from './catalogos.content'

/**
 * Espejo de la tabla `especialidades` de la base de datos (id_especialidad → nombre_especialidad).
 * El backend recibe los IDs en `RegistroAbogadoRequest.EspecialidadesIds`, pero no expone un endpoint
 * para listarlas; si se agregan especialidades en la base, hay que agregarlas aquí con el mismo id.
 * `valor` es el id como texto (lo que maneja el selector); se convierte a número al enviar.
 */
export const especialidadesRegistro: OpcionCatalogo[] = [
  { valor: '1', etiqueta: 'Derecho Penal' },
]
