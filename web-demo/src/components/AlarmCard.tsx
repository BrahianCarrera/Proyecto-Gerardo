const DAYS_MAP = [
  { id: 1, short: 'L' },
  { id: 2, short: 'M' },
  { id: 3, short: 'X' },
  { id: 4, short: 'J' },
  { id: 5, short: 'V' },
  { id: 6, short: 'S' },
  { id: 0, short: 'D' },
]

interface AlarmCardProps {
  name: string
  subtext?: string
  detail: string
  hour?: string
  days?: number[]
  onPress?: () => void
}

export default function AlarmCard({
  name,
  subtext,
  detail,
  hour,
  days = [],
  onPress,
}: AlarmCardProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="mb-2 flex w-full items-stretch justify-between rounded-md border border-l-4 border-gray-300 border-l-blue-500 bg-white px-4 py-4 text-left shadow-md transition active:opacity-80"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center pr-3">
        <p className="mb-1 truncate text-base font-semibold text-gray-900">
          {name}
        </p>
        {subtext && (
          <p className="line-clamp-2 text-sm text-gray-600">{subtext}</p>
        )}
        {hour && (
          <span className="mt-2 self-start rounded-full bg-gray-200 px-2 py-0.5 text-sm font-medium text-gray-800">
            {hour}
          </span>
        )}
      </div>

      <div className="flex flex-col items-end justify-center pl-2">
        {detail && (
          <span className="max-w-[130px] truncate text-right text-sm text-gray-700">
            {detail}
          </span>
        )}
        {days.length > 0 && (
          <div className="mt-3 flex justify-end gap-0.5">
            {DAYS_MAP.map((day) => {
              const isActive = days.includes(day.id)
              return (
                <span
                  key={day.id}
                  className="relative flex h-6 w-6 items-center justify-center"
                >
                  {isActive && (
                    <span className="absolute -top-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                  <span
                    className={`text-xs font-bold ${
                      isActive ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {day.short}
                  </span>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </button>
  )
}
