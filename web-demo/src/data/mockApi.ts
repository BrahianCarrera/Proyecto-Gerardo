import type {
  Alarm,
  CaregiverRequest,
  DB,
  Diet,
  Meal,
  MealLog,
  Patient,
  Role,
  SessionUser,
  User,
} from '../types'
import { createSeedDB } from './seed'

const DB_KEY = 'gerardo_demo_db_v1'
const SESSION_KEY = 'gerardo_demo_session_v1'

const LATENCY = 280 // ms — simulates network

function delay(ms = LATENCY) {
  return new Promise((r) => setTimeout(r, ms))
}

function loadDB(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw) as DB
  } catch {
    /* ignore corrupt storage */
  }
  const seed = createSeedDB()
  saveDB(seed)
  return seed
}

function saveDB(db: DB) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch {
    /* storage full / unavailable — keep in-memory */
  }
}

let db: DB = loadDB()

export function resetDB() {
  db = createSeedDB()
  saveDB(db)
}

function uid(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

/* ------------------------------------------------------------------ */
/* Session / Auth                                                      */
/* ------------------------------------------------------------------ */

function fakeJWT(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      role: user.role,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  )
  return `${header}.${payload}.mock-signature`
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

function setSession(s: SessionUser | null) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  else localStorage.removeItem(SESSION_KEY)
}

export async function login(
  email: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  await delay()
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  )
  if (!user || user.password !== password) {
    throw new ApiError('Verifica tus credenciales', 401)
  }
  const session: SessionUser = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    picture: user.picture,
  }
  setSession(session)
  return { accessToken: fakeJWT(user), refreshToken: 'mock-refresh-token' }
}

export async function logout(): Promise<void> {
  await delay(80)
  setSession(null)
}

/** Programmatic demo login used by the portfolio "quick access" buttons. */
export async function demoLogin(role: Role): Promise<SessionUser> {
  const user = db.users.find((u) => u.role === role)
  if (!user) throw new ApiError('Usuario demo no encontrado', 404)
  await login(user.email, user.password)
  return getSession()!
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

export async function registerUser(payload: Partial<User>): Promise<User> {
  await delay()
  if (!payload.id) throw new ApiError('La cédula es obligatoria')
  if (db.users.some((u) => u.id === payload.id))
    throw new ApiError('Ya existe una cuenta con esta cédula')
  if (
    db.users.some(
      (u) => u.email?.toLowerCase() === payload.email?.toLowerCase(),
    )
  )
    throw new ApiError('Ya existe una cuenta con este correo')

  const user: User = {
    id: payload.id!,
    name: payload.name!,
    email: payload.email!,
    password: payload.password!,
    role: (payload.role as Role) || 'PACIENTE',
    birthDate: payload.birthDate,
    gender: payload.gender,
    weight: payload.weight,
    height: payload.height,
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)

  if (user.role === 'PACIENTE') {
    const birth = user.birthDate ? new Date(user.birthDate) : null
    const age = birth
      ? new Date().getFullYear() - birth.getFullYear()
      : 0
    db.patients.push({
      id: user.id,
      name: user.name,
      gender: user.gender || '',
      age,
      weight: user.weight || 0,
      height: user.height || 0,
      medicalHistory: 'Sin antecedentes registrados.',
      eatingHabits: 'Sin hábitos registrados.',
      caregiverId: null,
      dietId: null,
      userId: user.id,
      createdAt: user.createdAt,
    })
  }
  saveDB(db)
  return user
}

export async function registerSpecialist(payload: {
  id: string
  name: string
  email: string
  password: string
  enterpriseCode: string
  birthDate?: string
}): Promise<{ email: string }> {
  await delay(500)
  if (payload.enterpriseCode !== 'GERARDO2024')
    throw new ApiError('Código de especialista inválido')
  if (db.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase()))
    throw new ApiError('Ya existe una cuenta con este correo')

  const user: User = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: 'ESPECIALISTA',
    birthDate: payload.birthDate,
    enterpriseCode: payload.enterpriseCode,
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  saveDB(db)
  return { email: payload.email }
}

export async function verifySpecialist(email: string, otp: string) {
  await delay(400)
  if (otp !== '123456')
    throw new ApiError('Código de verificación incorrecto')
  return { ok: true, email }
}

export async function resendOtp(_email: string): Promise<void> {
  await delay(300)
}

export async function getUserInfo(id: string): Promise<User | null> {
  await delay(200)
  return db.users.find((u) => u.id === id) ?? null
}

/* ------------------------------------------------------------------ */
/* Patients                                                            */
/* ------------------------------------------------------------------ */

export async function getPatients(): Promise<Patient[]> {
  await delay()
  return [...db.patients]
}

export async function getPatientById(id: string): Promise<Patient | null> {
  await delay(200)
  return db.patients.find((p) => p.id === id) ?? null
}

