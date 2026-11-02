# Convenciones de Código y Estructura

## Nomenclatura
- **Técnico (inglés)**: `app`, `components`, `features`, `lib`, `hooks`, `types`, `api`, `assets`, `auth`, `ui`, `layouts`, `pages`, `content`, `services`.
- **Negocio (español)**: `clientes`, `expedientes`, `solicitudes`, `propuestas`, `pagos`, `agenda`, `perfil`, `inicio-publico` (`dashboard` y `chat` por especificación).
- **Archivos/Carpetas**: minúsculas, sin acentos ni ñ, guiones si son varias palabras (`inicio-publico`).
- **Componentes React**: PascalCase. Dominio en español (`ExpedienteCard.tsx`), genéricos en inglés (`Button.tsx`).

## Estructura de `src/`
- `api/`: Cliente HTTP (Axios) e interceptores globales.
- `app/`: Configuración global de la aplicación (enrutador y proveedores).
- `assets/`: Recursos estáticos (imágenes, fuentes, íconos).
- `components/`: Componentes compartidos (`ui/` genéricos y `layouts/` estructurales).
- `features/`: Módulos verticales de negocio (`agenda`, `auth`, `chat`, `clientes`, `dashboard`, `expedientes`, `inicio-publico`, `pagos`, `perfil`, `propuestas`, `solicitudes`).
- `hooks/`: Custom hooks de React transversales y reutilizables.
- `lib/`: Utilidades generales, constantes y configuraciones de librerías.
- `types/`: Tipos e interfaces globales de TypeScript.

## Regla Arquitectónica
La lógica de cada pantalla vive en su módulo dentro de `features/`; lo compartido va en `components/` o `lib/`.
