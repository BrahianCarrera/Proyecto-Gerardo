// components/SettingsList.tsx
import { ChevronRight } from 'lucide-react-native'
import { FC } from 'react'
import { Divider } from 'react-native-paper'

interface SettingItemProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick?: () => void
}

const SettingItem: FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onClick,
}) => (
  <div
    className="flex items-center justify-between py-4 px-5 hover:bg-gray-50 transition rounded-xl cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </div>
)

export const SettingsList = () => {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 space-y-2 w-full max-w-md mx-auto">
      <SettingItem
        icon={<div className="w-4 h-4 bg-purple-400 rounded-full" />}
        title="email"
        subtitle="@cooper_bessie"
      />
      <Divider />
      <SettingItem
        icon={<div className="w-4 h-4 bg-cyan-400 rounded-full" />}
        title="Notifications"
        subtitle="Mute, Push, Email"
      />
      <Divider />
      <SettingItem
        icon={<div className="w-4 h-4 bg-green-400 rounded-full" />}
        title="Settings"
        subtitle="Security, Privacy"
      />
    </div>
  )
}
