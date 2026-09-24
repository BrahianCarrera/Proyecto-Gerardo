import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

export default function Header() {
  const navigate = useNavigate()
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-gray-300 bg-white px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-x-2"
      >
        <Logo width={40} height={40} />
        <span className="text-xl font-bold text-gray-800">Gerardo</span>
      </button>
    </div>
  )
}
