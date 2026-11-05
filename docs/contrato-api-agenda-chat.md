# PROPUESTA — por confirmar con el equipo de backend

Contrato de G1 (agenda), G1A (sala de videollamada) y H1 (chat). Rutas en `src/api/endpoints.ts`.
Mismas reglas que `contrato-api-panel.md`: sesión por cookie `httpOnly`, errores → `ErrorApi`, fechas ISO 8601.
Regla 9.2: las reuniones son **solo virtuales**; ningún endpoint recibe ni devuelve dirección, oficina o mapa.
Regla 9.4: solo se devuelven reuniones y conversaciones del abogado autenticado (403 si son de otro).

## G1 · Reuniones
- Estados: `programada | en_curso | finalizada | cancelada | no_realizada` (pasó el horario sin videollamada).
- `GET /reuniones?desde=&hasta=` (calendario, por `inicio`) · `?alcance=proximas&limite=` (programadas y en curso,
  ascendente) · `?alcance=historial&limite=` (finalizadas, canceladas y no realizadas, descendente) → `[ReunionResumen]`.
- `ReunionResumen`: `{ "id", "titulo", "cliente": { "id", "nombre" }, "expediente": null | { "id", "folio" }, "inicio", "fin", "estado" }`.
- `GET /reuniones/{id}` → `ReunionResumen` + `{ "cliente": { …, "organizacion", "enDirectorio" }, "notas",
  "origen": "agenda" | "chat" | "cliente", "sala": { "abreEn", "cierraEn" }, "motivoCancelacion",
  "duracionRealSegundos", "resumen", "historial": [{ "estado", "fecha", "nota" }] }` · 403 · 404.
- `POST /reuniones` `{ "clienteId", "expedienteId": null | "<id>", "titulo", "inicio", "duracionMinutos", "notas" }` → 201 `{ "id" }`.
  422 si la fecha ya pasó o el expediente no es del cliente; 409 si se traslapa con otra reunión o el expediente está finalizado.
  Debe notificar al cliente (invitación en su app) y registrar el evento en el expediente.
- `POST /reuniones/{id}/cancelar` `{ "motivo" }` → 204. Solo `programada`; 409 si no.
- `GET` / `PUT /agenda/disponibilidad` `{ "dias": [{ "dia": 0-6, "activo", "inicio": "HH:MM", "fin": "HH:MM" }],
  "duracionMinutos", "margenMinutos" }`. Son los horarios en que el cliente puede pedir reuniones desde su app.

## G1A · Sala de videollamada
- Ventana de la sala (propuesta): abre 60 min antes del inicio y cierra 30 min después del fin. El front la usa para
  habilitar "Unirse"; el backend decide con `sala.abreEn` / `sala.cierraEn`.
- `POST /reuniones/{id}/sala` → `{ "proveedor", "sala", "token", "expiraEn" }`: credencial temporal del proveedor de video
  (WebRTC). Marca la reunión como `en_curso`. 409 fuera de la ventana o si ya terminó.
- `POST /reuniones/{id}/finalizar` `{ "duracionSegundos", "resumen" }` → 204. Si hay expediente, se registra en su historial.
- Estados de la pantalla (especificación): Preparando dispositivo → Esperando al cliente → Conectando → Activa →
  Conexión interrumpida → Finalizada. Los de conexión los emitirá el SDK del proveedor
  (`src/features/agenda/services/videollamada.service.ts`, hoy solo la versión simulada).
- Cámara, micrófono y compartir pantalla usan las API del navegador (`getUserMedia`, `getDisplayMedia`).

## H1 · Chat
- `GET /conversaciones?filtro=no_leidas&busqueda=` → `{ "conversaciones": [ConversacionResumen], "totales": { "todas", "no_leidas" } }`.
- `ConversacionResumen`: `{ "id", "cliente": { "id", "nombre", "organizacion", "enDirectorio" },
  "expediente": null | { "id", "folio", "asunto" }, "ultimoMensaje": null | { "texto", "fecha", "autor" }, "noLeidos" }`.
  Cada conversación es de un cliente y, cuando corresponde, de un expediente (`null` = conversación general).
- `POST /conversaciones` `{ "clienteId", "expedienteId"? }` → `{ "id" }`: abre la existente o la crea.
  Sin `expedienteId` = la más reciente del cliente; `null` = la general. 403 si no hay relación (cliente o solicitud).
- `GET /conversaciones/{id}/mensajes` → `{ "conversacion", "mensajes": [{ "id", "autor": "abogado" | "cliente", "texto",
  "fecha", "adjunto": null | { "id", "nombre", "tipoArchivo", "tamanoBytes" }, "leido" }] }`.
- `POST /conversaciones/{id}/mensajes` (multipart: `texto`, `archivo`?) → `Mensaje`. 422 si no hay texto ni archivo.
- `POST /conversaciones/{id}/leida` → 204 (baja `contadores.mensajesSinLeer` de `GET /abogado/cuenta`).
- `GET /conversaciones/{id}/adjuntos/{adjuntoId}/url` → `{ "url", "expiraEn" }` (URL temporal firmada).
- Tiempo real: hoy el front consulta cada 5 s. TODO: WebSocket o eventos del servidor.
- `POST /reuniones/inmediata` `{ "clienteId", "expedienteId" }` → `{ "id" }`: botón "Videollamada" de H1. Reutiliza una
  reunión del cliente con la sala abierta o crea una de 45 min que empieza ya. El front abre G1A con
  `?origen=chat&conversacion=<id>` para regresar a H1 al terminar.

## Pendientes
- Proveedor de video (LiveKit, Daily, Twilio, Jitsi…) y si se graba la llamada (hoy no se graba).
- Si los adjuntos del chat deben copiarse a los documentos del expediente (regla 9.3).
- Recordatorios automáticos al cliente antes de la reunión.
- Reprogramar una reunión (hoy: cancelar y programar otra).
