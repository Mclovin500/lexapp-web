# Convenciones de Código y Estructura

## Nomenclatura
- **Técnico (inglés)**: `app`, `components`, `features`, `lib`, `hooks`, `types`, `api`, `assets`, `auth`, `ui`, `layouts`, `pages`, `content`, `services`.
- **Negocio (español)**: `clientes`, `expedientes`, `solicitudes`, `propuestas`, `pagos`, `agenda`, `perfil`, `inicio-publico`, `app-movil` (`dashboard` y `chat` por especificación).
- **Archivos/Carpetas**: minúsculas, sin acentos ni ñ, guiones si son varias palabras (`inicio-publico`).
- **Componentes React**: PascalCase. Dominio en español (`ExpedienteCard.tsx`), genéricos en inglés (`Button.tsx`).
- **Identificadores de Pantalla**: P01 Landing page (previamente referenciada como A1 Bienvenida), P02 Inicio de sesión (reemplaza A2), P03 Selección de perfil, P04 App móvil para clientes, B1 Dashboard.

## Estructura de `src/`
- `api/`: Cliente HTTP (Axios) e interceptores globales.
- `app/`: Configuración global de la aplicación (enrutador y proveedores).
- `assets/`: Recursos estáticos (imágenes, fuentes, íconos).
- `components/`: Componentes compartidos (`ui/` genéricos y `layouts/` estructurales).
- `features/`: Módulos verticales de negocio (`agenda`, `app-movil`, `auth`, `chat`, `clientes`, `dashboard`, `expedientes`, `inicio-publico`, `pagos`, `perfil`, `propuestas`, `solicitudes`).
- `hooks/`: Custom hooks de React transversales y reutilizables.
- `lib/`: Utilidades generales, constantes y configuraciones de librerías.
- `types/`: Tipos e interfaces globales de TypeScript.

## Piezas compartidas
- `api/endpoints.ts`: único lugar con las rutas del backend. `api/mocks.ts`: interruptor `USAR_MOCKS`,
  usado siempre como `if (import.meta.env.DEV && USAR_MOCKS)` para que producción no incluya mocks.
  `api/mock-utils.ts`: latencia y error de red simulados (solo para `*.mock.ts`).
- `hooks/useTemporizador.ts`: cuenta regresiva (`restantes`, `formateado` mm:ss, `terminado`, `reiniciar`).
- `features/auth/components/compartidos/`: `CampoCodigo` (6 casillas), `FormularioCodigo` (código + reenvío),
  `TarjetaAcceso`, `AlertaError`, `CorreoEnmascarado`, `NotaVigencia`, `EtiquetaPaso`.
- `features/auth/components/compartidos/` (cont.): `CampoSelect`, `CampoAreaTexto` (contador `aria-live`),
  `MensajeError` (texto por tipo de error + enlace opcional).
- `features/auth/components/recuperacion/`: formularios y confirmación de A2B y A2D.
- `features/auth/components/registro/`: `TarjetaRegistro` (tarjeta común de A3–A5), `ConProgresoRegistro`
  (precarga de A4/A5), `AccionesRegistro`, `SelectorEtiquetas` (`aria-pressed`), `SelectorDisponibilidad`,
  formularios de A4 y A5.
- `features/auth/components/validacion/`: `TarjetaEstadoValidacion`, `DatosExpediente`, `FuncionesRestringidas` (A5A).
- `features/auth/content/catalogos.content.ts`: catálogos provisionales (TODO: `GET /catalogos/...`).
- `features/auth/lib/`: `mapear-error.ts` (axios → `ErrorAutenticacion`), `estado-navegacion.ts`
  (validadores del `state` entre pantallas), `destino-por-validacion.ts`.
- `features/auth/schemas/contrasena.schema.ts`: reglas únicas de contraseña (A3 y A2D).
- Cada endpoint: función en `services/`, mock en `services/*.mock.ts` (import dinámico) y hook en `hooks/`.

## Regla Arquitectónica
La lógica de cada pantalla vive en su módulo dentro de `features/`; lo compartido va en `components/` o `lib/`.

