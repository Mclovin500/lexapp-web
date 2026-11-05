# Flujo de Navegación de LexApp Web

## Diagrama de Navegación Acordado

```
P01 Landing
 ├─ Iniciar sesión ─────────────────────► P02 Login (SOLO abogados)
 └─ Comenzar / Comenzar ahora / Conocer la experiencia para clientes / Regístrate como abogado ─► P03

P03:   Abogado ► A1 Carga ► A3 Registro        Cliente ► P04 App móvil

Login: P02 ► A2A código ► A1 Carga ► validado ► B1 Dashboard
                                   └ pendiente / requiere corrección / rechazado ► A5A
       P02 "¿Olvidaste tu contraseña?" ► A2B ► A2C ► A2D ► P02
       P02 "Regístrate" ► P03

Registro: A3 ► A3A ► A4 ► A5 ► A5A ► (aprobado) B1
Panel (Sidebar + Header): B1 ► C1 ► C2 ► D1 (crear propuesta) | C2 ► Rechazar | C2 ► H1 (conversación)
                          Campana del Header ► B1A ► C2/C1, H1, D2, E3, D5, E2, G1A según el tipo
A1 abierta directamente (/bienvenida, sin destino): sesión activa ► B1 o A5A | sin sesión ► P02
```

## Pantallas implementadas

| Pantalla | Ruta | Estado |
|---|---|---|
| P01 Landing | `/` | Implementada |
| P02 Login | `/login` | Implementada |
| P03 Selección de perfil | `/seleccion-perfil` | Implementada |
| P04 App móvil | `/app-movil` | Implementada |
| A1 Carga | `/bienvenida` | Implementada (tras A2A y al elegir "Abogado" en P03) |
| A2A Verificación de código | `/verificar-codigo` | Implementada |
| A2B Recuperar contraseña | `/recuperar-contrasena` | Implementada |
| A2C Código de recuperación | `/codigo-recuperacion` | Implementada |
| A2D Nueva contraseña | `/nueva-contrasena` | Implementada |
| A3 Registro básico | `/registro` | Implementada |
| A3A Verificación de correo | `/verificar-correo` | Implementada |
| A4 Credenciales | `/registro/credenciales` | Implementada |
| A5 Área de práctica y perfil | `/registro/perfil` | Implementada |
| A5A Estado de validación | `/validacion-profesional` | Implementada |
| B1 Dashboard | `/dashboard` | Implementada (sin protección de ruta) |
| B1A Centro de notificaciones | `/notificaciones` | Implementada (se abre desde la campana del Header) |
| C1 Solicitudes recibidas | `/solicitudes` | Implementada (filtros en la URL) |
| C2 Detalle de solicitud | `/solicitudes/:solicitudId` | Implementada |
| D1 Crear propuesta | `/propuestas/nueva` · `/propuestas/:propuestaId/editar` | Implementada (crear desde C2 o desde cero; editar borradores) |
| D2 Seguimiento de propuestas | `/propuestas` | Implementada (filtros en la URL, detalle y cancelación en diálogo) |
| D3 Honorarios y cobros | `/honorarios` | Implementada (`?propuesta=` filtra los movimientos de una propuesta) |
| D4 Cobro adicional | `/honorarios/cobros/nuevo` | Implementada (`?cliente=&expediente=` precarga desde E2) |
| D5 Detalle de movimiento | `/honorarios/movimientos/:movimientoId` | Implementada (solo lectura) |
| E1 Mis expedientes | `/expedientes` | Implementada (filtros en la URL) |
| E2 Detalle del expediente | `/expedientes/:expedienteId` | Implementada (actualizaciones, cambio de estado) |
| E3 Documentos del expediente | `/expedientes/:expedienteId/documentos` | Implementada (vista previa, descarga, carga y revisión) |
| F1 Directorio de clientes | `/clientes` | Implementada |
| F2 Detalle del cliente | `/clientes/:clienteId` | Implementada |
| G1 Agenda | `/agenda` | Implementada (`?fecha=AAAA-MM-DD` selecciona el día) |
| G1A Sala de videollamada | `/agenda/sala/:reunionId` | Implementada (`?origen=chat&conversacion=` para volver a H1) |
| H1 Chat | `/chat` | Implementada (`?conversacion=` selecciona la conversación) |
| I1 Perfil profesional | `/perfil` | Implementada (consultar y editar en la misma pantalla) |
| J1 Configuración | `/configuracion` | Implementada (secciones con ancla, p. ej. `#cuenta-deposito`) |
| J1A Cuenta de depósito | `/configuracion/cuenta-deposito` | Implementada (`?estado=` con datos ficticios) |

