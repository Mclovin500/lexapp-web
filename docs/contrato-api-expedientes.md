# PROPUESTA — por confirmar con el equipo de backend

Contrato de E1, E2, E3 (expedientes y documentos) y F1, F2 (clientes). Rutas en `src/api/endpoints.ts`.
Mismas reglas que `contrato-api-panel.md`: sesión por cookie `httpOnly`, errores → `ErrorApi`, fechas ISO 8601.
Regla 9.4: el backend solo devuelve expedientes, documentos y clientes del abogado autenticado
(`403` si el recurso es de otro abogado, `404` si no existe). Regla 9.3: todo documento pertenece a un expediente.

## Estados
- Expediente: `activo | en_espera | finalizado` (sección 8: distinguir activos y finalizados).
  `en_espera` = sigue abierto pero depende del cliente o de una autoridad. Un expediente `finalizado`
  no admite actualizaciones, documentos ni cobros (409) hasta reabrirlo.
- Documento: `pendiente_revision | revisado | requiere_correccion`.
- Cliente (calculado por el backend): `activo` (expedientes no finalizados) · `en_propuesta`
  (propuesta `enviada`/`pendiente_respuesta`) · `inactivo`.

## E1 · `GET /expedientes?estado=&area=&busqueda=&pagina=&porPagina=`
- `busqueda`: folio, asunto, nombre del cliente u organización.
- 200: `{ "expedientes": [ExpedienteResumen], "total", "totalesPorEstado": { "todos", "activo", "en_espera", "finalizado" } }`
- `ExpedienteResumen`: `{ "id", "folio", "cliente": { "id", "nombre", "organizacion" }, "asunto", "areaJuridica",
  "estado", "fechaApertura", "ultimaActualizacion" }`. Orden: `ultimaActualizacion` descendente.

## E2 · `GET /expedientes/{id}`
- 200: `ExpedienteResumen` + `{ "cliente": { …, "tipoPersona", "correo", "telefono" }, "descripcion",
  "propuesta": null | { "id", "folio" },
  "historial": [{ "id", "tipo": "apertura" | "estado" | "documento" | "pago" | "reunion", "descripcion", "fecha", "autor" }],
  "actualizaciones": [{ "id", "titulo", "descripcion", "fecha", "autor", "visibleCliente" }],
  "documentos": { "total", "pendientesRevision", "recientes": [DocumentoExpediente] (máx. 3) },
  "pagos": [MovimientoResumen], "proximasReuniones": [ReunionProxima] }` · 403 · 404.
- `POST /expedientes/{id}/actualizaciones` `{ "titulo", "descripcion", "visibleCliente" }` → 201 `{ "id" }`.
  Si `visibleCliente`, se notifica al cliente en su app. 409 si está finalizado.
- `PATCH /expedientes/{id}/estado` `{ "estado", "nota" }` → 204. Registra el evento en `historial`. 409 si es el mismo estado.
- Navegación del front: Documentos → E3 · Cliente → F2 · Chat → H1 (`state`: `{ clienteId, expedienteId }`) ·
  Reunión → G1 / G1A · Cobro adicional → D4 (`?cliente=&expediente=`) · Pago → D5.

## E3 · Documentos
- `GET /expedientes/{id}/documentos?estado=&categoria=&busqueda=` →
  `{ "expediente": { "id", "folio", "asunto", "estado", "cliente": { "id", "nombre" } },
  "documentos": [DocumentoExpediente], "totalesPorEstado": { "todos", "pendiente_revision", "revisado", "requiere_correccion" } }`.
- `DocumentoExpediente`: `{ "id", "nombre", "categoria", "tipoArchivo" (MIME), "tamanoBytes", "fechaCarga",
  "cargadoPor": { "nombre", "rol": "abogado" | "cliente" }, "estado", "descripcion",
  "historial": [{ "accion": "cargado" | "revisado" | "correccion_solicitada", "fecha", "autor", "nota" }] }`.
- `categoria`: `escritos | acuerdos | contratos | pruebas | identificacion | comprobantes | otros`.
- `POST /expedientes/{id}/documentos` (multipart/form-data: `archivo`, `categoria`, `descripcion`) → 201 `{ "id" }`.
  El front valida PDF, Word, Excel, JPG o PNG de hasta 20 MB; el backend debe validar de nuevo (tipo real, tamaño, antivirus).
- `PATCH /expedientes/{id}/documentos/{documentoId}` `{ "estado": "revisado" | "requiere_correccion", "nota" }` → 204.
  Solo documentos `pendiente_revision` (409 si no). `requiere_correccion` exige nota.
- `GET /expedientes/{id}/documentos/{documentoId}/url` → `{ "url", "expiraEn" }`: URL **temporal y firmada**
  para vista previa y descarga. El front la pide en cada uso y no la guarda.

## F1 · `GET /clientes?estado=&busqueda=&pagina=&porPagina=`
- `busqueda`: nombre, organización o correo.
- 200: `{ "clientes": [ClienteResumen], "total", "totalesPorEstado": { "todos", "activo", "en_propuesta", "inactivo" } }`
- `ClienteResumen`: `{ "id", "nombre", "organizacion", "tipoPersona", "correo", "telefono": null | "<texto>",
  "expedientes": { "total", "abiertos" }, "ultimaActividad", "estado" }`.

## F2 · `GET /clientes/{id}`
- 200: `ClienteResumen` + `{ "clienteDesde", "expedientesRelacionados": [ExpedienteResumen],
  "interacciones": [{ "id", "tipo": "solicitud" | "propuesta" | "expediente" | "documento" | "pago", "descripcion", "fecha", "referenciaId" }],
  "documentos": [{ "id", "nombre", "categoria", "estado", "fechaCarga", "expediente": { "id", "folio" } }],
  "pagos": [MovimientoResumen] }` · 404 si no hay relación profesional.
- "Historial de interacción permitido": solo la relación con este abogado (no incluye actualizaciones internas).
- Front: Expediente → E2 · Documento → E3 · Pago → D5 · Chat → H1 (`state`: `{ clienteId }`).

## Pendientes
- Estados definitivos del expediente y si "finalizado" se puede reabrir siempre.
- Política de retención de documentos y si el abogado puede eliminarlos (hoy no hay acción de eliminar).
- Versiones de un documento (el cliente sube una corrección: ¿documento nuevo o versión?).
- Antivirus y tipos MIME permitidos en el backend.
- Búsqueda general del Header (sigue deshabilitada).
