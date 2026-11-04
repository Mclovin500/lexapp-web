# PROPUESTA — por confirmar con el equipo de backend

Contrato de la sección D: propuestas (D1, D2) y honorarios y cobros (D3, D4, D5). Rutas en `src/api/endpoints.ts`.
Mismas reglas que `contrato-api-panel.md`: sesión por cookie `httpOnly`, errores → `ErrorApi`,
fechas ISO 8601 (las de formulario en `AAAA-MM-DD`) e importes en MXN como número.
Regla 9.1: el abogado **no** captura tarjetas ni paga; el cliente paga desde la app móvil.

## Opciones para formularios (D1, D4)
- `GET /clientes/opciones` → `[{ "id", "nombre", "organizacion": null | "<texto>" }]` (clientes del abogado).
- `GET /solicitudes/opciones?clienteId=` → `[{ "id", "folio", "asunto" }]` (solo `nueva` o `en_revision`).
- `GET /expedientes/opciones?clienteId=` → `[{ "id", "folio", "asunto", "clienteId" }]` (expedientes activos).

## D1 · Crear o editar propuesta
- `POST /propuestas` (crear) · `PUT /propuestas/{id}` (editar; solo `borrador`, si no 409).
- Cuerpo: `{ "clienteId", "solicitudId": null | "<id>", "servicio", "descripcion", "alcance",
  "honorarios", "conceptos": [{ "concepto", "importe" }], "condiciones", "tiempoEstimado",
  "fechaVigencia", "accion": "borrador" | "enviar" }`.
- Validaciones esperadas: la solicitud pertenece al cliente; la suma de `conceptos` = `honorarios`
  (si hay conceptos); `fechaVigencia` ≥ hoy. Error → 422.
- 200/201: `{ "id", "estado" }`. `accion: "enviar"` deja la propuesta `enviada`, la notifica al cliente
  y marca la solicitud como `atendida`.

## D2 · Seguimiento de propuestas
- `GET /propuestas?estado=&busqueda=&pagina=&porPagina=`
  - `estado`: `borrador | enviada | pendiente_respuesta | aceptada | rechazada | cancelada` (sin parámetro = todas).
  - 200: `{ "propuestas": [PropuestaResumen], "total", "totalesPorEstado": { "todos", "borrador", … } }`.
  - `PropuestaResumen`: `{ "id", "folio", "cliente": { "id", "nombre", "organizacion" }, "servicio",
    "importe", "fechaCreacion", "fechaVigencia", "estado", "expedienteId": null | "<id>" }`.
- `GET /propuestas/{id}` → `PropuestaResumen` + `{ "solicitud": null | { "id", "folio", "asunto" },
  "descripcion", "alcance", "condiciones", "tiempoEstimado", "conceptos", "fechaEnvio",
  "motivoRechazo", "tieneMovimientos" }` · 404.
- `POST /propuestas/{id}/cancelar` → 204. Solo `borrador`, `enviada` o `pendiente_respuesta`; si no, 409.
- `POST /propuestas/{id}/expediente` → `{ "expedienteId" }`. Solo `aceptada` sin expediente; si no, 409.
- Front: "Ver movimientos" abre D3 con `?propuesta=<id>` cuando `tieneMovimientos`.

## D3 · Honorarios y cobros
- `GET /honorarios/resumen` → `{ "ingresosTotales", "pagosPendientes", "pagosRecibidos",
  "fondosRetenidos": null | número, "fondosLiberados": null | número }`.
  `null` = el proveedor de pagos no maneja retención; el front oculta esa tarjeta.
- `GET /honorarios/movimientos?estado=&busqueda=&propuestaId=&pagina=&porPagina=`
  - `estado`: `pendiente | pagado | en_proceso | rechazado | retenido | liberado`.
  - `busqueda`: cliente, expediente, concepto o folio.
  - 200: `{ "movimientos": [MovimientoResumen], "total", "totalesPorEstado": { "todos", "pendiente", … } }`.
  - `MovimientoResumen`: `{ "id", "folio", "cliente": { "id", "nombre" }, "expediente": null | { "id", "folio" },
    "concepto", "importe", "fecha", "estado", "origen": "propuesta" | "cobro_adicional", "propuestaId" }`.

## D4 · Crear cobro adicional
- `POST /honorarios/cobros` `{ "clienteId", "expedienteId", "concepto", "descripcion", "importe",
  "fechaEmision", "fechaLimite": null | "AAAA-MM-DD" }` → 201 `{ "id" }`.
- El expediente debe pertenecer al cliente (si no, 422). El cobro nace `pendiente` y se notifica al cliente.
- Front: tras crear abre D5 del movimiento (con `replace`). Desde E2: `/honorarios/cobros/nuevo?cliente=&expediente=`.

## D5 · Detalle de pago y movimientos
- `GET /honorarios/movimientos/{id}` → `MovimientoResumen` + `{ "descripcion", "fechaLimite", "fechaPago",
  "metodoPago": null | "Transferencia SPEI" | "Tarjeta •••• 4912", "referenciaTransaccion",
  "historial": [{ "estado", "fecha", "nota": null | "<texto>" }] }` · 404.
- Solo lectura. `metodoPago` nunca incluye datos sensibles (número completo, CVV, titular).

## Pendientes
- Proveedor de pagos y cuándo un pago pasa de `en_proceso` a `pagado`, `retenido` o `liberado` (webhooks).
- Si el cobro adicional se puede cancelar o editar mientras está `pendiente` (hoy no hay acción).
- Si `pendiente_respuesta` la asigna el backend (p. ej. el cliente abrió la propuesta) o es otro estado.
- Generar PDF de la propuesta y exportar movimientos (no implementados: no los pide la especificación).
- Cuenta de depósito (J1A) y detalle del cliente (F2): hoy placeholders.
