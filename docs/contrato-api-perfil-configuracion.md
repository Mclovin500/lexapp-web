# PROPUESTA — por confirmar con el equipo de backend

Contrato de I1 (perfil profesional), J1 (configuración) y J1A (cuenta de depósito). Rutas en `src/api/endpoints.ts`.
Mismas reglas que `contrato-api-panel.md`: sesión por cookie `httpOnly`, errores → `ErrorApi`, fechas ISO 8601.

## I1 · Perfil profesional
- `GET /abogado/perfil` → `{ "fotoUrl", "tratamiento", "nombreCompleto", "cedula", "estadoValidacion", "visibleParaClientes",
  "aniosExperiencia", "formacion": [{ "id", "titulo", "institucion", "anioInicio", "anioFin": null | año }],
  "experiencia": [{ "id", "cargo", "organizacion", "anioInicio", "anioFin", "descripcion" }],
  "areasPractica": [valor], "especialidades": [valor], "descripcion", "idiomas",
  "servicios": [{ "id", "nombre", "descripcion" }],
  "honorarios": { "consultaInicial" (MXN, 0 = sin costo), "tarifaHora": null | MXN, "nota" },
  "disponibilidad": { "aceptaNuevosCasos", "modalidad" } }`.
- `PUT /abogado/perfil` con los mismos campos editables (sin foto, nombre, cédula ni estado de validación) → 204 · 422.
  Los `id` que empiezan con `nuevo-` son elementos nuevos: el backend asigna el definitivo.
- `POST /abogado/perfil/foto` (multipart: `foto`, JPG o PNG ≤ 4 MB) → `{ "fotoUrl" }` · `DELETE /abogado/perfil/foto` → 204.
- Regla 9.5: `estadoValidacion` y `visibleParaClientes` los decide el backend; el front nunca muestra "validado" por su cuenta.
  La cédula no se edita en I1: cambiarla requiere una nueva validación.
- El horario de disponibilidad se muestra desde `GET /agenda/disponibilidad` (G1); no se duplica en el perfil.
- `GET /abogado/cuenta` ahora incluye `"fotoUrl"` para el Header.

## J1 · Configuración
- `GET` / `PUT /abogado/datos-personales` `{ "telefono": null | "<texto>", "zonaHoraria" }`. Nombre y correo son de solo lectura.
- `POST /abogado/contrasena` `{ "contrasenaActual", "contrasenaNueva" }` → 204. 422 si la actual no coincide; 409 si es igual.
  Mismas reglas de contraseña que A3/A2D. Debe cerrar las demás sesiones.
- `GET /abogado/sesiones` → `[{ "id", "dispositivo", "navegador", "ubicacion" (ciudad), "ultimaActividad", "actual" }]` ·
  `DELETE /abogado/sesiones/{id}` → 204 (409 si es la actual) · `DELETE /abogado/sesiones` → cierra todas menos la actual.
- `GET` / `PUT /abogado/preferencias/notificaciones` → `{ "<categoria>": { "correo", "push" } }` con
  `categoria`: `solicitudes | mensajes | propuestas | documentos | pagos | reuniones | expedientes`.
- `GET` / `PUT /abogado/preferencias/privacidad` `{ "mostrarTelefonoAClientes", "mostrarFotoEnPerfil", "recibirComunicacionesLexApp" }`.
- `POST /abogado/privacidad/exportacion` → `{ "correo" }`: solicitud de copia de datos personales (derechos ARCO).
- `POST /auth/cerrar-sesion` → 204. El front borra la caché y navega a P02 (la antigua A2 quedó sustituida por P02).

## J1A · Cuenta de depósito / honorarios
- Estados: `sin_cuenta | pendiente | verificada | rechazada`.
- `GET /abogado/cuenta-deposito` → `{ "estado", "cuenta": null | { "titular", "banco": { "clave", "nombre" },
  "clabeTerminacion" (últimos 4), "tipoCuenta": "cheques" | "debito", "pais": "MX", "moneda": "MXN" },
  "motivoRechazo", "actualizadaEn" }`. **La CLABE completa nunca regresa al front.**
- `PUT /abogado/cuenta-deposito` `{ "titular", "banco" (clave de 3 dígitos), "clabe" (18 dígitos), "tipoCuenta", "pais", "moneda" }`
  → 204 y la cuenta queda `pendiente`. El backend debe validar el dígito de control, que el banco coincida con la CLABE
  y que el titular sea el abogado (no cuentas de terceros). Al terminar notifica `verificada` o `rechazada` con motivo.
- No es para tarjetas: no hay campos de tarjeta; si se escribe un número de 15 o 16 dígitos el front lo advierte.

## Pendientes
- Proveedor de verificación de cuentas (penny test, consulta a Banxico/STP) y tiempo real de verificación.
- Cuentas fuera de México o en otra moneda (hoy solo MX/MXN).
- Cambio de correo con verificación y activación de 2FA con app (hoy el código por correo es obligatorio en cada inicio).
- Si editar áreas o especialidades en I1 requiere una nueva revisión.
