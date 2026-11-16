export const credencialesContent = {
  subtitle: 'Paso 2 de 3: credenciales de tu ejercicio profesional.',
  form: {
    cedulaLabel: 'Número de cédula profesional',
    cedulaHint: 'Sujeta a cotejo',
    cedulaPlaceholder: 'Ej. 12345678',
    experienceLabel: 'Años de ejercicio activo',
    experiencePlaceholder: 'Ej. 8',
    specialtiesLabel: 'Especialidades jurídicas',
    specialtiesHint: (maximo: number) => `Elige de 1 a ${maximo}.`,
    documentsTitle: 'Documentación requerida',
    documentsDescription: 'Se usa solo para validar tu perfil profesional. PDF, JPG o PNG de hasta 5 MB.',
    cedulaDocLabel: 'Cédula profesional (frente)',
    docHint: 'PDF, JPG o PNG, máximo 5 MB. Se enviará al crear tu cuenta.',
    docInvalid: 'Usa un archivo PDF, JPG o PNG de máximo 5 MB.',
    docChoose: 'Seleccionar archivo',
    docChange: 'Cambiar',
    docRemove: 'Quitar archivo',
  },
  // Nunca afirmar que la cédula está validada: solo que se cotejará.
  verificationNote:
    'Tu cédula queda sujeta a cotejo con los registros oficiales. Tu perfil no se mostrará como validado hasta que concluya la revisión.',
  actions: {
    previous: 'Anterior',
    next: 'Siguiente: Perfil profesional',
  },
}
