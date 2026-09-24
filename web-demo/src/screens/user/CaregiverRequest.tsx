import { useState } from 'react'
import StackHeader from '../../components/StackHeader'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { sendCaregiverRequest } from '../../data/mockApi'

export default function CaregiverRequest() {
  const { user } = useAuth()
  const { show } = useToast()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!email.trim()) {
      show('error', 'Ingresa el email del paciente')
      return
    }
    setSubmitting(true)
    try {
      await sendCaregiverRequest(user.id, email.trim())
      show(
        'success',
        'Solicitud enviada',
        'El paciente deberá aceptarla desde su perfil.',
      )
      setEmail('')
    } catch (err) {
      show('error', 'Error al enviar solicitud', (err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <StackHeader title="Enviar Solicitud de Vinculación" />
      <form onSubmit={handleSubmit} className="p-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <label className="text-sm leading-relaxed text-gray-700">
            Introduce el email del paciente al que quieres enviar una
            solicitud:
          </label>
          <input
            type="email"
            className="mt-3 w-full rounded-md border border-gray-300 p-3 text-base outline-none focus:border-primary"
            placeholder="Email del paciente"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="mt-2 text-xs text-gray-400">
            Prueba con{' '}
            <button
              type="button"
              className="font-semibold text-primary underline"
              onClick={() => setEmail('jose.perez@gerardo.demo')}
            >
              jose.perez@gerardo.demo
            </button>
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-md disabled:opacity-70"
          >
            {submitting ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs leading-relaxed text-gray-600">
          Para poder visualizar y monitorear la información de alguien, es
          necesario que le envíes una solicitud y que esa persona te acepte
          como su cuidador.
        </div>
      </form>
    </>
  )
}
