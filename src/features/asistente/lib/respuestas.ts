import { ROUTES } from '@/app/routes'
import type { AccionAsistente } from '../types/asistente.types'

/**
 * Respuestas simuladas de la maqueta: coincidencia simple por palabras clave.
 * No hay modelo ni endpoint detrás; el objetivo es mostrar el diseño del flujo.
 */
interface RespuestaSimulada {
  texto: string
  accion?: AccionAsistente
}

interface ReglaRespuesta {
  claves: string[]
  respuesta: RespuestaSimulada
}

const REGLAS: ReglaRespuesta[] = [
  {
    claves: ['propuesta', 'cotiza', 'cotización', 'presupuesto'],
    respuesta: {
      texto:
        'Para crear una propuesta:\n1. Ve a Propuestas en el menú lateral.\n2. Pulsa "Nueva propuesta".\n3. Selecciona el cliente, describe el alcance y define los honorarios.\n4. Envíala para que el cliente la acepte desde el enlace.',
      accion: { ruta: ROUTES.proposals, etiqueta: 'Ir a Propuestas' },
    },
  },
  {
    claves: ['cobro', 'honorario', 'factura', 'pago', 'cobrar'],
    respuesta: {
      texto:
        'Registra tus honorarios en el módulo de Pagos. Desde ahí puedes crear un cobro nuevo, asociarlo a un expediente y dar seguimiento a los movimientos cobrados o pendientes.',
      accion: { ruta: ROUTES.fees, etiqueta: 'Ir a Honorarios y Cobros' },
    },
  },
  {
    claves: ['expediente', 'caso', 'carpeta', 'documento'],
    respuesta: {
      texto:
        'Tus expedientes viven en "Mis Expedientes". Ahí ves el estado de cada caso, sus documentos y el detalle completo. También puedes subir archivos desde el detalle del expediente.',
      accion: { ruta: ROUTES.cases, etiqueta: 'Ver expedientes' },
    },
  },
  {
    claves: ['agenda', 'reunión', 'reunion', 'cita', 'videollamada', 'calendario'],
    respuesta: {
      texto:
        'En la Agenda puedes ver tus citas del día, programar reuniones con disponibilidad y entrar a la sala de videollamada cuando toque. La fecha se guarda en la barra de direcciones, así que puedes compartirla.',
      accion: { ruta: ROUTES.agenda, etiqueta: 'Abrir agenda' },
    },
  },
  {
    claves: ['solicitud', 'solicitudes', 'cliente nuevo', 'captación'],
    respuesta: {
      texto:
        'Las solicitudes de clientes nuevos llegan al módulo de Solicitudes. Puedes filtrarlas por estado, revisar el detalle y aceptarlas para convertirlas en propuesta.',
      accion: { ruta: ROUTES.requests, etiqueta: 'Ver solicitudes' },
    },
  },
  {
    claves: ['cliente', 'clientes', 'contacto'],
    respuesta: {
      texto:
        'El directorio de clientes está en "Clientes". Filtra por nombre o correo, abre un cliente para ver su historial de expedientes y conversaciones.',
      accion: { ruta: ROUTES.clients, etiqueta: 'Ir a Clientes' },
    },
  },
  {
    claves: ['validar', 'validación', 'validacion', 'cédula', 'cedula', 'colegiatura'],
    respuesta: {
      texto:
        'La validación profesional se hace al registrarte: subes tu cédula y datos de colegiatura, y el equipo de LexApp revisa tus documentos. El estado siempre está visible en tu perfil.',
      accion: { ruta: ROUTES.validationStatus, etiqueta: 'Ver estado de validación' },
    },
  },
  {
    claves: ['cuenta', 'datos bancarios', 'depósito', 'deposito', 'clabe'],
    respuesta: {
      texto:
        'Los datos para recibir tus pagos se configuran en Configuración, dentro de "Cuenta de depósito". Recuerda que la CLABE debe coincidir con el nombre de la cuenta.',
      accion: { ruta: ROUTES.depositAccount, etiqueta: 'Configurar cuenta' },
    },
  },
  {
    claves: ['tema', 'oscuro', 'claro', 'modo nocturno'],
    respuesta: {
      texto: 'Puedes cambiar entre tema claro y oscuro con el ítem de sol/luna en la barra superior. La preferencia se guarda en tu navegador.',
    },
  },
  {
    claves: ['hola', 'buenas', 'buen día', 'buen dia', 'hey', 'saludos'],
    respuesta: {
      texto: '¡Hola! ¿En qué te puedo ayudar hoy? Puedo orientarte sobre propuestas, cobros, expedientes, agenda y tu cuenta.',
    },
  },
  {
    claves: ['gracias', 'excelente', 'perfecto', 'genial'],
    respuesta: {
      texto: '¡Con gusto! Si necesitas algo más, aquí sigo. 👍',
    },
  },
]

const RESPUESTA_POR_DEFECTO: RespuestaSimulada = {
  texto:
    'Todavía no tengo una respuesta para eso en esta demo. Puedo ayudarte con propuestas, cobros, expedientes, solicitudes, clientes, agenda y configuración de tu cuenta. Prueba con una de esas.',
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Busca la respuesta simulada que mejor coincida con lo que escribió el usuario. */
export function responder(consulta: string): RespuestaSimulada {
  const consultaNormalizada = normalizar(consulta)

  for (const regla of REGLAS) {
    if (regla.claves.some((clave) => consultaNormalizada.includes(normalizar(clave)))) {
      return regla.respuesta
    }
  }

  return RESPUESTA_POR_DEFECTO
}