Enlaces de retorno: A2A y A2B → P02; A2C → A2B; A2D → P02 (el código es de un solo uso);
A3A "Corregir" → A3; A4 "Anterior" → A3; A5 "Anterior" → A4.
Sin estado de navegación (recarga o acceso directo): A2A → P02; A2C y A2D → A2B; A3A → A3.
A3A → A4 y A5 → A5A usan `replace` (el código ya se usó / el registro ya se envió).
Desde A5A: `validado` → B1 ("Ingresar a mi despacho"); `requiere_correccion` → A4 o A5.
Sección D: C2 "Crear propuesta" → D1 (`state` con cliente y solicitud) → D2 con aviso ·
D2 aceptada → crear/ver expediente (E2) · D2 → D3 `?propuesta=` · D3 → D4 → D5 (`replace`, aviso) ·
D3 → D5 · D3 → D2 · D3 → J1A · D5 → F2 (cliente) y E2 (expediente).
Secciones E y F: E1 → E2 → E3 · E2 → F2, H1 (chat), G1 (agenda), G1A (reunión), D4 (`?cliente=&expediente=`), D5 ·
E3 → E2 · F1 → F2 → E2, E3, D5, H1 · D2 aceptada → E2.
Secciones G y H: G1 → G1A (Unirse) → G1 · H1 → G1A (Videollamada) → H1 · H1 → E2, F2 · B1 y E2 → G1A ·
E2 "Programar reunión" → G1 con el diálogo precargado · E2, F2, C2 y D2 → H1 (abre o crea la conversación) ·
B1A mensaje → H1 `?conversacion=` · B1A videollamada → G1A.
Secciones I y J: Header (perfil) → I1 · I1 → A5A (estado de validación), G1 (horario) · J1 → I1, D3, J1A ·
J1A "Guardar cambios" → J1 `#cuenta-deposito` con aviso · J1 "Cerrar sesión" → P02 (sustituye a la antigua A2).

## Decisiones de Arquitectura y Navegación

1. **P02 exclusivo para abogados**: sin selector de rol; elimina y sustituye la antigua pantalla A2.
2. **P03 bifurcación**: opción "Abogado" dirige a A3; opción "Cliente" dirige a P04.
3. **P04 app móvil**: no debe existir la opción "Continuar en navegador".
4. **Destino tras A2A**: depende del estado de validación (`validado` → B1; demás estados → A5A).
5. **Ubicación de A1**: pantalla de transición en dos puntos: tras verificar el código en A2A
   (→ B1 o A5A) y al elegir "Abogado" en P03 (→ A3). Recibe su destino por `state`
   (`EstadoCarga`, lista cerrada de rutas) y navega con `replace`. Los enlaces "Iniciar sesión"
   de P01 y del resto de pantallas van directo a P02.
6. **Sidebar único**: las 10 opciones de la sección 7 de la especificación, en ese orden. Las
   notificaciones no están en el Sidebar: se abren desde la campana del Header (B1A).
7. **Reuniones solo virtuales** (regla 9.2): B1 no muestra citas presenciales, notarías ni direcciones.
8. **C2 "Revisar información"**: marca la solicitud `nueva` como `en_revision` y lleva a la información
   del cliente. "Rechazar" solo aparece en `nueva` o `en_revision` (pide motivo).

