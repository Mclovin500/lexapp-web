/** Textos del marco compartido por A1 y A3 (cabecera y pie). */
export const accesoContent = {
  header: {
    tagline: 'Sistema operativo jurídico',
    edition: 'Versión profesional desktop',
    // PLACEHOLDER: validar antes de publicar (P02–P04 muestran v4.2)
    version: 'v2.4 LTS',
  },
  footer: {
    encryption: 'Conexión segura (HTTPS)',
    compliance: 'Consulta nuestro aviso de privacidad',
    get copyright() {
      return `© ${new Date().getFullYear()} LexApp Technologies Inc. Todos los derechos reservados.`
    },
  },
}
