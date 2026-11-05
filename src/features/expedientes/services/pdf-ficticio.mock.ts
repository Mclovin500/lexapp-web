// MOCK: eliminar al conectar el backend
// Genera un PDF mínimo y válido para que la vista previa y la descarga funcionen con datos ficticios.

function aTextoPdf(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/[\\()]/g, (caracter) => `\\${caracter}`)
}

export function crearPdfFicticio(lineas: string[]): Blob {
  const texto = lineas.map((linea, indice) => `${indice === 0 ? '' : 'T* '}(${aTextoPdf(linea)}) Tj`).join('\n')
  const contenido = `BT\n/F1 12 Tf\n72 740 Td\n18 TL\n${texto}\nET`
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${contenido.length} >>\nstream\n${contenido}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const posiciones: number[] = []
  objetos.forEach((objeto, indice) => {
    posiciones.push(pdf.length)
    pdf += `${indice + 1} 0 obj\n${objeto}\nendobj\n`
  })
  const inicioXref = pdf.length
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`
  pdf += posiciones.map((posicion) => `${String(posicion).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}
