# PROPUESTA — por confirmar con el equipo de backend

Contrato de acceso (P02, A1, A2A–A2D, A3). Rutas en `src/api/endpoints.ts`, relativas a `VITE_API_URL`.
Errores: el cuerpo trae `{ "codigo": "<tipo>" }`. Mapeo común del front (`lib/mapear-error.ts`):
`400/422` → `codigo_incorrecto` (endpoints de código) o `datos_invalidos` (formularios) · `401` → `sesion_expirada` ·
`409` → `conflicto` · `410` → `codigo_vencido` · `429` → `demasiados_intentos` · sin respuesta → `red`.
Los tiempos (`reenviarEnSegundos`, `expiraEnSegundos`) siempre los dicta el backend; el front no los fija.

## P02 · `POST /auth/login`
- Petición: `{ "correo", "contrasena", "recordarEquipo": false }`
- 200: `{ "requiereCodigo": true, "correoEnmascarado": "a***@despacho.com", "reenviarEnSegundos": 30, "expiraEnSegundos": 600 }`
- Errores propios: `400/401` credenciales · `403` cuenta no abogado · `429`.

## A2A · `POST /auth/verificar-codigo`
- Petición: `{ "codigo": "123456" }` → 200: `{ "estadoValidacion": "validado" }` y abre la sesión (cookie `httpOnly`).
- `validado` → B1; `pendiente | requiere_correccion | rechazado` → A5A.
- Errores: `400` incorrecto · `410` vencido · `429` · `401` el intento de acceso venció (volver a P02).

## A2A · `POST /auth/reenviar-codigo`
- Sin cuerpo (identifica el intento por cookie) → 200: `{ "reenviarEnSegundos", "expiraEnSegundos" }`.
- Invalida el código anterior.

## A1 · `GET /auth/sesion` (solo si A1 se abre sin destino, p. ej. acceso directo)
- 200: `{ "estadoValidacion" }` (misma regla de navegación que A2A) · 401: sin sesión → P02.

## A2B · `POST /auth/recuperacion/solicitar`
- Petición: `{ "correo" }` → 202: `{ "correoEnmascarado", "reenviarEnSegundos", "expiraEnSegundos" }`.
- MISMA respuesta exista o no la cuenta (no revelar si el correo está registrado).

## A2C · `POST /auth/recuperacion/verificar-codigo`
- Petición: `{ "correo", "codigo" }` → 200: `{ "tokenRestablecimiento" }` (un solo uso, de vida corta).
- Errores: `400` incorrecto · `410` vencido · `429`.

## A2C · `POST /auth/recuperacion/reenviar-codigo`
- Petición: `{ "correo" }` → 200: `{ "reenviarEnSegundos", "expiraEnSegundos" }`. Invalida el anterior.

## A2D · `POST /auth/recuperacion/nueva-contrasena`
- Petición: `{ "tokenRestablecimiento", "contrasena" }` → 204.
- Errores: `401/410` token inválido o vencido (el front ofrece reiniciar en A2B) · `400/422` contraseña rechazada.

## A3 · `POST /auth/registro`
- Petición: `{ "nombre", "apellidos", "correo", "telefono": null | "5512345678", "contrasena", "aceptaTerminos": true }`
- 201: `{ "correoEnmascarado", "reenviarEnSegundos", "expiraEnSegundos" }` y envía el código de A3A
  (A3A–A5: ver `contrato-api-registro.md`).
- Errores: `409` correo ya registrado · `400/422` datos inválidos · `429`.

## Reglas de contraseña (A3 y A2D)
Mínimo 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial
(`schemas/contrasena.schema.ts`). El backend debe validar lo mismo y, además, rechazar
datos personales obvios o el dominio del correo (el front solo lo informa).

## Sesión y estado entre pantallas
- La sesión se maneja con cookie `httpOnly`; el front no guarda tokens en storage.
- El token de A2C y los datos entre pantallas viajan solo en memoria (`navigate(..., { state })`).

## Pendientes
- `src/api/cliente.ts` aún lee un token de `sessionStorage`: retirar cuando la cookie esté lista.
- Momento de creación de la cuenta en BD durante el registro (A3 → A3A).
- Formato del teléfono: el front acepta 10 a 13 dígitos (con o sin `+52`).
- Si `/auth/reenviar-codigo` identifica el intento por cookie o necesita un identificador en el cuerpo.
- Límite de reenvíos: si existe, el backend debe responder `429` y, opcionalmente, informar los restantes.
