// TODO: reemplazar por GET /catalogos/... cuando exista

export interface OpcionCatalogo {
  valor: string
  etiqueta: string
}

export interface OpcionDisponibilidad extends OpcionCatalogo {
  descripcion: string
  insignia: string
}

/** A4: especialidad profesional principal. TODO: GET /catalogos/especialidades */
export const especialidades: OpcionCatalogo[] = [
  { valor: 'corporativo', etiqueta: 'Derecho Corporativo y Mercantil' },
  { valor: 'civil', etiqueta: 'Derecho Civil y Procesal' },
  { valor: 'penal', etiqueta: 'Derecho Penal' },
  { valor: 'laboral', etiqueta: 'Derecho Laboral y Seguridad Social' },
  { valor: 'fiscal', etiqueta: 'Derecho Fiscal y Tributario' },
  { valor: 'administrativo', etiqueta: 'Derecho Administrativo y Regulatorio' },
  { valor: 'internacional', etiqueta: 'Derecho Internacional y Arbitraje' },
]

/** A5: área de práctica principal. TODO: GET /catalogos/areas-practica */
export const areasPractica: OpcionCatalogo[] = [
  { valor: 'corporativo', etiqueta: 'Derecho Corporativo y Mercantil' },
  { valor: 'civil', etiqueta: 'Derecho Civil, Obligaciones y Litigio' },
  { valor: 'penal', etiqueta: 'Derecho Penal Económico y Compliance' },
  { valor: 'laboral', etiqueta: 'Derecho Laboral y Seguridad Social' },
  { valor: 'fiscal', etiqueta: 'Derecho Financiero y Fiscal' },
  { valor: 'administrativo', etiqueta: 'Derecho Administrativo y Regulatorio' },
  { valor: 'familiar', etiqueta: 'Derecho Familiar' },
]

/** A5: especializaciones o materias adicionales. TODO: GET /catalogos/especializaciones */
export const especializaciones: OpcionCatalogo[] = [
  { valor: 'contratacion-mercantil', etiqueta: 'Contratación mercantil' },
  { valor: 'fusiones-adquisiciones', etiqueta: 'Fusiones y Adquisiciones (M&A)' },
  { valor: 'arbitraje', etiqueta: 'Arbitraje y Resolución de Disputas' },
  { valor: 'propiedad-intelectual', etiqueta: 'Propiedad intelectual' },
  { valor: 'amparo', etiqueta: 'Juicio de amparo' },
  { valor: 'compliance', etiqueta: 'Compliance y prevención de lavado' },
  { valor: 'inmobiliario', etiqueta: 'Derecho inmobiliario' },
  { valor: 'proteccion-datos', etiqueta: 'Protección de datos personales' },
  { valor: 'comercio-exterior', etiqueta: 'Comercio exterior y aduanas' },
  { valor: 'sucesiones', etiqueta: 'Sucesiones y testamentos' },
]

/** A5: disponibilidad inicial. TODO: GET /catalogos/disponibilidad */
export const disponibilidades: OpcionDisponibilidad[] = [
  {
    valor: 'inmediata',
    etiqueta: 'Disponible ahora',
    descripcion: 'Recibe nuevas consultas de clientes',
    insignia: 'Recomendado',
  },
  {
    valor: 'agenda_previa',
    etiqueta: 'Agenda previa',
    descripcion: 'Las consultas requieren tu aprobación',
    insignia: 'Agenda',
  },
  {
    valor: 'corporativo',
    etiqueta: 'Clientes corporativos',
    descripcion: 'Atención enfocada en cuentas empresariales',
    insignia: 'Corporativo',
  },
]

export function valoresDe(opciones: OpcionCatalogo[]): string[] {
  return opciones.map((opcion) => opcion.valor)
}

/** Etiqueta legible de un valor; si no está en el catálogo, devuelve el valor tal cual. */
export function etiquetaDe(opciones: OpcionCatalogo[], valor: string): string {
  return opciones.find((opcion) => opcion.valor === valor)?.etiqueta ?? valor
}
