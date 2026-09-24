import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function StackHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  return (
    <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-center bg-primary px-3 shadow-md">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15"
        aria-label="Regresar"
      >
        <ChevronLeft size={26} />
      </button>
      <h1 className="max-w-[70%] truncate text-center text-lg font-bold text-white">
        {title}
      </h1>
    </div>
  )
}
