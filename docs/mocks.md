# Mocks de desarrollo

Se activan solo con `npm run dev` y `VITE_USAR_MOCKS=true` en `.env` (se lee únicamente en
`src/api/mocks.ts`). Para apagarlos: `VITE_USAR_MOCKS=false`.
Regla para servicios: `if (import.meta.env.DEV && USAR_MOCKS) { await import('./x.mock') }`.
`import.meta.env.DEV` va escrito en cada `if` para que el build de producción elimine los mocks.
Latencia simulada: ~700 ms (`src/api/mock-utils.ts`).

## Datos de prueba
| Pantalla | Dato | Resultado |
|---|---|---|
| P02 | `abogado@demo.com` + `Demo1234!` | Continúa a A2A |
| P02 | `cliente@demo.com` + `Demo1234!` | Error "exclusiva para abogados" |
| A2A, A2C, A3A | Código `123456` / `000000` / otro | Correcto / vencido (410) / incorrecto (400) |
| A2A, A2C, A3A | Reenviar | Espera de 30 s y vigencia de 10 min |
| A2B | Cualquier correo válido | Siempre continúa a A2C |
| A2D | Token recibido en A2C | Guarda y muestra la confirmación |
| A3 | `registrado@demo.com` | Error de correo ya registrado |
| A3A | Códigos como en A2A | `123456` continúa a A4 |
| A4 | Cédula `1234567` | 409 "Esta cédula ya está registrada." |
| A4, A5 | Datos guardados | Se precargan al volver con "Anterior" (en memoria; se pierden al recargar) |
| A5 | "Crear mi cuenta" | Responde `pendiente` y continúa a A5A |
| A5A | `/validacion-profesional?estado=pendiente` | `?estado=` (`pendiente`, `validado`, `requiere_correccion`, `rechazado`) sobrescribe la constante |
| B1 | `/dashboard` | 3 solicitudes nuevas, 3 reuniones virtuales, los 3 movimientos más recientes y actividad |
| B1A | 10 notificaciones (5 sin leer, una de cada tipo) | Marcar como leída actualiza la campana; persiste hasta recargar |
| C1 | 12 solicitudes ficticias | Filtros por estado y área, búsqueda ("Gómez", "laboral") y paginación de 8 |
| C2 | `sol-0842` (con 3 documentos) | "Revisar información" → En revisión; "Rechazar" pide motivo; `/solicitudes/no-existe` → 404 |
| D1 | "Crear propuesta" desde C2 | Cliente y solicitud precargados; "Enviar" marca la solicitud como Atendida |
| D1 | Conceptos que no suman los honorarios | Error de validación en el formulario |
| D1 | `/propuestas/pro-086/editar` | Edita un borrador; `/propuestas/pro-089/editar` muestra "no editable" |
| D2 | 9 propuestas (una o más por estado) | Filtros, búsqueda ("Gómez", "PRO-"), paginación de 8, detalle y cancelar |
| D2 | `pro-081` (aceptada sin expediente) | "Crear expediente" genera `exp-330` y abre E2 (placeholder) |
| D2 | `pro-087` | "Ver movimientos" abre D3 con `?propuesta=pro-087` (2 movimientos) |
| D3 | 9 movimientos (uno o más por estado) | Resumen, filtros, búsqueda ("peritaje", "Exp."), paginación |
| D4 | Cliente `cli-102` + `exp-290` | Crea `mov-561` pendiente y abre D5 con aviso; cliente y expediente ajenos → 422 |
| D5 | `mov-560` … `mov-520` | Historial por estado; `/honorarios/movimientos/no-existe` → 404 |
| E1 | 10 expedientes (5 activos, 2 en espera, 3 finalizados) | Filtros por estado y área, búsqueda ("amparo", "Garza"), paginación de 8 |
| E2 | `exp-312` | Actualizaciones (una interna), historial, 4 documentos, 2 pagos y 1 reunión |
| E2 | Registrar actualización / Cambiar estado | Se agregan al expediente; finalizado bloquea actualizaciones, cobros y cargas (409) |
| E2/E3 | `/expedientes/exp-999` | 403 "No tienes acceso" (expediente de otro abogado); `exp-000` → 404 |
| E3 | `exp-298` | 3 documentos, 2 pendientes de revisión; "Revisar" → revisado o requiere corrección |
| E3 | Vista previa y descarga | Documentos ficticios: PDF generado; documentos cargados en la sesión: el archivo real |
| E3 | `exp-301` / `exp-260` | Sin documentos (estado vacío) |
| F1 | 11 clientes | Estados calculados (activo, en propuesta, sin casos abiertos), búsqueda ("TechHub") |
| F2 | `cli-110` | Expediente, documentos, pagos e historial de interacción; `/clientes/cli-106` → 404 (sin relación) |

## Constantes que puedes cambiar
- `SIMULAR_ERROR_RED` (`src/api/mock-utils.ts`): `true` simula que el servidor no responde (A2A en adelante).
- `ESTADO_VALIDACION_MOCK` (`services/sesion.mock.ts`): destino tras A2A y estado de A5A sin `?estado=`.
- `SESION_ACTIVA_MOCK` (`services/sesion.mock.ts`): si A1 abierta directo en `/bienvenida` encuentra sesión.
