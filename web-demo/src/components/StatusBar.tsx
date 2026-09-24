/** iOS-style status bar rendered at the top of the phone screen. */
export default function StatusBar({
  variant = 'on-light',
}: {
  variant?: 'on-light' | 'on-dark'
}) {
  const now = new Date()
  const time = now.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const onDark = variant === 'on-dark'
  return (
    <div
      className={`flex h-11 shrink-0 items-center justify-between px-6 pt-1 text-[13px] font-semibold ${
        onDark
          ? 'bg-primary text-white'
          : 'bg-white text-gray-900'
      }`}
    >
      <span className="tabular-nums">{time}</span>
      <div className={`flex items-center gap-1.5 ${onDark ? 'text-white' : 'text-gray-900'}`}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 6c-1.8 0-3.4.7-4.6 1.9l1.4 1.4A4.5 4.5 0 018 8c1.2 0 2.3.5 3.2 1.3l1.4-1.4A6.5 6.5 0 008 6zm0-3.5c-2.8 0-5.3 1.1-7.1 3l1.4 1.4A8 8 0 018 4.5c2.2 0 4.2.9 5.7 2.4l1.4-1.4A10 10 0 008 2.5z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="11"
            rx="3"
            stroke="currentColor"
            opacity="0.4"
          />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor" />
          <path d="M23 4v4a2 2 0 000-4z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}
