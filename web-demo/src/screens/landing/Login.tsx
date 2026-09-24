import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UsersRound } from 'lucide-react'
import Logo from '../../components/Logo'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { homeFor } from '../../routes/guards'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await login(email, password)
      // Route by role exactly like the original app
      const raw = localStorage.getItem('gerardo_demo_session_v1')
      const role = raw ? JSON.parse(raw).role : 'PACIENTE'
      navigate(homeFor(role), { replace: true })
    } catch (err) {
      show('error', 'Error al iniciar sesión', (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="phone-scroll flex min-h-0 flex-1 flex-col justify-center overflow-y-auto bg-primary p-2">
      <div className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex justify-center">
          <Logo width={180} height={180} />
        </div>
        <div className="mt-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenid@ a Gerardo
          </h1>
          <p className="mt-1 text-gray-600">Iniciar Sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              className="mt-1 h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none focus:border-primary"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                className="h-12 w-full rounded-md border border-gray-300 px-4 pr-12 text-base outline-none focus:border-primary"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                aria-label="Mostrar contraseña"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-primary text-base font-medium text-white transition hover:bg-primary-dark disabled:opacity-70"
          >
            {submitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-600">
            No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-primary">
              Regístrate
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Si eres especialista de la salud
          </p>
          <Link
            to="/register-specialist"
            className="text-sm font-medium text-primary"
          >
            Regístrate Aquí
          </Link>
        </div>

        <hr className="my-6 border-gray-200" />

        <Link
          to="/about"
          className="mb-2 flex h-10 items-center justify-center gap-3 rounded-md border border-gray-400 text-sm text-gray-800 transition hover:bg-gray-50"
        >
          Acerca De Nosotros
          <UsersRound size={18} className="text-primary" />
        </Link>
      </div>
    </div>
  )
}
