import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { ErrorApi } from '@/api/errores'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => {
    // Si cualquier petición responde 401, se vuelve a consultar la sesión y RutaProtegida lleva a P02.
    const alFallar = (error: unknown) => {
      if (error instanceof ErrorApi && error.tipo === 'sesion_expirada') {
        void cliente.invalidateQueries({ queryKey: ['auth', 'sesion'] })
      }
    }
    const cliente: QueryClient = new QueryClient({
      queryCache: new QueryCache({ onError: alFallar }),
      mutationCache: new MutationCache({ onError: alFallar }),
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          retry: 1,
        },
      },
    })
    return cliente
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
