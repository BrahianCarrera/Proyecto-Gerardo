import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { useToast } from '../../context/ToastContext'
import { registerUser } from '../../data/mockApi'

const inputCls =
  'h-12 w-full rounded-md border border-gray-300 px-4 text-base outline-none focus:border-primary bg-white'
const labelCls = 'text-sm font-medium text-gray-700'

export default function Register() {
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
    gender: 'MASCULINO',
    role: 'PACIENTE',
    weightInt: '65',
    weightDec: '0',
    heightInt: '160',
    heightDec: '0',
  })
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.birthDate))
      return setError('La fecha de nacimiento debe tener formato DD/MM/AAAA')

    const [dd, mm, yyyy] = form.birthDate.split('/')
    setSubmitting(true)
    try {
      await registerUser({
        id: form.id.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        password: form.password,
        role: form.role as 'PACIENTE' | 'CUIDADOR',
        birthDate: `${yyyy}-${mm}-${dd}`,
        gender: form.gender as 'MASCULINO' | 'FEMENINO',
        weight: Number(`${form.weightInt}.${form.weightDec}`),
        height: Number(`${form.heightInt}.${form.heightDec}`),
      })
      show('success', 'Cuenta creada correctamente', 'Inicia sesión para continuar')
      navigate('/login', { replace: true })
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
          <h1 className="text-2xl font-bold text-gray-900">Registrate</h1>
          <p className="text-sm text-gray-600">Crea una cuenta para continuar</p>
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
              <label className={labelCls}>Confirmar Contraseña</label>
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
              inputMode="numeric"
              maxLength={10}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Género</label>
              <select className={inputCls} value={form.gender} onChange={set('gender')}>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Rol</label>
              <select className={inputCls} value={form.role} onChange={set('role')}>
                <option value="PACIENTE">Paciente</option>
                <option value="CUIDADOR">Cuidador</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Peso (kg)</label>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={form.weightInt}
                  onChange={set('weightInt')}
                  inputMode="numeric"
                />
                <input
                  className={`${inputCls} w-16`}
                  value={form.weightDec}
                  onChange={set('weightDec')}
                  inputMode="numeric"
                  maxLength={1}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Estatura (cm)</label>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={form.heightInt}
                  onChange={set('heightInt')}
                  inputMode="numeric"
                />
                <input
                  className={`${inputCls} w-16`}
                  value={form.heightDec}
                  onChange={set('heightDec')}
                  inputMode="numeric"
                  maxLength={1}
                />
              </div>
            </div>
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
            {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-primary">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
