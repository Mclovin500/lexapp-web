# Flujo de Navegación de LexApp Web

## Diagrama de Navegación Acordado

```
P01 Landing
 ├─ Iniciar sesión ─────────────────────► P02 Login (SOLO abogados)
 └─ Comenzar / Comenzar ahora / Conocer la experiencia para clientes / Regístrate como abogado ─► P03

P03:   Abogado ► A3 Registro        Cliente ► P04 App móvil

Login: P02 ► A2A código ► validado ► B1 Dashboard
                        └ pendiente / requiere corrección / rechazado ► A5A
       P02 "¿Olvidaste tu contraseña?" ► A2B ► A2C ► A2D ► P02
       P02 "Regístrate" ► P03

Registro: A3 ► A3A ► A4 ► A5 ► A5A ► (aprobado) B1
A1 (pantalla de carga): se decide al final; probablemente P01 "Iniciar sesión" ► A1 ► B1 si hay sesión, P02 si no.
```

## Pantallas implementadas

| Pantalla | Ruta | Estado |
|---|---|---|
| P01 Landing | `/` | Implementada |
| P02 Login | `/login` | Implementada |
| P03 Selección de perfil | `/seleccion-perfil` | Implementada |
| P04 App móvil | `/app-movil` | Implementada |
| A1 Carga | `/bienvenida` | Implementada (sin enlace de entrada aún) |
| A2A Verificación de código | `/verificar-codigo` | Implementada |
| A2B Recuperar contraseña | `/recuperar-contrasena` | Implementada |
| A2C Código de recuperación | `/codigo-recuperacion` | Implementada |
| A2D Nueva contraseña | `/nueva-contrasena` | Implementada |
| A3 Registro básico | `/registro` | Implementada |
| A3A Verificación de correo | `/verificar-correo` | Implementada |
| A4 Credenciales | `/registro/credenciales` | Implementada |
| A5 Área de práctica y perfil | `/registro/perfil` | Implementada |
| A5A Estado de validación | `/validacion-profesional` | Implementada |
| B1 Dashboard | `/dashboard` | Pendiente (placeholder, sin protección de ruta) |

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
5. **Ubicación de A1**: pantalla de carga cuya ubicación se definirá al final.

