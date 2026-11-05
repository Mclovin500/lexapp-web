import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { Icon } from '@/components/ui/Icon'
import { DIAS_SEMANA } from '@/features/agenda/content/agenda.content'
import { useDisponibilidad } from '@/features/agenda/hooks/useAgenda'
import { areasPractica, disponibilidades, especializaciones, etiquetaDe } from '@/features/auth/content/catalogos.content'
import { formatearMonto } from '@/lib/moneda'
import { perfilContent } from '../content/perfil.content'
import type { PerfilAbogado } from '../types/perfil.types'

function Tarjeta({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-4">
      <h2 id={id} className="text-headline-sm text-on-surface">
        {titulo}
      </h2>
      {children}
    </section>
  )
}

function Chips({ valores }: { valores: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {valores.map((v) => (
        <li key={v} className="px-3 py-1 rounded-full bg-primary-container/10 text-primary text-label-md font-semibold">
          {v}
        </li>
      ))}
    </ul>
  )
}

/** I1 en modo consulta. */
export function VistaPerfil({ perfil }: { perfil: PerfilAbogado }) {
  const { sections, empty, present, fees, availability } = perfilContent
  const horario = useDisponibilidad(true)
  const periodo = (inicio: number, fin: number | null) => `${inicio} – ${fin ?? present}`

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-8 flex flex-col gap-6">
        <Tarjeta id="perfil-descripcion" titulo={sections.description}>
          <p className="text-body-md text-on-surface-variant whitespace-pre-line">{perfil.descripcion}</p>
          {perfil.idiomas && (
            <p className="flex items-center gap-2 text-body-sm text-secondary">
              <Icon name="translate" size={18} />
              {sections.languages}: <span className="text-on-surface">{perfil.idiomas}</span>
            </p>
          )}
        </Tarjeta>
        <Tarjeta id="perfil-areas" titulo={`${sections.areas} y ${sections.specialties.toLowerCase()}`}>
          <Chips valores={perfil.areasPractica.map((v) => etiquetaDe(areasPractica, v))} />
          {perfil.especialidades.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {perfil.especialidades.map((v) => (
                <li key={v} className="px-3 py-1 rounded-full bg-surface-container text-on-surface text-label-md">
                  {etiquetaDe(especializaciones, v)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-md text-secondary">{empty.specialties}</p>
          )}
        </Tarjeta>
        <Tarjeta id="perfil-formacion" titulo={sections.education}>
          {perfil.formacion.length === 0 ? (
            <p className="text-body-md text-secondary">{empty.education}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {perfil.formacion.map((f) => (
                <li key={f.id} className="flex gap-3">
                  <Icon name="school" size={22} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-label-lg text-on-surface font-semibold">{f.titulo}</p>
                    <p className="text-body-sm text-secondary">
                      {f.institucion} · {periodo(f.anioInicio, f.anioFin)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta id="perfil-experiencia" titulo={sections.experience}>
          {perfil.experiencia.length === 0 ? (
            <p className="text-body-md text-secondary">{empty.experience}</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {perfil.experiencia.map((e) => (
                <li key={e.id} className="flex gap-3">
                  <Icon name="work_history" size={22} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-label-lg text-on-surface font-semibold">{e.cargo}</p>
                    <p className="text-body-sm text-secondary">
                      {e.organizacion} · {periodo(e.anioInicio, e.anioFin)}
                    </p>
                    {e.descripcion && <p className="mt-1 text-body-md text-on-surface-variant">{e.descripcion}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta id="perfil-servicios" titulo={sections.services}>
          {perfil.servicios.length === 0 ? (
            <p className="text-body-md text-secondary">{empty.services}</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {perfil.servicios.map((s) => (
                <li key={s.id} className="p-4 rounded-lg bg-surface-container-low">
                  <p className="text-label-lg text-on-surface font-semibold">{s.nombre}</p>
                  {s.descripcion && <p className="mt-1 text-body-sm text-secondary">{s.descripcion}</p>}
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-6">
        <Tarjeta id="perfil-honorarios" titulo={sections.fees}>
          <dl className="flex flex-col gap-3">
            <div className="flex justify-between gap-3">
              <dt className="text-body-md text-secondary">{fees.initial}</dt>
              <dd className="text-label-lg text-on-surface font-semibold tabular-nums">
                {perfil.honorarios.consultaInicial === 0 ? fees.free : formatearMonto(perfil.honorarios.consultaInicial)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-body-md text-secondary">{fees.hourly}</dt>
              <dd className="text-label-lg text-on-surface font-semibold tabular-nums">
                {perfil.honorarios.tarifaHora === null ? fees.notApplicable : formatearMonto(perfil.honorarios.tarifaHora)}
              </dd>
            </div>
          </dl>
          {perfil.honorarios.nota && <p className="text-body-sm text-on-surface-variant">{perfil.honorarios.nota}</p>}
          <p className="text-[11px] text-secondary">{fees.note}</p>
        </Tarjeta>
        <Tarjeta id="perfil-disponibilidad" titulo={sections.availability}>
          <p className={`inline-flex items-center gap-2 text-label-lg font-semibold ${perfil.disponibilidad.aceptaNuevosCasos ? 'text-primary' : 'text-secondary'}`}>
            <Icon name={perfil.disponibilidad.aceptaNuevosCasos ? 'check_circle' : 'do_not_disturb_on'} size={20} />
            {perfil.disponibilidad.aceptaNuevosCasos ? availability.accepting : availability.notAccepting}
          </p>
          <p className="text-body-md text-on-surface-variant">
            {availability.modality}: <span className="text-on-surface">{etiquetaDe(disponibilidades, perfil.disponibilidad.modalidad)}</span>
          </p>
          <div>
            <p className="text-label-md text-on-surface font-semibold mb-1">{availability.schedule}</p>
            {horario.isPending && <p className="text-body-sm text-secondary">{availability.scheduleLoading}</p>}
            {horario.data &&
              (horario.data.dias.some((d) => d.activo) ? (
                <ul className="flex flex-col gap-0.5 text-body-sm text-on-surface-variant">
                  {[1, 2, 3, 4, 5, 6, 0]
                    .map((dia) => horario.data.dias.find((d) => d.dia === dia))
                    .filter((d) => d?.activo)
                    .map((d) => d && (
                      <li key={d.dia} className="flex justify-between gap-3">
                        <span>{DIAS_SEMANA[d.dia]}</span>
                        <span className="tabular-nums">
                          {d.inicio} – {d.fin}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-body-sm text-secondary">{availability.noSchedule}</p>
              ))}
          </div>
          <p className="flex items-start gap-2 text-body-sm text-secondary">
            <Icon name="videocam" size={18} className="shrink-0" />
            {availability.virtual}
          </p>
          <Link to={ROUTES.agenda} className="self-start text-label-md text-primary font-semibold hover:underline">
            {availability.changeSchedule}
          </Link>
        </Tarjeta>
      </div>
    </div>
  )
}
