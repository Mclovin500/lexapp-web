/** "pdf" para "Contrato.final.PDF"; '' si no tiene extensión. */
export function extensionArchivo(nombre: string): string {
  const punto = nombre.lastIndexOf('.')
  return punto > 0 ? nombre.slice(punto + 1).toLowerCase() : ''
}

/** Descarga una URL (temporal) con el nombre indicado. */
export function descargarUrl(url: string, nombre: string): void {
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  enlace.rel = 'noopener'
  document.body.append(enlace)
  enlace.click()
  enlace.remove()
}

/** "1.4 MB", "420 KB" */
export function formatearTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
