import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Role, SessionUser } from '../types'
import * as api from '../data/mockApi'

interface AuthCtx {
  user: SessionUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  demoLogin: (role: Role) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(api.getSession())
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await api.login(email, password)
    setUser(api.getSession())
  }, [])

  const demoLogin = useCallback(async (role: Role) => {
    await api.demoLogin(role)
    setUser(api.getSession())
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(() => {
    setUser(api.getSession())
  }, [])

  return (
    <Ctx.Provider
      value={{ user, loading, login, demoLogin, logout, refreshUser }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
