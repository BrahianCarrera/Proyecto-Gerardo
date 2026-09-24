import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { resendOtp, verifySpecialist } from '../../data/mockApi'

export default function Verification() {
  const [params] = useSearchParams()
  const email = params.get('email') ?? 'tu@correo.com'
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const { show } = useToast()
  const navigate = useNavigate()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      show('error', 'Ingresa el código de 6 dígitos')
      return
    }
    setSubmitting(true)
    try {
      await verifySpecialist(email, otp)
      show('success', 'Cuenta verificada', 'Ahora puedes iniciar sesión')
      navigate('/login', { replace: true })
    } catch (err) {
      show('error', 'Error de verificación', (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendOtp(email)
      show('info', 'Código reenviado', 'Código demo: 123456')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="phone-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-primary p-4">
      <div className="my-auto w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">
          Verificación de Código
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Hemos enviado un código de verificación a{' '}
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="mt-6">
          <input
            className="w-full rounded-lg border border-gray-300 py-3 text-center text-3xl font-bold tracking-[0.4em] text-gray-900 outline-none focus:border-primary"
            placeholder="------"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
          />
          <p className="mt-2 text-xs text-gray-400">
            En esta demo el código es <strong>123456</strong>
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 h-12 w-full rounded-md bg-primary text-base font-semibold text-white transition hover:bg-primary-dark disabled:opacity-70"
          >
            {submitting ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="mt-4 text-sm text-gray-600 underline"
        >
          {resending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
        </button>

        <p className="mt-6">
          <Link to="/login" className="text-sm font-medium text-primary">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
