export const perfilProfesionalContent = {
  subtitle: 'Paso 3 de 3: tu área de práctica y el perfil que verán tus clientes.',
  form: {
    areaLabel: 'Área de práctica jurídica principal',
    areaPlaceholder: 'Selecciona tu área de práctica',
    required: 'Obligatorio',
    tagsLabel: 'Especializaciones o materias adicionales',
    tagsHint: (maximo: number) => `Elige hasta ${maximo}.`,
    bioLabel: 'Descripción o biografía profesional',
    bioPlaceholder:
      'Describe brevemente tu trayectoria, enfoque jurídico y tipos de asuntos que atiendes (visible en tu perfil).',
    relevantInfo: 'Información relevante',
    optional: '(opcional)',
    languagesLabel: 'Idiomas de atención',
    languagesPlaceholder: 'Ej. Español (nativo), Inglés jurídico (C1)',
    jurisdictionsLabel: 'Jurisdicciones habituales',
    jurisdictionsPlaceholder: 'Ej. Tribunales Federales, Juzgados Mercantiles',
    availabilityLabel: 'Disponibilidad inicial',
  },
  actions: {
    previous: 'Anterior',
    next: 'Crear mi cuenta',
    saving: 'Enviando registro…',
  },
  errors: {
    conflicto: 'Tu registro ya fue enviado a validación.',
    conflictoLink: 'Ver estado de validación',
    datos_invalidos: 'Revisa los datos ingresados e inténtalo de nuevo.',
    sesion_expirada: 'Tu sesión de registro venció. Inicia sesión para continuar.',
    demasiados_intentos: 'Demasiados intentos. Inténtalo más tarde.',
    red: 'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    desconocido: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
  },
}
