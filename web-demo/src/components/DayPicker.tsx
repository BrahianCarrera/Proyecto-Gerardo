const LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'] as const

interface DayPickerProps {
  selectedDays: number[]
  setSelectedDays: (days: number[]) => void
}

export default function DayPicker({ selectedDays, setSelectedDays }: DayPickerProps) {
  const toggle = (day: number) => {
    setSelectedDays(
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day],
    )
  }

  return (
    <div className="flex gap-2">
      {LETTERS.map((letter, idx) => {
        const active = selectedDays.includes(idx)
        return (
          <button
            key={letter}
            type="button"
            onClick={() => toggle(idx)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
              active
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}