export async function getCaregiverPatients(
  caregiverId: string,
): Promise<Patient[]> {
  await delay()
  return db.patients.filter((p) => p.caregiverId === caregiverId)
}

export async function updatePatient(payload: {
  patientId: string
  name?: string
  age?: number
  medicalHistory?: string
  eatingHabits?: string
}): Promise<Patient> {
  await delay()
  const p = db.patients.find((x) => x.id === payload.patientId)
  if (!p) throw new ApiError('Paciente no encontrado', 404)
  if (payload.name !== undefined) p.name = payload.name
  if (payload.age !== undefined) p.age = payload.age
  if (payload.medicalHistory !== undefined)
    p.medicalHistory = payload.medicalHistory
  if (payload.eatingHabits !== undefined) p.eatingHabits = payload.eatingHabits
  saveDB(db)
  return p
}

export async function assignDietToPatient(
  patientId: string,
  dietId: string | null,
): Promise<Patient> {
  await delay()
  const p = db.patients.find((x) => x.id === patientId)
  if (!p) throw new ApiError('Paciente no encontrado', 404)
  p.dietId = dietId
  saveDB(db)
  return p
}

/* ------------------------------------------------------------------ */
/* Meals                                                               */
/* ------------------------------------------------------------------ */

export async function getMeals(): Promise<Meal[]> {
  await delay()
  return [...db.meals]
}

export async function addMeal(payload: Meal): Promise<Meal> {
  await delay(400)
  const meal: Meal = { ...payload, id: uid('m') }
  db.meals.push(meal)
  saveDB(db)
  return meal
}

export async function logMeal(payload: {
  patientId: string
  mealId: string
}): Promise<MealLog> {
  await delay(220)
  const today = todayISO()
  const existing = db.mealLogs.find(
    (l) =>
      l.patientId === payload.patientId &&
      l.mealId === payload.mealId &&
      l.date === today,
  )
  if (existing) {
    db.mealLogs = db.mealLogs.filter((l) => l.id !== existing.id)
    saveDB(db)
    return existing // toggle off
  }
  const log: MealLog = {
    id: uid('log'),
    patientId: payload.patientId,
    mealId: payload.mealId,
    date: today,
    createdAt: new Date().toISOString(),
  }
  db.mealLogs.push(log)
  saveDB(db)
  return log
}

export async function getMealLogsByPatient(
  patientId: string,
): Promise<MealLog[]> {
  await delay(180)
  return db.mealLogs.filter((l) => l.patientId === patientId)
}

/** true if the meal is already logged as consumed today */
export async function isMealConsumedToday(
  patientId: string,
  mealId: string,
): Promise<boolean> {
  await delay(60)
  return db.mealLogs.some(
    (l) =>
      l.patientId === patientId &&
      l.mealId === mealId &&
      l.date === todayISO(),
  )
}

/* ------------------------------------------------------------------ */
/* Diets                                                               */
/* ------------------------------------------------------------------ */

export async function getDiets(): Promise<Diet[]> {
  await delay()
  return [...db.diets]
}

export async function getDietById(id: string): Promise<Diet | null> {
  await delay(200)
  const diet = db.diets.find((d) => d.id === id)
  if (!diet) return null
  return { ...diet }
}

export async function getDietsByPatientId(patientId: string): Promise<Diet[]> {
  await delay(300)
  const patient = db.patients.find((p) => p.id === patientId)
  if (!patient?.dietId) return []
  const diet = db.diets.find((d) => d.id === patient.dietId)
  return diet ? [diet] : []
}

export async function getDietWithMeals(dietId: string) {
  const diet = await getDietById(dietId)
  if (!diet) return null
  const meals = db.meals.filter((m) => diet.mealIds.includes(m.id))
  return { ...diet, meals }
}

export async function createDiet(payload: {
  name: string
  description: string
  notes: string
}): Promise<Diet> {
  await delay(400)
  const diet: Diet = {
    id: uid('d'),
    name: payload.name,
    description: payload.description,
    observations: payload.notes,
    notes: payload.notes,
    tags: [],
    mealIds: [],
  }
  db.diets.push(diet)
  saveDB(db)
  return diet
}

export async function updateDiet(payload: {
  dietId: string
  name?: string
  description?: string
  observations?: string
  tags?: string[]
  mealIds?: string[]
}): Promise<Diet> {
  await delay(350)
  const d = db.diets.find((x) => x.id === payload.dietId)
  if (!d) throw new ApiError('Dieta no encontrada', 404)
  Object.assign(d, {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.description !== undefined && {
      description: payload.description,
    }),
    ...(payload.observations !== undefined && {
      observations: payload.observations,
    }),
    ...(payload.tags !== undefined && { tags: payload.tags }),
    ...(payload.mealIds !== undefined && { mealIds: payload.mealIds }),
  })
  saveDB(db)
  return d
}

