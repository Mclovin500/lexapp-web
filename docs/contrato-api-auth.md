# PROPUESTA — por confirmar con el equipo de backend

### 1. Iniciar sesión: `POST /auth/login`
- **Petición**:
  ```json
  { "correo": "abogado@despacho.com", "contrasena": "********", "recordarEquipo": false }
  ```
- **Respuesta 200 OK**:
  ```json
  { "requiereCodigo": true, "correoEnmascarado": "a***@despacho.com" }
  ```
- **Errores HTTP**:
  - `400 / 401`: Credenciales inválidas (`{ "codigo": "credenciales" }`).
  - `403`: Cuenta no abogado (`{ "codigo": "cuenta_no_abogado" }`).
  - `429`: Demasiados intentos (`{ "codigo": "demasiados_intentos" }`).

### 2. Verificación de seguridad: `POST /auth/verificar-codigo` (A2A)
- Valida el código OTP y emite la sesión.
- **Respuesta requerida**: debe devolver el estado de validación del perfil:
  `estadoValidacion: 'pendiente' | 'validado' | 'requiere_correccion' | 'rechazado'`
- Criterio de navegación: `validado` dirige a B1 Dashboard; otros estados dirigen a A5A.

### 3. Consultar sesión activa: `GET /auth/sesion` (A1)
- Lo llama la pantalla de carga A1 al entrar, sin cuerpo (usa la cookie de sesión).
- **Respuesta 200 OK** (hay sesión):
  ```json
  { "estadoValidacion": "validado" }
  ```
  Valores: `pendiente | validado | requiere_correccion | rechazado`.
- **Respuesta 401**: no hay sesión → el front redirige a P02.
- Criterio de navegación: igual que A2A (`validado` → B1; otros estados → A5A).

### 4. Registro básico: `POST /auth/registro` (A3)
- **Petición**:
  ```json
  {
    "nombre": "Alejandro",
    "apellidos": "Morales Vega",
    "correo": "alejandro.morales@despacho.com",
    "telefono": "5512345678",
    "contrasena": "********",
    "aceptaTerminos": true
  }
  ```
  - `telefono` es opcional: se envía `null` si no se captura.
  - La confirmación de contraseña solo se valida en el front; no se envía.
  - Reglas de contraseña del front: mínimo 8 caracteres, 1 mayúscula y 1 número (el backend debe validar lo mismo).
- **Respuesta 201 Created**: el backend envía el código de 6 dígitos al correo y responde:
  ```json
  { "correoEnmascarado": "a***@despacho.com" }
  ```
  El front navega a A3A con ese valor.
- **Errores HTTP**:
  - `409`: correo ya registrado (`{ "codigo": "correo_registrado" }`).
  - `400 / 422`: datos inválidos (`{ "codigo": "datos_invalidos" }`).
  - `429`: demasiados intentos (`{ "codigo": "demasiados_intentos" }`).

### 5. Manejo de sesión
- La sesión debería manejarse con cookie `httpOnly` (sin almacenar tokens en `localStorage`/`sessionStorage`).

### 6. Pendiente por definir con backend
- Momento exacto de creación de la cuenta en base de datos durante el registro (A3 → A3A). El front funciona igual en ambos casos.
- Formato del teléfono: el front acepta 10 a 13 dígitos (con o sin lada `+52`).

## Rutas en el front
Todas las rutas de endpoints están centralizadas en `src/api/endpoints.ts`.
