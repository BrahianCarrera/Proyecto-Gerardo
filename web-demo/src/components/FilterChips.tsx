interface FilterChipsProps {
  options: string[]
  active: string[]
  onToggle: (value: string) => void
  formatter?: (v: string) => string
}

export default function FilterChips({
  options,
  active,
  onToggle,
  formatter,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            {formatter ? formatter(opt) : opt}
          </button>
        )
      })}
    </div>
  )
}