export async function assignMealsToDiet(
  dietId: string,
  mealIds: string[],
): Promise<Diet> {
  return updateDiet({ dietId, mealIds })
}

export async function deleteDiet(dietId: string): Promise<void> {
  await delay(300)
  db.diets = db.diets.filter((d) => d.id !== dietId)
  db.patients.forEach((p) => {
    if (p.dietId === dietId) p.dietId = null
  })
  saveDB(db)
}

/* ------------------------------------------------------------------ */
/* Alarms                                                              */
/* ------------------------------------------------------------------ */

export async function searchAlarms(term: string): Promise<(Alarm & { patient: { name: string } })[]> {
  await delay(350)
  const t = term.trim().toLowerCase()
  return db.alarms
    .filter((a) => {
      const patient = db.patients.find((p) => p.id === a.patientId)
      return (
        a.patientId.includes(t) ||
        patient?.name.toLowerCase().includes(t) ||
        false
      )
    })
    .map((a) => {
      const patient = db.patients.find((p) => p.id === a.patientId)
      return { ...a, patient: { name: patient?.name ?? 'Paciente' } }
    })
}

export async function getAlarmById(
  id: string,
): Promise<Alarm | null> {
  await delay(200)
  return db.alarms.find((a) => a.id === id) ?? null
}

/** All alarms for a patient (by cédula), used by the user-facing screens. */
export async function getAlarmsForPatient(patientId: string): Promise<Alarm[]> {
  await delay(320)
  return db.alarms
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => a.time.localeCompare(b.time))
}

export async function createAlarm(payload: Omit<Alarm, 'id'>): Promise<Alarm> {
  await delay(400)
  const patient = db.patients.find((p) => p.id === payload.patientId)
  if (!patient)
    throw new ApiError('No existe un paciente con esa cédula', 404)
  const alarm: Alarm = { ...payload, id: uid('a') }
  db.alarms.push(alarm)
  saveDB(db)
  return alarm
}

export async function updateAlarm(payload: Alarm): Promise<Alarm> {
  await delay(350)
  const idx = db.alarms.findIndex((a) => a.id === payload.id)
  if (idx < 0) throw new ApiError('Alarma no encontrada', 404)
  db.alarms[idx] = payload
  saveDB(db)
  return payload
}

export async function deleteAlarm(id: string): Promise<void> {
  await delay(300)
  db.alarms = db.alarms.filter((a) => a.id !== id)
  saveDB(db)
}

/* ------------------------------------------------------------------ */
/* Caregiver requests                                                  */
/* ------------------------------------------------------------------ */

export async function getCaregiverRequests(
  caregiverId: string,
): Promise<CaregiverRequest[]> {
  await delay()
  return db.requests.filter((r) => r.caregiverId === caregiverId)
}

export async function getPatientRequests(
  patientId: string,
): Promise<CaregiverRequest[]> {
  await delay()
  return db.requests.filter((r) => r.patientId === patientId)
}

export async function sendCaregiverRequest(
  caregiverId: string,
  identifier: string,
): Promise<CaregiverRequest> {
  await delay(450)
  const caregiver = db.users.find((u) => u.id === caregiverId)
  const patient = db.patients.find(
    (p) => p.userId && db.users.find((u) => u.id === p.userId)?.email.toLowerCase() === identifier.trim().toLowerCase(),
  ) || db.patients.find((p) => p.id === identifier.trim())

  if (!patient) throw new ApiError('No se encontró un paciente con ese correo')
  if (patient.caregiverId === caregiverId)
    throw new ApiError('Ya eres el cuidador de este paciente')
  if (
    db.requests.some(
      (r) =>
        r.caregiverId === caregiverId &&
        r.patientId === patient.id &&
        r.status === 'pending',
    )
  )
    throw new ApiError('Ya enviaste una solicitud pendiente a este paciente')

  const req: CaregiverRequest = {
    id: uid('r'),
    caregiverId,
    caregiverName: caregiver?.name ?? 'Cuidador',
    patientId: patient.id,
    patientName: patient.name,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.requests.push(req)
  saveDB(db)
  return req
}

export async function acceptCaregiverRequest(
  requestId: string,
  patientId: string,
): Promise<CaregiverRequest> {
  await delay(350)
  const req = db.requests.find((r) => r.id === requestId)
  if (!req) throw new ApiError('Solicitud no encontrada', 404)
  req.status = 'accepted'
  const patient = db.patients.find((p) => p.id === patientId)
  if (patient) patient.caregiverId = req.caregiverId
  saveDB(db)
  return req
}

export async function cancelCaregiverRequest(
  requestId: string,
): Promise<CaregiverRequest> {
  await delay(300)
  const req = db.requests.find((r) => r.id === requestId)
  if (!req) throw new ApiError('Solicitud no encontrada', 404)
  req.status = 'cancelled'
  saveDB(db)
  return req
}
