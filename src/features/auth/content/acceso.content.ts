/** Textos del marco compartido por A1 y A3 (cabecera y pie). */
export const accesoContent = {
  header: {
    tagline: 'Sistema operativo jurídico',
    edition: 'Versión profesional desktop',
    // PLACEHOLDER: validar antes de publicar (P02–P04 muestran v4.2)
    version: 'v2.4 LTS',
  },
  footer: {
    // PLACEHOLDER: validar antes de publicar
    encryption: 'Cifrado de grado bancario SSL 256-bit',
    // PLACEHOLDER: validar antes de publicar
    compliance: 'Cumplimiento LFPDPPP & Secreto Profesional',
    get copyright() {
      return `© ${new Date().getFullYear()} LexApp Technologies Inc. Todos los derechos reservados.`
    },
  },
}
