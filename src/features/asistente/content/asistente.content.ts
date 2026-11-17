import type { SugerenciaAsistente } from '../types/asistente.types'

/**
 * Todo el texto visible del asistente, en español y fuera del JSX.
 * Por ahora es una maqueta: no hay modelo ni endpoint detrás.
 */
export const asistenteContent = {
  label: 'Asistente LexApp',
  open: 'Abrir asistente LexApp',
  close: 'Cerrar asistente',
  restart: 'Nueva conversación',
  restartLabel: 'Reiniciar la conversación',
  header: {
    title: 'Asistente LexApp',
    subtitle: 'Guía de la plataforma',
    online: 'Disponible ahora',
    demo: 'Demo',
  },
  welcome: {
    texto:
      'Hola 👋 Soy el asistente de LexApp. Puedo orientarte sobre cómo usar el panel: propuestas, cobros, expedientes, agenda y más.',
    hint: 'Elige una pregunta o escribe la tuya.',
  },
  suggestions: [
    { valor: 'propuesta', etiqueta: '¿Cómo creo una propuesta?' },
    { valor: 'cobro', etiqueta: 'Cómo registrar un cobro' },
    { valor: 'expediente', etiqueta: 'Ver mis expedientes' },
    { valor: 'agenda', etiqueta: 'Agendar una reunión' },
    { valor: 'validacion', etiqueta: 'Validar mi cédula' },
  ] satisfies SugerenciaAsistente[],
  composer: {
    label: 'Escribe tu pregunta',
    placeholder: 'Escribe tu pregunta…',
    hint: 'Enter para enviar · Shift + Enter para una nueva línea',
    send: 'Enviar',
    sending: 'Enviando…',
    empty: 'Escribe una pregunta para continuar.',
    tooLong: 'Tu pregunta no puede superar 500 caracteres.',
  },
  typing: 'El asistente está escribiendo…',
  disclaimer:
    'Las respuestas son orientativas y pueden contener errores. Verifica la información importante en el expediente.',
  empty: 'Aún no hay mensajes. Escribe una pregunta.',
} as const
