/** Logotipo de LexApp (public/logo.svg). El nombre de la marca va en texto al lado, por eso es decorativo. */
interface LogoProps {
  /** Controla el tamaño con la altura (p. ej. `h-10`); el ancho se ajusta solo. */
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt=""
      aria-hidden="true"
      width={1000}
      height={1160}
      draggable={false}
      className={`w-auto shrink-0 select-none ${className}`}
    />
  )
}
