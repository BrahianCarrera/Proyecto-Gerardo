export type Role = 'ESPECIALISTA' | 'PACIENTE' | 'CUIDADOR'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  birthDate?: string
  gender?: 'MASCULINO' | 'FEMENINO'
  weight?: number
  height?: number
  picture?: string
  enterpriseCode?: string
  createdAt: string
}

export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

export interface Meal {
  id: string
  name: string
  type: string // DESAYUNO | ALMUERZO | CENA | MERIENDA | MEDIATARDE
  size: string // PEQUENA | MEDIANA | GRANDE
  calories: number
  protein: number
  carbs: number
  sugar: number
  fat: number
  fiber: number
  sodium: number
  foodGroup: string
  tags?: string[]
  ingredients: Ingredient[]
}

export interface Diet {
  id: string
  name: string
  description: string
  observations: string
  notes?: string
  tags: string[]
  mealIds: string[]
}

export interface Patient {
  id: string // cédula
  name: string
  gender: string
  age: number
  weight: number
  height: number
  medicalHistory: string
  eatingHabits: string
  caregiverId: string | null
  dietId: string | null
  userId: string | null // link to a login account (PACIENTE user)
  createdAt: string
}

export interface Alarm {
  id: string
  patientId: string
  name: string
  type: string // SUPLEMENTO | MEDICAMENTO
  time: string // HH:MM
  daysOfWeek: number[] // 0=Sunday .. 6=Saturday
  notes?: string
}

export interface MealLog {
  id: string
  patientId: string
  mealId: string
  date: string // YYYY-MM-DD
  createdAt: string
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export interface CaregiverRequest {
  id: string
  caregiverId: string
  caregiverName: string
  patientId: string
  patientName?: string
  status: RequestStatus
  createdAt: string
}

export interface DB {
  users: User[]
  patients: Patient[]
  meals: Meal[]
  diets: Diet[]
  alarms: Alarm[]
  mealLogs: MealLog[]
  requests: CaregiverRequest[]
}

export interface SessionUser {
  id: string
  role: Role
  name: string
  email: string
  picture?: string
}
