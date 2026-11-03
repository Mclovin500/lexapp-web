export type TipoPerfil = 'abogado' | 'cliente'

/**
 * Estado que P03 envía a la siguiente pantalla al navegar.
 * A3 puede leerlo con `useLocation().state` e incluir `tipoPerfil`
 * en la petición de registro cuando el backend lo requiera.
 */
export interface EstadoNavegacionPerfil {
  tipoPerfil: TipoPerfil
}
