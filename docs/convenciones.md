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
- `features/auth/components/validacion/`: `TarjetaEstadoValidacion`, `DatosExpediente`, `AccionesValidacion`, `FuncionesRestringidas` (A5A).
- `features/auth/content/catalogos.content.ts`: catálogos provisionales (TODO: `GET /catalogos/...`).
- `features/auth/lib/`: `mapear-error.ts` (axios → `ErrorAutenticacion`), `estado-navegacion.ts`
  (validadores del `state` entre pantallas), `destino-por-validacion.ts`.
- `features/auth/schemas/contrasena.schema.ts`: reglas únicas de contraseña (A3 y A2D).
- Cada endpoint: función en `services/`, mock en `services/*.mock.ts` (import dinámico) y hook en `hooks/`.
- Panel interno: `components/layouts/AppLayout.tsx` (Sidebar + Header únicos) y `components/layouts/app/`
  (`Sidebar`, `EncabezadoApp`, `navegacion.ts` con las 10 opciones de la sección 7).
- `api/errores.ts`: `ErrorApi` y `aErrorApi()` para los módulos internos (B1 en adelante).
- `components/ui/`: `Avatar`, `EstadoCarga`, `EstadoError`, `EstadoVacio`, `Paginacion`; `PlaceholderPage interna`;
  `FiltroPestanas` (filtros con `aria-pressed` y totales), `BuscadorListado` (buscar con Enter o botón; usar `key`),
  `Dialogo` (`<dialog>` nativo modal).
- `lib/`: `fechas.ts` (formatos es-MX, relativos y `hoyIso`), `moneda.ts` (MXN), `importes.ts` (validar y sumar en centavos), `archivos.ts`, `iniciales.ts`.
- `features/dashboard/`: B1, B1A y la cuenta del Header. `features/solicitudes/`: C1 y C2.
- `features/propuestas/`: D1 y D2. `features/pagos/`: D3, D4 y D5 (estados de movimiento compartidos con B1).
- `features/expedientes/`: E1, E2 y E3 (documentos). `features/clientes/`: F1 y F2, más las opciones de los selects.
- `features/agenda/`: G1 y G1A. `services/videollamada.service.ts` es el punto único para conectar el proveedor de video;
  `hooks/useMedios.ts` maneja cámara, micrófono y pantalla (y los libera al salir).
- `features/chat/`: H1. Estado de navegación `EstadoAbrirCliente` (`{ clienteId, expedienteId? }`) para abrir H1 o G1 desde otras pantallas.
- `hooks/useAhora.ts`: hora actual que se renueva sola (las reglas de React no permiten `Date.now()` al renderizar).
- `features/perfil/`: I1. `features/configuracion/`: J1 y J1A; `lib/clabe.ts` valida la CLABE (dígito de control y banco).
- `components/ui/Avatar`: acepta `foto` (si no hay, muestra las iniciales).
- `components/ui/PlaceholderPage`: ya no se usa en el panel (todas las pantallas están implementadas).
- Mocks que combinan módulos (`expediente-detalle.mock.ts`, `clientes-directorio.mock.ts`) van en archivos aparte
  para evitar importaciones circulares entre mocks.
- `lib/archivos.ts`: `extensionArchivo`, `descargarUrl` (descarga desde una URL temporal) y `formatearTamano`.
- `components/ui/Dialogo`: el título usa `useId`, así que puede haber varios diálogos en una pantalla.
- Los formularios internos reutilizan `CampoTexto`, `CampoSelect` y `CampoAreaTexto` de `features/auth`;
  TODO: moverlos a `components/ui/` cuando se toque esa parte.
- Filtros de listados en la URL (`useSearchParams`) para conservarlos al volver con "Atrás".

## Regla Arquitectónica
La lógica de cada pantalla vive en su módulo dentro de `features/`; lo compartido va en `components/` o `lib/`.

