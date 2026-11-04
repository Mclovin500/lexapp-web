interface EstadoCargaProps {
  texto: string
  className?: string
}

export function EstadoCarga({ texto, className = '' }: EstadoCargaProps) {
  return (
    <div role="status" className={`py-12 flex flex-col items-center gap-3 text-body-sm text-secondary ${className}`}>
      <span
        className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-container border-t-transparent"
        aria-hidden="true"
      />
      {texto}
    </div>
  )
}
