export default function Spinner({
  text,
  color = '#14798B',
}: {
  text?: string
  color?: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <span
        className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
        style={{ borderTopColor: color }}
      />
      {text && <p className="mt-3 text-base text-gray-700">{text}</p>}
    </div>
  )
}
