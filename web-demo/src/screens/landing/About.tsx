import { Link } from 'react-router-dom'
import {
  ArrowBigLeft,
  ShieldCheck,
  UsersRound,
  Zap,
} from 'lucide-react'
import Logo from '../../components/Logo'

const AUTHORS = [
  'Miguelangel Vélez Aguirre',
  'Brahian Carrera Rodríguez',
  'Diana Margot López Herrera',
  'Francia Edith López Herrera',
]

export default function About() {
  return (
    <div className="phone-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-primary px-4 py-4">
      <div className="my-auto w-full rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo width={110} height={110} />
          <h1 className="text-2xl font-bold text-gray-700">
            Acerca de Nosotros
          </h1>
          <p className="text-center text-sm text-gray-600">
            Nuestra app está pensada para ayudarte a cuidar tu salud y
            bienestar de forma sencilla. Recopilamos algunos datos básicos
            durante tu registro para ofrecerte una experiencia adaptada y útil.
          </p>
        </div>

        <hr className="my-5 border-gray-200" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            ¿Cómo funciona?
          </h2>

          <div className="flex items-start gap-2">
            <UsersRound size={18} className="mt-0.5 shrink-0 text-indigo-500" />
            <p className="flex-1 text-sm text-gray-600">
              <strong>Registro:</strong> Si eres un especialista de la salud,
              ingresa con la función correspondiente. Necesitarás el código
              exclusivo para especialistas. Si eres un paciente o cuidas de
              alguien, completa tu perfil con nombre, peso, estatura, fecha de
              nacimiento y género.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <Zap size={18} className="mt-0.5 shrink-0 text-indigo-500" />
            <p className="flex-1 text-sm text-gray-600">
              <strong>Seguimiento inteligente:</strong> Para poder visualizar y
              monitorear la información de alguien, es necesario que le envíes
              una solicitud en la pestaña de perfil y que esa persona te acepte
              como su cuidador. Recibe recordatorios, alarmas y lleva un
              control de tus comidas sugeridas a través de la app.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-indigo-500"
            />
            <p className="flex-1 text-sm text-gray-600">
              <strong>Privacidad primero:</strong> Tus datos están seguros y no
              se comparten sin tu consentimiento.
            </p>
          </div>
        </div>

        <hr className="my-5 border-gray-200" />

        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-700">
            Autores
          </h2>
          {AUTHORS.map((a) => (
            <p key={a} className="text-sm text-gray-600">
              {a}
            </p>
          ))}
        </div>

        <Link
          to="/login"
          className="mx-auto mt-6 mb-4 flex w-fit items-center gap-1 rounded-full border border-gray-400 px-3 py-1 text-sm text-gray-800"
        >
          <ArrowBigLeft size={36} className="text-primary" />
          Regresar
        </Link>
      </div>
    </div>
  )
}
