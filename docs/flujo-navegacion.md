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
| D1, D2, D3, D5, E1–E3, F1, G1, G1A, H1, I1, J1 | — | Placeholder dentro del panel |

Enlaces de retorno: A2A y A2B → P02; A2C → A2B; A2D → P02 (el código es de un solo uso);
A3A "Corregir" → A3; A4 "Anterior" → A3; A5 "Anterior" → A4.
Sin estado de navegación (recarga o acceso directo): A2A → P02; A2C y A2D → A2B; A3A → A3.
A3A → A4 y A5 → A5A usan `replace` (el código ya se usó / el registro ya se envió).
Desde A5A: `validado` → B1 ("Ingresar a mi despacho"); `requiere_correccion` → A4 o A5.

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

