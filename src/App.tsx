import { api } from '@/api/cliente'

export default function App() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-slate-900">
      <h1 className="text-4xl font-bold text-white">LexApp</h1>
      <p className="text-slate-400">API: {api.defaults.baseURL}</p>
    </div>
  )
}