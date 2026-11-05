# PROPUESTA — por confirmar con el equipo de backend

Contrato del panel del abogado: Header/Sidebar, B1, B1A, C1 y C2. Rutas en `src/api/endpoints.ts`.
Todas requieren sesión (cookie `httpOnly`). Errores → `ErrorApi` (`src/api/errores.ts`):
`400/422` datos inválidos · `401` sesión vencida · `403` sin permiso · `404` no encontrado ·
`409` conflicto · `429` demasiados intentos · sin respuesta → red. Fechas en ISO 8601; importes en MXN.

## Header y Sidebar · `GET /abogado/cuenta`
- 200: `{ "nombreCompleto", "tratamiento": "Lic." | null, "correo", "fotoUrl": null | "<URL>", "estadoValidacion",
  "contadores": { "solicitudesNuevas", "mensajesSinLeer", "notificacionesSinLeer" } }`
- Los contadores alimentan las insignias de Solicitudes y Chat (Sidebar) y la campana (Header).

## B1 · `GET /dashboard/resumen`
- 200: `{ "indicadores": { "solicitudesNuevas", "expedientesActivos", "propuestasPendientes", "proximasReuniones" },
  "solicitudesNuevas": [SolicitudResumen] (máx. 3, más recientes con estado "nueva"),
  "proximasReuniones": [{ "id", "titulo", "cliente", "inicio", "fin", "expediente": null | "Exp. 312/2026" }],
  "cobrosRelevantes": [MovimientoResumen] (máx. 3, ver `contrato-api-honorarios.md`; el estado "vencido" se eliminó),
  "actividadReciente": [{ "id", "tipo": "solicitud" | "propuesta" | "expediente" | "documento" | "pago" | "mensaje", "descripcion", "fecha" }] }`
- Reuniones: siempre virtuales (regla 9.2); el front enlaza a G1A con el `id`. Cobros: el `id` abre D5.

## B1A · `GET /notificaciones?filtro=todas|no_leidas|leidas`
- 200: `{ "notificaciones": [{ "id", "tipo", "referencia", "descripcion", "fecha", "leida",
  "destino": { "solicitudId"?, "propuestaId"?, "expedienteId"?, "movimientoId"?, "reunionId"?, "conversacionId"? } }],
  "totales": { "todas", "no_leidas", "leidas" } }`
- `tipo`: `nueva_solicitud | nuevo_mensaje | propuesta_aceptada | propuesta_rechazada | documento_recibido |
  documento_pendiente | nuevo_cobro | pago_realizado | actualizacion_expediente | proxima_videollamada`.
- Navegación del front: solicitud → C2 (o C1) · mensaje → H1 · propuesta → D2 · documento → E3 ·
  cobro/pago → D5 · expediente → E2 · videollamada → G1A. Sin identificador → listado del módulo.
- `PATCH /notificaciones/{id}` `{ "leida": true }` → 204 · `POST /notificaciones/marcar-todas-leidas` → 204.

## C1 · `GET /solicitudes?estado=&area=&busqueda=&pagina=&porPagina=`
- `estado`: `nueva | en_revision | atendida` (sin parámetro = todas). `busqueda`: nombre del cliente o área.
- 200: `{ "solicitudes": [SolicitudResumen], "total", "totalesPorEstado": { "todas", "nueva", "en_revision", "atendida" } }`
- `SolicitudResumen`: `{ "id", "folio", "cliente": { "id", "nombre", "tipoPersona": "fisica" | "moral", "organizacion" },
  "areaJuridica", "asunto", "fechaRecepcion", "estado": "nueva" | "en_revision" | "atendida" | "rechazada",
  "prioridad": "alta" | "media" | "baja" | null }`. Los totales respetan área y búsqueda.

## C2 · `GET /solicitudes/{id}`
- 200: `SolicitudResumen` + `{ "cliente": { …, "correo", "telefono" }, "descripcion",
  "informacionAdicional": [{ "etiqueta", "valor" }], "documentos": [{ "id", "nombre", "tipoArchivo",
  "tamanoBytes", "fechaCarga", "url": null | "<URL temporal>" }], "motivoRechazo": null | "<texto>" }` · 404.
- `POST /solicitudes/{id}/revisar` → 204: "Revisar información" pasa `nueva` → `en_revision`.
- `POST /solicitudes/{id}/rechazar` `{ "motivo" }` (10–500 caracteres) → 204. Solo `nueva` o `en_revision`; si no, 409.
- "Crear propuesta" navega a D1 con `{ solicitudId, clienteId }`. "Abrir conversación" navega a H1 con `{ clienteId }`.

## Pendientes
- Quién pasa una solicitud a `atendida` (propuesta enviada en D1/D2) y si el cliente ve el motivo de rechazo.
- URLs de descarga de documentos (firmadas y con vigencia) y vista previa.
- Catálogo de áreas jurídicas: hoy en `features/solicitudes/content/solicitudes.content.ts` (TODO `GET /catalogos/areas-juridicas`).
- Búsqueda general del Header (deshabilitada hasta que existan expedientes y clientes).
- Protección de rutas del panel con la sesión real (hoy `TODO` en `src/app/router.tsx`).
