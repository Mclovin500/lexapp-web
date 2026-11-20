# Pendientes del backend para la web del abogado

Revisión de Back_Lexapp hasta el commit `c38fd8f` (módulo de mensajería y seguimiento de expedientes).
La web ya consume lo que existe. Lo siguiente es lo que falta para quitar los mocks o los cálculos provisionales.

## Bloqueantes (fallan hoy)

1. **Tabla `notas_expediente`.** El modelo y los endpoints `/api/expedientes/{id}/notas` existen, pero la tabla
   no está en la base de datos: cualquier llamada devuelve 500. La web todavía no los usa.
2. **Nadie crea notificaciones.** `NotificacionService.CrearAsync` no se llama desde ningún servicio, así que
   `/api/notificaciones` siempre está vacío. Sugerencia: crearlas al recibir solicitud, aceptar o rechazar
   propuesta, nuevo mensaje, documento, factura y cita.

## Notificaciones

- Usar valores fijos en `tipo_notificacion`. La web reconoce: `nueva_solicitud`, `nuevo_mensaje`,
  `propuesta_aceptada`, `propuesta_rechazada`, `documento_recibido`, `documento_pendiente`, `nuevo_cobro`,
  `pago_realizado`, `actualizacion_expediente`, `proxima_videollamada`. Cualquier otro se muestra como "Aviso".
- Agregar el id del recurso (por ejemplo `id_caso` o `id_solicitud`) para abrir el detalle. Hoy la web solo
  puede abrir el listado del módulo.

## Expedientes

- `estado_caso_enum` no tiene "en espera". La web muestra la opción, pero avisa que no está disponible.
- Cambiar el estado no guarda motivo ni historial. La tabla `historial_caso` existe en la base de datos,
  pero el backend no la usa. Podría registrar los cambios de estado y salir en `/timeline`.
- `GET /expedientes/dashboard` no devuelve `idCliente`, y su filtro de estado acepta un solo valor. Por eso la
  web sigue usando `/casos/mis-casos` para el listado.
- No hay endpoint de "actualizaciones de seguimiento" visibles para el cliente (E2 → "Actualizar seguimiento").
- El caso no guarda área jurídica ni la propuesta de origen.

## Endpoints que la web necesita y no existen

| Ruta propuesta | Pantalla | Cómo se resuelve hoy |
|---|---|---|
| `GET /dashboard/resumen` | B1 | Se arma con expedientes, solicitudes, propuestas, citas y facturas (muchas peticiones) |
| `GET /abogado/cuenta` | Header y Sidebar | Se arma con `/auth/sesion`, `/abogado/validacion`, la bandeja, el dashboard y `/notificaciones/conteo` |
| `GET/PUT /abogado/perfil`, `POST/DELETE /abogado/perfil/foto` | I1 | Mock |
| `GET/PUT /abogado/datos-personales`, `POST /abogado/contrasena` | J1 | Mock |
| `GET/DELETE /abogado/sesiones` | J1 | Mock |
| `GET/PUT /abogado/preferencias/*`, `POST /abogado/privacidad/exportacion` | J1 | Mock |
| `GET/PUT /abogado/cuenta-deposito` | J1A | Mock |
| `POST /auth/cerrar-sesion` | J1 | Solo se borra el token local; el JWT sigue siendo válido hasta que vence |
| Subida de adjuntos del chat | H1 | Solo se envía texto |
| Disponibilidad y videollamada | G1, G1A | Mock |
