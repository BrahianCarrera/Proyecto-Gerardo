import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export function homeFor(role: string) {
  return role === 'ESPECIALISTA' ? '/admin/patients' : '/user/perfil'
}

/** Gate that redirects based on session, reproducing the original login routing rule. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner text="Cargando sesión..." />
  if (!user) return <Navigate to="/login" replace />

  const onAdmin = location.pathname.startsWith('/admin')
  const onUser = location.pathname.startsWith('/user')

  if (user.role === 'ESPECIALISTA' && onUser)
    return <Navigate to={homeFor(user.role)} replace />
  if (user.role !== 'ESPECIALISTA' && onAdmin)
    return <Navigate to={homeFor(user.role)} replace />

  return <>{children}</>
}

/** If a session already exists, jump to the role home (used by login/landing). */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner text="Cargando sesión..." />
  if (user) return <Navigate to={homeFor(user.role)} replace />
  return <>{children}</>
}

/** Scrolls the phone content to the top whenever the route changes. */
export function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    document
      .querySelectorAll('.phone-scroll')
      .forEach((el) => (el.scrollTop = 0))
  }, [location.pathname])
  return null
}
