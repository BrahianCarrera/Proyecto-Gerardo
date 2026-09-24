import { MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import PortfolioShell from './components/PortfolioShell'
import PhoneFrame from './components/PhoneFrame'
import StatusBar from './components/StatusBar'
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import StackLayout from './layouts/StackLayout'
import { RedirectIfAuthed, RequireAuth, ScrollToTop } from './routes/guards'
import type { Role } from './types'

import Login from './screens/landing/Login'
import Register from './screens/landing/Register'
import RegisterSpecialist from './screens/landing/RegisterSpecialist'
import Verification from './screens/landing/Verification'
import About from './screens/landing/About'

import Patients from './screens/admin/Patients'
import PatientDetail from './screens/admin/PatientDetail'
import AdminFoodTracking from './screens/admin/FoodTracking'
import AddMeal from './screens/admin/AddMeal'
import Diets from './screens/admin/Diets'
import AddDiet from './screens/admin/AddDiet'
import DietDetail from './screens/admin/DietDetail'
import AssociateMeals from './screens/admin/AssociateMeals'
import Alarms from './screens/admin/Alarms'
import AddAlarm from './screens/admin/AddAlarm'
import EditAlarm from './screens/admin/EditAlarm'
import AdminProfile from './screens/shared/Profile'

import UserFoodTracking from './screens/user/UserFoodTracking'
import UserMeds from './screens/user/UserMeds'
import UserAlarms from './screens/user/UserAlarms'
import UserProfile from './screens/shared/Profile'
import CaregiverRequest from './screens/user/CaregiverRequest'
import PatientRequests from './screens/user/PatientRequests'

/** Screens with a teal background (landing + stack headers) get a light status bar. */
const DARK_STATUS_PATHS = [
  '/login',
  '/register',
  '/register-specialist',
  '/verify',
  '/about',
]

function isStackPath(path: string) {
  return (
    /^\/admin\/patients\/[^/]+$/.test(path) ||
    /^\/admin\/comidas\/nueva$/.test(path) ||
    /^\/admin\/dietas\//.test(path) ||
    /^\/admin\/alarmas\//.test(path) ||
    /^\/user\/(vincular|solicitudes)$/.test(path)
  )
}

function DemoApp() {
  const location = useLocation()
  const onDark =
    DARK_STATUS_PATHS.includes(location.pathname) ||
    isStackPath(location.pathname)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StatusBar variant={onDark ? 'on-dark' : 'on-light'} />
      <ScrollToTop />
      <div className="flex min-h-0 flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <Login />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthed>
                <Register />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/register-specialist"
            element={
              <RedirectIfAuthed>
                <RegisterSpecialist />
              </RedirectIfAuthed>
            }
          />
          <Route path="/verify" element={<Verification />} />
          <Route path="/about" element={<About />} />

          {/* Specialist (admin) */}
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/admin/patients" replace />} />
            <Route path="patients" element={<Patients />} />
            <Route path="comidas" element={<AdminFoodTracking />} />
            <Route path="dietas" element={<Diets />} />
            <Route path="alarmas" element={<Alarms />} />
            <Route path="perfil" element={<AdminProfile />} />
          </Route>

          <Route
            path="/"
            element={
              <RequireAuth>
                <StackLayout />
              </RequireAuth>
            }
          >
            <Route path="admin/patients/:id" element={<PatientDetail />} />
            <Route path="admin/comidas/nueva" element={<AddMeal />} />
            <Route path="admin/dietas/nueva" element={<AddDiet />} />
            <Route path="admin/dietas/:id" element={<DietDetail />} />
            <Route path="admin/dietas/:id/comidas" element={<AssociateMeals />} />
            <Route path="admin/alarmas/nueva" element={<AddAlarm />} />
            <Route path="admin/alarmas/:id" element={<EditAlarm />} />
            <Route path="user/vincular" element={<CaregiverRequest />} />
            <Route path="user/solicitudes" element={<PatientRequests />} />
          </Route>

          {/* Patient / Caregiver */}
          <Route
            path="/user"
            element={
              <RequireAuth>
                <UserLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/user/comidas" replace />} />
            <Route path="comidas" element={<UserFoodTracking />} />
            <Route path="medicamentos" element={<UserMeds />} />
            <Route path="alarmas" element={<UserAlarms />} />
            <Route path="perfil" element={<UserProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function Shell() {
  const { demoLogin } = useAuth()
  const [busyRole, setBusyRole] = useState<Role | null>(null)

  const handleDemoLogin = async (role: Role) => {
    if (busyRole) return
    setBusyRole(role)
    try {
      await demoLogin(role)
    } finally {
      setBusyRole(null)
    }
  }

  return (
    <PortfolioShell onDemoLogin={handleDemoLogin} busyRole={busyRole}>
      <PhoneFrame>
        <ToastProvider>
          <MemoryRouter initialEntries={['/login']}>
            <DemoApp />
          </MemoryRouter>
        </ToastProvider>
      </PhoneFrame>
    </PortfolioShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
