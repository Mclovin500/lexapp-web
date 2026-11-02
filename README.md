# LexApp Web

Portal web de **LexApp**, plataforma de gestión jurídica diseñada exclusivamente para abogados.

## Stack Tecnológico
- **Frontend**: React 19 + TypeScript + Vite 8
- **Estilos**: Tailwind CSS v4
- **Enrutamiento**: React Router DOM v7
- **Manejo de Estado / Servidor**: TanStack React Query v5
- **Formularios y Validación**: React Hook Form + Zod
- **Cliente HTTP**: Axios

## Instalación

1. Clona el repositorio e ingresa al directorio del proyecto:
   ```bash
   cd lexapp-web
   ```

2. Instala las dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```

## Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura tus variables:
```bash
cp .env.example .env
```

Variables requeridas:
- `VITE_API_URL`: URL base del backend / API de LexApp.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Compila el proyecto con TypeScript y genera el bundle de producción en `dist/`.
- `npm run lint`: Ejecuta ESLint para verificar calidad de código.
- `npm run preview`: Previsualiza localmente el build de producción.
