# PROPUESTA — por confirmar con el equipo de backend

Contrato del registro profesional (A3A, A4, A5) y del estado de validación (A5A).
Rutas en `src/api/endpoints.ts` (`ENDPOINTS.registro` y `ENDPOINTS.abogado`).
Mismo formato de errores y mapeo que `contrato-api-auth.md` (`lib/mapear-error.ts`).

**Supuesto:** A3 deja una sesión de registro y, tras A3A, el backend abre la sesión del abogado
(cookie `httpOnly`). Por eso A3A, A4 y A5 no envían identificadores ni credenciales desde el cliente.

## A3A · `POST /registro/verificar-correo`
- Petición: `{ "codigo": "123456" }` → 204. El front continúa a A4.
- Errores: `400` incorrecto · `410` vencido · `429` · `401` registro vencido (el front ofrece volver a A3).
- Los tiempos iniciales llegan en la respuesta de A3 (`POST /auth/registro`).

## A3A · `POST /registro/reenviar-codigo`
- Sin cuerpo → 200: `{ "reenviarEnSegundos", "expiraEnSegundos" }`. Invalida el código anterior.

## A4 y A5 · `GET /registro/progreso`
- 200: `{ "credenciales"?: {...}, "perfil"?: {...} }` con la misma forma que los PUT.
- Precarga A4 y A5 al volver con "Anterior". `401` → el front pide iniciar sesión.

## A4 · `PUT /registro/credenciales`
- Petición: `{ "numeroCedula": "12345678", "universidad", "especialidad": "<valor de catálogo>",
  "aniosExperiencia": 8, "colegio": null | "<texto>" }` → 204.
- `numeroCedula`: solo dígitos, 7 u 8 (formato provisional). `aniosExperiencia`: entero 0–60.
- `colegio` es opcional (campo extra del diseño).
- Errores: `409` cédula ya registrada · `400/422` datos inválidos · `401`.
- La cédula queda "sujeta a cotejo": el backend no debe devolverla como validada en este paso.

## A5 · `PUT /registro/perfil`
- Petición: `{ "areaPractica", "especializaciones": ["<valor>"], "biografia" (≤ 500),
  "informacionRelevante": { "idiomas": null | "<texto>", "jurisdicciones": null | "<texto>" },
  "disponibilidad": "inmediata" | "agenda_previa" | "corporativo" }` → 204. Máximo 5 especializaciones.

## A5 · `POST /registro/enviar`
- Sin cuerpo → 200: `{ "estadoValidacion": "pendiente", "folio", "fechaEnvio": "<ISO 8601>" }`.
- "Crear mi cuenta" llama primero al PUT de perfil y después a este endpoint; luego navega a A5A.
- Errores: `409` el registro ya fue enviado (el front ofrece ir a A5A) · `401`.

## A5A · `GET /abogado/validacion`
- 200: `{ "estado", "folio", "fechaEnvio": "<ISO 8601>", "nombreCompleto", "cedulaEnmascarada",
  "especialidad": "<valor de catálogo>", "motivo"?: "<texto>" }`. `401` → el front pide iniciar sesión.
- `estado`: `pendiente | validado | requiere_correccion | rechazado`; el front muestra SOLO ese valor real.
- `cedulaEnmascarada` llega ya enmascarada; `motivo` se espera en `requiere_correccion` y `rechazado`.
- `validado` → B1 · `requiere_correccion` y `rechazado` → corregir en A4 / A5 y reenviar desde A5 ·
  `pendiente` → A4 / A5 abiertos para consultar o actualizar, más la lista de funciones restringidas.

## Catálogos
Especialidades, áreas de práctica, especializaciones y disponibilidad viven por ahora en
`features/auth/content/catalogos.content.ts`. Propuesta: `GET /catalogos/{nombre}` → `[{ "valor", "etiqueta" }]`.

## Pendientes
- Cómo se corrige el correo de un registro sin verificar ("¿No es tu correo? Corregir" lleva a A3).
- Si los datos básicos de A3 son editables tras verificar el correo ("Anterior" de A4 lleva a A3).
- Qué significa "crear cuenta" en A5 si la cuenta ya existe desde A3.
- Documentación requerida en A4 ("cuando corresponda" según la especificación): formato y carga.
- Servicios ofrecidos, honorarios y fotografía de A5 (los pide la especificación; el diseño no los incluye).
- Formato oficial de la cédula profesional (7 u 8 dígitos es provisional).
- Si `POST /registro/enviar` acepta reenvíos tras `requiere_correccion`/`rechazado` (hoy 409 = ya enviado)
  y qué pasa con la revisión si el abogado edita A4/A5 en `pendiente`; qué funciones se restringen.
