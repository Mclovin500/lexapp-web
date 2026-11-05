import { useEffect, useRef } from 'react'

/** `<video>` silenciado para la vista propia o la pantalla compartida. */
export function VideoLocal({ stream, etiqueta, espejo = false }: { stream: MediaStream; etiqueta: string; espejo?: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (video.current) video.current.srcObject = stream
  }, [stream])
  return <video ref={video} autoPlay playsInline muted aria-label={etiqueta} className={`w-full h-full object-cover ${espejo ? '-scale-x-100' : ''}`} />
}
