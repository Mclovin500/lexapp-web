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

## Constantes que puedes cambiar
- `SIMULAR_ERROR_RED` (`src/api/mock-utils.ts`): `true` simula que el servidor no responde (A2A–A5A).
- `ESTADO_VALIDACION_MOCK` (`services/sesion.mock.ts`): destino tras A2A y estado de A5A sin `?estado=`.
- `SESION_ACTIVA_MOCK` (`services/sesion.mock.ts`): si A1 abierta directo en `/bienvenida` encuentra sesión.
