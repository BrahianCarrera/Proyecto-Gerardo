import type { ReactNode } from 'react'

export interface SettingItemProps {
  icon: ReactNode
  title: string
  subtitle?: string
  onClick?: () => void
}

export function SettingsList({ items }: { items: SettingItemProps[] }) {
  return (
    <div className="w-full max-w-md self-center rounded-2xl bg-white p-4 shadow-sm">
      {items.map((item, index) => (
        <div key={index}>
          <button
            type="button"
            onClick={item.onClick}
            className="flex w-full items-center justify-between gap-4 rounded-xl px-2 py-4 text-left"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-black">{item.title}</p>
                {item.subtitle && (
                  <p className="break-words text-xl text-gray-500">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          </button>
          {index < items.length - 1 && (
            <hr className="border-gray-200" />
          )}
        </div>
      ))}
    </div>
  )
}
