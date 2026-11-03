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

### 3. Manejo de sesión
- La sesión debería manejarse con cookie `httpOnly` (sin almacenar tokens en `localStorage`/`sessionStorage`).

### 4. Pendiente por definir con backend
- Momento exacto de creación de la cuenta en base de datos durante el registro (A3 → A3A).

