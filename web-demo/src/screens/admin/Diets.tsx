import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDiets } from '../../data/mockApi'
import type { Diet } from '../../types'

export default function Diets() {
  const [searchTerm, setSearchTerm] = useState('')
  const [diets, setDiets] = useState<Diet[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getDiets()
      .then(setDiets)
      .finally(() => setLoading(false))
  }, [])

  const filtered = diets.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="px-6 pb-6 pt-6">
      <input
        className="mb-3 w-full rounded-md border border-gray-300 bg-white p-2.5 text-base outline-none focus:border-primary"
        placeholder="Buscar Dieta"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {!loading && filtered.length === 0 && (
        <p className="py-6 text-center text-gray-500">
          No se encontraron dietas
        </p>
      )}

      {filtered.map((diet) => (
        <button
          key={diet.id}
          type="button"
          onClick={() => navigate(`/admin/dietas/${diet.id}`)}
          className="my-2 block w-full rounded-md border border-gray-300 bg-white p-4 text-left"
        >
          <p className="truncate text-base font-medium text-gray-900">
            {diet.name}
          </p>
          {diet.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {diet.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-secondary px-2 py-1 text-xs text-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}

      <button
        type="button"
        onClick={() => navigate('/admin/dietas/nueva')}
        className="my-4 w-full rounded-md bg-primary p-4 text-center text-lg text-white"
      >
        Agregar Dieta
      </button>
    </div>
  )
}
