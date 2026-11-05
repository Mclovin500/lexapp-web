import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { MENSAJES_ERROR_API } from '@/api/errores'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { etiquetasShell } from '@/components/layouts/app/navegacion'
import { MensajeCampo } from '@/features/auth/components/CampoTexto'
import { perfilContent } from '../content/perfil.content'
import { useEliminarFoto, useSubirFoto } from '../hooks/usePerfil'
import type { PerfilAbogado } from '../types/perfil.types'

const TIPOS_FOTO = ['image/jpeg', 'image/png']
const MAXIMO_FOTO = 4 * 1024 * 1024

/** Fotografía, nombre, cédula y estado de validación (regla 9.5: solo "validado" si el backend lo indica). */
export function EncabezadoPerfil({ perfil, accion }: { perfil: PerfilAbogado; accion?: ReactNode }) {
  const { header, photo } = perfilContent
  const entrada = useRef<HTMLInputElement>(null)
  const subir = useSubirFoto()
  const eliminar = useEliminarFoto()
  const [errorFoto, setErrorFoto] = useState<string | null>(null)
  const validado = perfil.estadoValidacion === 'validado'
  const nombre = [perfil.tratamiento, perfil.nombreCompleto].filter(Boolean).join(' ')
  const ocupado = subir.isPending || eliminar.isPending
  const error = errorFoto ?? (subir.error ? MENSAJES_ERROR_API[subir.error.tipo] : eliminar.error ? MENSAJES_ERROR_API[eliminar.error.tipo] : null)

  return (
    <section aria-labelledby="perfil-nombre" className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <Avatar nombre={perfil.nombreCompleto} foto={perfil.fotoUrl} size="lg" className="w-28! h-28! text-headline-md!" />
        <input
          ref={entrada}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(evento) => {
            const archivo = evento.target.files?.[0]
            evento.target.value = ''
            if (!archivo) return
            if (!TIPOS_FOTO.includes(archivo.type) || archivo.size > MAXIMO_FOTO) {
              setErrorFoto(photo.invalid)
              return
            }
            setErrorFoto(null)
            subir.mutate(archivo)
          }}
        />
        <div className="flex gap-1">
          <button
            type="button"
            disabled={ocupado}
            onClick={() => entrada.current?.click()}
            className="h-8 px-3 rounded-lg text-label-sm font-semibold text-primary hover:bg-primary-container/10 disabled:opacity-60 cursor-pointer"
          >
            {subir.isPending ? photo.saving : perfil.fotoUrl ? photo.change : photo.add}
          </button>
          {perfil.fotoUrl && (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => eliminar.mutate()}
              aria-label={photo.remove}
              className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-secondary hover:bg-surface-container disabled:opacity-60 cursor-pointer"
            >
              <Icon name="delete" size={18} />
            </button>
          )}
        </div>
        <p className="text-[11px] text-secondary">{photo.hint}</p>
        {error && <MensajeCampo id="perfil-foto-error" mensaje={error} />}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="perfil-nombre" className="text-headline-md text-on-surface">
            {nombre}
          </h2>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold ${
              validado ? 'bg-primary-container/15 text-primary' : 'bg-tertiary/10 text-tertiary'
            }`}
          >
            <Icon name={validado ? 'verified' : 'pending'} size={14} />
            {etiquetasShell.validation[perfil.estadoValidacion]}
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant">
          {header.cedula}: <span className="tabular-nums font-semibold text-on-surface">{perfil.cedula}</span> · {header.years(perfil.aniosExperiencia)}
        </p>
        <p className="text-body-sm text-secondary">{header.cedulaNote}</p>
        <p className={`inline-flex items-center gap-1.5 text-body-sm ${perfil.visibleParaClientes ? 'text-primary' : 'text-secondary'}`}>
          <Icon name={perfil.visibleParaClientes ? 'visibility' : 'visibility_off'} size={16} />
          {perfil.visibleParaClientes ? header.visible : header.hidden}
        </p>
        <Link to={ROUTES.validationStatus} className="self-start text-label-md text-primary font-semibold hover:underline">
          {header.viewValidation}
        </Link>
      </div>
      {accion}
    </section>
  )
}
