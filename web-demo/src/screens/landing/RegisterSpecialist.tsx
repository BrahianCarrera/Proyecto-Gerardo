import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { useToast } from '../../context/ToastContext'
import { registerSpecialist } from '../../data/mockApi'

const inputCls =
  'h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none focus:border-primary bg-white'
const labelCls = 'text-sm font-medium text-gray-700'

export default function RegisterSpecialist() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    birthDate: '',
    code: '',
  })
  const [error, setError] = useState('')

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.id.trim()) return setError('La cédula es obligatoria')
    if (!form.firstName.trim() || !form.lastName.trim())
      return setError('Los nombres y apellidos son obligatorios')
    if (!form.email.trim()) return setError('El correo es obligatorio')
    if (form.password.length < 6)
      return setError('La contraseña debe tener al menos 6 caracteres.')
    if (form.password !== form.confirm)
      return setError('Las contraseñas no coinciden.')
    if (!form.code.trim())
      return setError('Ingresa el código para especialistas')

    const [dd, mm, yyyy] = form.birthDate.split('/')
    setSubmitting(true)
    try {
      await registerSpecialist({
        id: form.id.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        password: form.password,
        enterpriseCode: form.code.trim(),
        birthDate:
          form.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(form.birthDate)
            ? `${yyyy}-${mm}-${dd}`
            : undefined,
      })
      show(
        'success',
        'Se ha enviado un código de verificación a tu correo.',
        'Código demo: 123456',
      )
      navigate(`/verify?email=${encodeURIComponent(form.email.trim())}`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="phone-scroll min-h-0 flex-1 overflow-y-auto bg-primary-register p-3">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center gap-2">
          <Logo width={110} height={110} />
          <h1 className="text-2xl font-bold text-gray-900">Regístrate</h1>
          <p className="text-center text-sm text-gray-600">
            Cuenta de especialista de la salud — requiere código institucional
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className={labelCls}>Identificación</label>
            <input
              className={inputCls}
              placeholder="Ingresa tu cédula"
              value={form.id}
              onChange={set('id')}
              inputMode="numeric"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Nombres</label>
              <input className={inputCls} value={form.firstName} onChange={set('firstName')} />
            </div>
            <div>
              <label className={labelCls}>Apellidos</label>
              <input className={inputCls} value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Correo</label>
            <input
              type="email"
              className={inputCls}
              placeholder="Ingresa tu Email"
              value={form.email}
              onChange={set('email')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Contraseña</label>
              <input
                type="password"
                className={inputCls}
                value={form.password}
                onChange={set('password')}
              />
            </div>
            <div>
              <label className={labelCls}>Confirmar</label>
              <input
                type="password"
                className={inputCls}
                value={form.confirm}
                onChange={set('confirm')}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Fecha de nacimiento</label>
            <input
              className={inputCls}
              placeholder="DD/MM/AAAA"
              value={form.birthDate}
              onChange={set('birthDate')}
              maxLength={10}
            />
          </div>
          <div>
            <label className={labelCls}>Código</label>
            <input
              className={inputCls}
              placeholder="Ingresa el código para especialistas"
              value={form.code}
              onChange={set('code')}
            />
            <p className="mt-1 text-xs text-gray-500">
              Código demo institucional:{' '}
              <span className="font-semibold text-primary">GERARDO2024</span>
            </p>
          </div>

          {error && (
            <p className="text-center text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center rounded-md bg-primary text-base font-semibold text-white transition hover:bg-primary-dark disabled:opacity-70"
          >
            {submitting ? 'Enviando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="font-medium text-primary">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
