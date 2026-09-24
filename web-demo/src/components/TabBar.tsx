import { NavLink, useLocation } from 'react-router-dom'
import {
  Users,
  UtensilsCrossed,
  CookingPot,
  AlarmClock,
  CircleUserRound,
  Pill,
  type LucideIcon,
} from 'lucide-react'

interface Tab {
  to: string
  label: string
  icon: LucideIcon
}

const ADMIN_TABS: Tab[] = [
  { to: '/admin/patients', label: 'Pacientes', icon: Users },
  { to: '/admin/comidas', label: 'Comidas', icon: UtensilsCrossed },
  { to: '/admin/dietas', label: 'Dietas', icon: CookingPot },
  { to: '/admin/alarmas', label: 'Alarmas', icon: AlarmClock },
  { to: '/admin/perfil', label: 'Perfil', icon: CircleUserRound },
]

const USER_TABS: Tab[] = [
  { to: '/user/comidas', label: 'Comidas', icon: UtensilsCrossed },
  { to: '/user/medicamentos', label: 'Medicamentos', icon: Pill },
  { to: '/user/alarmas', label: 'Alarmas', icon: AlarmClock },
  { to: '/user/perfil', label: 'Perfil', icon: CircleUserRound },
]

export default function TabBar({ variant }: { variant: 'admin' | 'user' }) {
  const tabs = variant === 'admin' ? ADMIN_TABS : USER_TABS
  const location = useLocation()
  return (
    <nav className="flex h-[64px] shrink-0 items-stretch border-t border-gray-200 bg-white pb-4 pt-1">
      {tabs.map((tab) => {
        const active = location.pathname.startsWith(tab.to)
        const Icon = tab.icon
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              active ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 2} />
            <span>{tab.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
