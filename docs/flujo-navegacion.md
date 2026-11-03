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

## Decisiones de Arquitectura y Navegación

1. **P02 exclusivo para abogados**: sin selector de rol; elimina y sustituye la antigua pantalla A2.
2. **P03 bifurcación**: opción "Abogado" dirige a A3; opción "Cliente" dirige a P04.
3. **P04 app móvil**: no debe existir la opción "Continuar en navegador".
4. **Destino tras A2A**: depende del estado de validación (`validado` → B1; demás estados → A5A).
5. **Ubicación de A1**: pantalla de carga cuya ubicación se definirá al final.

