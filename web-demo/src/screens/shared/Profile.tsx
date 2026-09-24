import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cake, Camera, LogOut, Mail, UserRound } from 'lucide-react'
import Spinner from '../../components/Spinner'
import { SettingsList } from '../../components/SettingsList'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { getUserInfo } from '../../data/mockApi'
import type { User } from '../../types'

const ROLE_LABEL: Record<string, string> = {
  ESPECIALISTA: 'Especialista de la salud',
  PACIENTE: 'Paciente',
  CUIDADOR: 'Cuidador',
}

export default function Profile() {
  const { user, logout } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [details, setDetails] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    getUserInfo(user.id)
      .then(setDetails)
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading)
    return (
      <Spinner text="Cargando perfil del usuario..." />
    )

  if (!details)
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-gray-600">
          No hay datos de usuario disponibles. Intenta de nuevo más tarde.
        </p>
      </div>
    )

  const info = [
    {
      icon: <UserRound size={24} className="text-primary" />,
      title: 'Nombre',
      subtitle: details.name,
    },
    {
      icon: <Mail size={24} className="text-primary" />,
      title: 'Correo',
      subtitle: details.email,
    },
    {
      icon: <Cake size={24} className="text-primary" />,
      title: 'Cumpleaños',
      subtitle: details.birthDate
        ? new Date(details.birthDate).toLocaleDateString('es-ES')
        : 'No especificado',
    },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-full bg-gray-100 px-4 pb-8">
      <div className="pt-6">
        <p className="text-lg text-gray-600">Bienvenid@</p>
        <p className="text-2xl font-bold text-gray-700">{details.name}</p>
        <p className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
          {ROLE_LABEL[details.role] ?? details.role}
        </p>
      </div>

      <div className="my-8 flex flex-col items-center gap-2">
        <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-primary bg-gray-200">
          {details.picture ? (
            <img
              src={details.picture}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <UserRound size={64} />
              <span className="text-xs">Sin foto</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() =>
            show('info', 'Cambio de foto no disponible en la demo')
          }
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          <Camera size={16} /> Seleccionar Foto
        </button>
      </div>

      <div className="mb-6">
        <SettingsList items={info} />
      </div>

      {details.role === 'CUIDADOR' && (
        <button
          type="button"
          onClick={() => navigate('/user/vincular')}
          className="mx-auto mb-6 block w-11/12 rounded-xl bg-blue-600 py-4 text-center text-lg font-bold text-white shadow-md"
        >
          Gestionar Pacientes (Cuidador)
        </button>
      )}

      {details.role === 'PACIENTE' && (
        <button
          type="button"
          onClick={() => navigate('/user/solicitudes')}
          className="mx-auto mb-6 block w-11/12 rounded-xl bg-blue-600 py-4 text-center text-lg font-bold text-white shadow-md"
        >
          Gestionar Solicitudes de Cuidadores
        </button>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="mx-auto mb-4 flex w-11/12 items-center justify-center gap-2 rounded-xl bg-red-500 py-4 text-lg font-bold text-white shadow-md"
      >
        <LogOut size={20} /> Cerrar Sesión
      </button>
    </div>
  )
}
