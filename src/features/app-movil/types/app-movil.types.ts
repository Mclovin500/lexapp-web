export type TiendaMovil = 'google-play' | 'app-store'

export interface EnlaceTienda {
  tienda: TiendaMovil
  /** URL pública de la ficha en la tienda. Si no está configurada, el botón se muestra deshabilitado. */
  url: string | undefined
  caption: string
  name: string
  title: string
}
