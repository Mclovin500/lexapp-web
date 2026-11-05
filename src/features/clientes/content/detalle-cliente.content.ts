import type { TipoInteraccion } from '../types/clientes.types'

export const detalleClienteContent = {
  back: 'Volver a clientes',
  loading: 'Cargando el cliente…',
  privacy: 'Solo ves la información que el cliente autorizó y que es necesaria para atender sus casos.',
  since: 'Cliente desde',
  chat: 'Abrir chat',
  basic: { title: 'Información básica', name: 'Nombre', type: 'Tipo de persona', organization: 'Empresa u organización', status: 'Estado' },
  contact: { title: 'Datos de contacto', email: 'Correo', phone: 'Teléfono', noPhone: 'No registrado' },
  cases: { title: 'Expedientes relacionados', empty: 'Este cliente aún no tiene expedientes contigo.', view: 'Ver expediente' },
  history: {
    title: 'Historial de interacción',
    subtitle: 'Solo la relación profesional contigo.',
    empty: 'Sin interacciones registradas.',
    icons: {
      solicitud: 'inbox',
      propuesta: 'request_quote',
      expediente: 'folder_managed',
      documento: 'description',
      pago: 'payments',
    } satisfies Record<TipoInteraccion, string>,
  },
  documents: { title: 'Documentos relacionados', empty: 'No hay documentos en los expedientes de este cliente.', view: 'Ver documentos' },
  payments: { title: 'Pagos relacionados', empty: 'No hay pagos ni cobros con este cliente.', viewAll: 'Ver honorarios y cobros' },
  errors: { no_encontrado: 'No encontramos este cliente o no tienes una relación profesional con él.' },
}
