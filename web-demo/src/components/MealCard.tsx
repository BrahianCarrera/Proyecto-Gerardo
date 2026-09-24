import { Apple, Flame, Soup } from 'lucide-react'

interface MealCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  isConsumed: boolean
  size: string
  onPressCard: (mealId: string) => void
}

export default function MealCard({
  id,
  title,
  description,
  imageUrl,
  isConsumed,
  size,
  onPressCard,
}: MealCardProps) {
  return (
    <button
      type="button"
      onClick={() => onPressCard(id)}
      className={`my-2 mx-1 flex w-[calc(100%-8px)] items-center overflow-hidden rounded-xl bg-white pr-4 text-left shadow-md transition active:scale-[0.99] ${
        isConsumed ? 'opacity-60' : ''
      }`}
    >
      <img
        src={imageUrl}
        alt=""
        className="h-32 w-32 shrink-0 object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1 px-3 py-2">
        <p
          className={`mb-1 truncate text-lg font-bold text-gray-800 ${
            isConsumed ? 'line-through' : ''
          }`}
        >
          {title}
        </p>
        <div className="flex items-center gap-x-1">
          <Soup size={20} className="shrink-0 text-gray-700" />
          <span className="text-sm text-gray-700">{size}</span>
        </div>
        <div className="flex items-center">
          <Flame size={20} className="shrink-0 text-gray-700" />
          <span className="text-sm text-gray-700">&nbsp;Calorias: {description}</span>
        </div>
      </div>
      {isConsumed && (
        <span className="shrink-0 rounded-full bg-green-100 p-2">
          <Apple size={24} className="text-green-600" />
        </span>
      )}
    </button>
  )
}
