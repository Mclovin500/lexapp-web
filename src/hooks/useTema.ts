import { useCallback, useSyncExternalStore } from 'react'

export type Tema = 'claro' | 'oscuro'

/** Clave en localStorage. Debe coincidir con el script de index.html. */
export const CLAVE_TEMA = 'lexapp-tema'

const consultaSistema = '(prefers-color-scheme: dark)'

function leerPreferencia(): Tema | null {
  try {
    const valor = window.localStorage.getItem(CLAVE_TEMA)
    return valor === 'claro' || valor === 'oscuro' ? valor : null
  } catch {
    return null
  }
}

function temaActual(): Tema {
  return document.documentElement.classList.contains('dark') ? 'oscuro' : 'claro'
}

function aplicarTema(tema: Tema) {
  document.documentElement.classList.toggle('dark', tema === 'oscuro')
}

const suscriptores = new Set<() => void>()

function notificar() {
  suscriptores.forEach((fn) => fn())
}

function suscribir(fn: () => void) {
  suscriptores.add(fn)
  const media = window.matchMedia(consultaSistema)
  // Si el usuario nunca eligió, se sigue la configuración del sistema.
  const alCambiarSistema = (evento: MediaQueryListEvent) => {
    if (leerPreferencia() === null) {
      aplicarTema(evento.matches ? 'oscuro' : 'claro')
      notificar()
    }
  }
  // Sincroniza entre pestañas abiertas.
  const alCambiarStorage = (evento: StorageEvent) => {
    if (evento.key !== CLAVE_TEMA) return
    const preferencia = leerPreferencia()
    aplicarTema(preferencia ?? (media.matches ? 'oscuro' : 'claro'))
    notificar()
  }
  media.addEventListener('change', alCambiarSistema)
  window.addEventListener('storage', alCambiarStorage)
  return () => {
    suscriptores.delete(fn)
    media.removeEventListener('change', alCambiarSistema)
    window.removeEventListener('storage', alCambiarStorage)
  }
}

/**
 * Tema visual (claro / oscuro). La clase `.dark` en <html> la aplica primero
 * el script de index.html (evita el parpadeo) y este hook la mantiene al día.
 */
export function useTema() {
  const tema = useSyncExternalStore(suscribir, temaActual, () => 'claro' as Tema)

  const cambiarTema = useCallback((nuevo: Tema) => {
    aplicarTema(nuevo)
    try {
      window.localStorage.setItem(CLAVE_TEMA, nuevo)
    } catch {
      // Sin almacenamiento disponible: el cambio aplica solo a esta visita.
    }
    notificar()
  }, [])

  const alternarTema = useCallback(() => {
    cambiarTema(temaActual() === 'oscuro' ? 'claro' : 'oscuro')
  }, [cambiarTema])

  return { tema, esOscuro: tema === 'oscuro', cambiarTema, alternarTema }
}
