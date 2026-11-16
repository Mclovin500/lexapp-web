import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Lee también .env y .env.local (no solo las variables del sistema).
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      // Con VITE_API_URL=/api las peticiones pasan por aquí hacia Back_Lexapp.
      // Por defecto, el perfil "https" de launchSettings.json: el puerto http (5078) responde
      // 307 hacia https (UseHttpsRedirection) y eso corta las subidas multipart.
      // Para el perfil "http" define VITE_PROXY_API=http://localhost:5078 en .env.local.
      proxy: {
        '/api': {
          target: env.VITE_PROXY_API || 'https://localhost:7276',
          changeOrigin: true,
          secure: false, // certificado de desarrollo de ASP.NET
        },
      },
    },
  }
})
