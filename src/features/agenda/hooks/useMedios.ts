import { useCallback, useEffect, useRef, useState } from 'react'

export type EstadoMedios = 'inactivo' | 'solicitando' | 'listo' | 'sin_permiso' | 'sin_dispositivos' | 'no_soportado' | 'error'

function detener(stream: MediaStream | null) {
  stream?.getTracks().forEach((pista) => pista.stop())
}

/**
 * Cámara y micrófono del abogado (vista propia) y compartir pantalla, con la API del navegador.
 * Libera los dispositivos al desmontar la pantalla.
 */
export function useMedios() {
  const [estado, setEstado] = useState<EstadoMedios>('inactivo')
  const [camaraStream, setCamaraStream] = useState<MediaStream | null>(null)
  const [pantalla, setPantalla] = useState<MediaStream | null>(null)
  const [microfono, setMicrofono] = useState(true)
  const [camara, setCamara] = useState(true)
  const refs = useRef<{ camara: MediaStream | null; pantalla: MediaStream | null }>({ camara: null, pantalla: null })
  const puedeCompartir = typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getDisplayMedia === 'function'

  const iniciar = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setEstado('no_soportado')
      return
    }
    setEstado('solicitando')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      refs.current.camara = stream
      setCamaraStream(stream)
      setEstado('listo')
    } catch (error: unknown) {
      const nombre = error instanceof DOMException ? error.name : ''
      setEstado(nombre === 'NotAllowedError' ? 'sin_permiso' : nombre === 'NotFoundError' || nombre === 'OverconstrainedError' ? 'sin_dispositivos' : 'error')
    }
  }, [])

  const alternarMicrofono = useCallback(() => {
    setMicrofono((actual) => {
      refs.current.camara?.getAudioTracks().forEach((pista) => (pista.enabled = !actual))
      return !actual
    })
  }, [])

  const alternarCamara = useCallback(() => {
    setCamara((actual) => {
      refs.current.camara?.getVideoTracks().forEach((pista) => (pista.enabled = !actual))
      return !actual
    })
  }, [])

  const dejarDeCompartir = useCallback(() => {
    detener(refs.current.pantalla)
    refs.current.pantalla = null
    setPantalla(null)
  }, [])

  const compartirPantalla = useCallback(async () => {
    if (refs.current.pantalla) {
      dejarDeCompartir()
      return
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      refs.current.pantalla = stream
      setPantalla(stream)
      // El usuario puede dejar de compartir desde el aviso del navegador.
      stream.getVideoTracks()[0]?.addEventListener('ended', dejarDeCompartir)
    } catch {
      // El usuario canceló la selección de pantalla: no es un error.
    }
  }, [dejarDeCompartir])

  const detenerTodo = useCallback(() => {
    detener(refs.current.camara)
    detener(refs.current.pantalla)
    refs.current = { camara: null, pantalla: null }
    setCamaraStream(null)
    setPantalla(null)
  }, [])

  useEffect(() => () => {
    detener(refs.current.camara)
    detener(refs.current.pantalla)
  }, [])

  return {
    estado,
    camaraStream,
    pantalla,
    microfono,
    camara,
    puedeCompartir,
    iniciar,
    alternarMicrofono,
    alternarCamara,
    compartirPantalla,
    detenerTodo,
  }
}
