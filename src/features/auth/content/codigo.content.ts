/** Textos del bloque de código de 6 dígitos compartido (A2A, A2C y, después, A3A). */
export const codigoContent = {
  digitAriaLabel: (posicion: number, total: number) => `Dígito ${posicion} de ${total}`,
  verifyingButton: 'Verificando…',
  resend: {
    question: '¿No recibiste el código?',
    countdownPrefix: 'Reenviar en',
    button: 'Solicitar un nuevo código',
    sendingButton: 'Enviando…',
    sentNotice: 'Te enviamos un nuevo código.',
    revocationNote: 'Al solicitar un nuevo código, el anterior deja de ser válido.',
  },
  /** Vigencia mostrada a partir del valor `expiraEnSegundos` del backend. */
  validity: (minutos: number) =>
    `El código vence en ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}.`,
}

export function minutosDesdeSegundos(segundos: number): number {
  return Math.max(1, Math.ceil(segundos / 60))
}
