interface PatientCardProps {
  name: string
  subtext: string
  detail: string
  onPress?: () => void
}

export default function PatientCard({
  name,
  subtext,
  detail,
  onPress,
}: PatientCardProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="mb-2 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white p-4 text-left transition active:scale-[0.99]"
    >
      <div className="mr-2 min-w-0 flex-1">
        <p className="mb-1 truncate text-base font-medium text-gray-900">
          {name}
        </p>
        <p className="line-clamp-2 text-sm text-gray-600">{subtext}</p>
      </div>
      <div className="shrink-0 pl-2">
        <span className="text-sm text-gray-700">{detail}</span>
      </div>
    </button>
  )
}
