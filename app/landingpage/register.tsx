import React, { useState } from 'react'

import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  useColorScheme, // <-- ¡Añade esto!
} from 'react-native'

import { Eye, EyeOff } from 'lucide-react-native'

import DateTimePicker from '@react-native-community/datetimepicker'

import { Picker } from '@react-native-picker/picker'

import { registerUser } from 'services/userService'

import Logo from '../../assets/logo.svg'

import Toast from 'react-native-toast-message'

import DateInput from 'components/Datepicker'

import SafeAreaContainer from 'components/safeAreaContainer'

import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { router } from 'expo-router'

import KeyboardAvoidingContainer from 'components/KeyboardAvoidingContainer'

// Types

interface FormData {
  id: string

  firstName: string

  lastName: string

  email: string

  password: string

  confirmPassword: string

  date: Date

  gender: string

  weightInt: number

  weightDec: number

  heightInt: number

  heightDec: number

  role: string
}

interface FormErrors {
  [key: string]: string
}

// Constants

const INITIAL_FORM_STATE: FormData = {
  id: '',

  firstName: '',

  lastName: '',

  email: '',

  password: '',

  confirmPassword: '',

  date: new Date(),

  gender: '',

  weightInt: 70,

  weightDec: 0,

  heightInt: 170,

  heightDec: 0,

  role: '',
}

const GENDER_OPTIONS = [
  { label: 'Masculino', value: 'MASCULINO' },

  { label: 'Femenino', value: 'FEMENINO' },
]

const ROLE_OPTIONS = [
  { label: 'Paciente', value: 'PACIENTE' },

  { label: 'Cuidador', value: 'CUIDADOR' },
]

// Utility functions

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const formatWeight = (intPart: number, decPart: number): number => {
  return parseFloat(`${intPart}.${decPart}`)
}

const formatHeight = (intPart: number, decPart: number): number => {
  return parseFloat(`${intPart}.${decPart}`)
}

// Custom hooks

const useFormValidation = () => {
  const validateForm = (form: FormData): FormErrors => {
    const errors: FormErrors = {}

    if (!form.id.trim()) {
      errors.id = 'La cédula es obligatoria'
    }

    if (!form.firstName.trim()) {
      errors.name = 'El nombre es obligatorio.'
    }

    if (!form.lastName.trim()) {
      errors.name = 'El apellido es obligatorio.'
    }

    if (!form.email.trim()) {
      errors.email = 'El correo es obligatorio.'
    } else if (!validateEmail(form.email)) {
      errors.email = 'El correo no es válido.'
    }

    if (!form.password) {
      errors.password = 'La contraseña es obligatoria.'
    } else if (form.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar tu contraseña.'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    if (!form.gender) {
      errors.gender = 'Selecciona un género.'
    }

    if (!form.role) {
      errors.role = 'Selecciona un rol.'
    }

    return errors
  }

  return { validateForm }
}

const useFormData = () => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM_STATE)

  const updateForm = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE)
  }

  const createPayload = () => ({
    id: form.id,

    name: form.firstName + ' ' + form.lastName,

    email: form.email,

    password: form.password,

    role: form.role,

    birthDate: formatDate(form.date),

    gender: form.gender,

    weight: formatWeight(form.weightInt, form.weightDec),

    height: formatHeight(form.heightInt, form.heightDec),
  })

  return { form, updateForm, resetForm, createPayload }
}

// Components

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,

  children,
}) => (
  <View className="gap-y-2">
    <Text className="text-sm font-medium text-gray-700">{label}</Text>

    {children}
  </View>
)

const ErrorText: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null

  return <Text className="text-red-500 text-sm">{error}</Text>
}

const PasswordInput: React.FC<{
  value: string

  onChangeText: (text: string) => void

  show: boolean

  toggle: () => void

  placeholder?: string
}> = ({
  value,

  onChangeText,

  show,

  toggle,

  placeholder = 'Ingresa tu contraseña',
}) => (
  <View className="relative">
    <TextInput
      className=" px-4 pr-12 border border-gray-300 rounded-md text-base"
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={!show}
      value={value}
      onChangeText={onChangeText}
      scrollEnabled={false}
    />

    <Pressable
      onPress={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2"
    >
      {show ? <EyeOff size={20} /> : <Eye size={20} />}
    </Pressable>
  </View>
)

const GenderPicker: React.FC<{
  value: string

  onValueChange: (value: string) => void

  textColor: string // <-- Nuevo prop
}> = (
  { value, onValueChange, textColor }, // <-- Recibe el prop
) => (
  <View className="border rounded-xl border-gray-300">
    <Picker
      selectedValue={value}
      onValueChange={onValueChange}
      // Estilo para el Picker en general, afectando el texto del valor seleccionado cuando está cerrado

      style={{ color: textColor }} // <-- Aplica el color aquí
      // El className "bg-white" puede causar problemas en modo oscuro, considera hacerlo dinámico

      className=" px-4 border border-gray-300 rounded-md text-base bg-white"
    >
      <Picker.Item
        label="Selecciona un género..."
        value=""
        enabled={false}
        // Aplica el color a los ítems. Importante para iOS, Android lo hereda del tema nativo.

        style={{ color: textColor }} // <-- Aplica el color aquí (puede ser redundante para Android en el modal, pero bueno para iOS)
      />

      {GENDER_OPTIONS.map((option) => (
        <Picker.Item
          key={option.value}
          label={option.label}
          value={option.value}
          // Aplica el color a los ítems individuales

          style={{ color: textColor }} // <-- Aplica el color aquí
        />
      ))}
    </Picker>
  </View>
)

const RolePicker: React.FC<{
  value: string

  onValueChange: (value: string) => void

  textColor: string // <-- Nuevo prop
}> = (
  { value, onValueChange, textColor }, // <-- Recibe el prop
) => (
  <View className="border rounded-xl border-gray-300">
    <Picker
      selectedValue={value}
      onValueChange={onValueChange}
      // Estilo para el Picker en general

      style={{ color: textColor }} // <-- Aplica el color aquí
    >
      <Picker.Item
        label="Selecciona un rol"
        value=""
        enabled={false}
        // Aplica el color a los ítems

        style={{ color: textColor }} // <-- Aplica el color aquí
      />

      {ROLE_OPTIONS.map((option) => (
        <Picker.Item
          key={option.value}
          label={option.label}
          value={option.value}
          // Aplica el color a los ítems individuales

          style={{ color: textColor }} // <-- Aplica el color aquí
        />
      ))}
    </Picker>
  </View>
)

const WeightPicker: React.FC<{
  weightInt: number

  weightDec: number

  onWeightIntChange: (value: number) => void

  onWeightDecChange: (value: number) => void

  textColor: string // <-- Nuevo prop
}> = (
  { weightInt, weightDec, onWeightIntChange, onWeightDecChange, textColor }, // <-- Recibe el prop
) => (
  <View className="flex-row space-x-2 border rounded-xl border-gray-300">
    <Picker
      selectedValue={weightInt}
      onValueChange={onWeightIntChange}
      style={{ width: '65%', color: textColor }} // <-- Aplica el color aquí
      className=" bg-white px-4 pr-12 border border-gray-300 rounded-md text-base"
    >
      {Array.from({ length: 90 }, (_, i) => (
        <Picker.Item
          key={i}
          label={`${i + 40}`}
          value={i + 40}
          style={{ color: textColor }} // <-- Aplica el color aquí
        />
      ))}
    </Picker>

    <Picker
      selectedValue={weightDec}
      onValueChange={onWeightDecChange}
      style={{ width: '35%', color: textColor }} // <-- Aplica el color aquí
      className=" bg-white border border-gray-300 rounded-md text-base"
    >
      {Array.from({ length: 10 }, (_, i) => (
        <Picker.Item
          key={i}
          label={`.${i}`}
          value={i}
          style={{ color: textColor }}
        /> // <-- Aplica el color aquí
      ))}
    </Picker>
  </View>
)

const HeightPicker: React.FC<{
  heightInt: number

  heightDec: number

  onHeightIntChange: (value: number) => void

  onHeightDecChange: (value: number) => void

  textColor: string // <-- Nuevo prop
}> = (
  { heightInt, heightDec, onHeightIntChange, onHeightDecChange, textColor }, // <-- Recibe el prop
) => (
  <View className="flex-row border rounded-xl border-gray-300">
    <Picker
      selectedValue={heightInt}
      onValueChange={onHeightIntChange}
      style={{ width: '65%', color: textColor }}
    >
      {Array.from({ length: 140 }, (_, i) => (
        <Picker.Item
          key={i}
          label={`${i + 70}`}
          value={i + 70}
          style={{ color: textColor }}
        />
      ))}
    </Picker>

    <Picker
      selectedValue={heightDec}
      onValueChange={onHeightDecChange}
      style={{ width: '35%', color: textColor }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <Picker.Item
          key={i}
          label={`.${i}`}
          value={i}
          style={{ color: textColor }}
        />
      ))}
    </Picker>
  </View>
)

const Register = () => {
  const pickerTextColor = 'black'

  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [submitError, setSubmitError] = useState('')

  const [errors, setErrors] = useState<FormErrors>({})

  const { form, updateForm, createPayload, resetForm } = useFormData()

  const { validateForm } = useFormValidation()

  const handleSubmit = async () => {
    setSubmitError('')

    const formErrors = validateForm(form)

    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      try {
        const payload = createPayload()

        await registerUser(payload)

        resetForm()

        router.push('./login')

        Toast.show({
          type: 'success',

          text1: 'Registro exitoso',

          text2: 'El usuario ha sido creado correctamente',

          position: 'bottom',
        })
      } catch (error: any) {
        console.error('Error al registrar usuario:', error)

        Toast.show({
          type: 'error',

          text1: 'Error al registrar',

          text2: 'Inténtalo de nuevo más tarde',

          position: 'bottom',
        })
      }
    } else {
      Toast.show({
        type: 'error',

        text1: 'Formulario inválido',

        text2: 'Revisa los campos marcados',

        position: 'bottom',
      })
    }
  }

  return (
    <KeyboardAvoidingContainer
      containerClassName={{ backgroundColor: '#187c8c' }}
    >
      <View className="items-center gap-y-4">
        <Logo width={120} height={120} />

        <Text className="text-2xl font-bold text-gray-900">Registrate</Text>

        <Text className="text-gray-600">Crea una cuenta para continuar</Text>
      </View>

      <View className="mt-4 gap-y-6 ">
        <Field label="Identificación">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tu cédula"
            placeholderTextColor="#9CA3AF"
            value={form.id}
            scrollEnabled={false}
            keyboardType="numeric"
            onChangeText={(val) => updateForm('id', val)}
          />

          <ErrorText error={errors.id} />
        </Field>

        <Field label="Nombres">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#9CA3AF"
            value={form.firstName}
            scrollEnabled={false}
            onChangeText={(val) => updateForm('firstName', val)}
          />

          <ErrorText error={errors.name} />
        </Field>

        <Field label="Apellidos">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#9CA3AF"
            value={form.lastName}
            scrollEnabled={false}
            onChangeText={(val) => updateForm('lastName', val)}
          />

          <ErrorText error={errors.name} />
        </Field>

        <Field label="Correo">
          <TextInput
            className=" px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tu Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            scrollEnabled={false}
            value={form.email}
            onChangeText={(val) => updateForm('email', val)}
          />

          <ErrorText error={errors.email} />
        </Field>

        <Field label="Contraseña">
          <PasswordInput
            value={form.password}
            onChangeText={(val) => updateForm('password', val)}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />

          <ErrorText error={errors.password} />
        </Field>

        <Field label="Confirmar Contraseña">
          <PasswordInput
            value={form.confirmPassword}
            onChangeText={(val) => updateForm('confirmPassword', val)}
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="Confirma tu contraseña"
          />

          <ErrorText error={errors.confirmPassword} />
        </Field>

        <Field label="Fecha de nacimiento">
          <DateInput
            date={form.date}
            onChange={(date) => updateForm('date', date)}
          />

          <ErrorText error={errors.date} />
        </Field>

        <Field label="Género">
          <GenderPicker
            value={form.gender}
            onValueChange={(val) => updateForm('gender', val)}
            textColor={pickerTextColor}
          />

          <ErrorText error={errors.gender} />
        </Field>

        <Field label="Peso">
          <WeightPicker
            weightInt={form.weightInt}
            weightDec={form.weightDec}
            onWeightIntChange={(val) => updateForm('weightInt', val)}
            onWeightDecChange={(val) => updateForm('weightDec', val)}
            textColor={pickerTextColor}
          />
        </Field>

        <Field label="Estatura">
          <HeightPicker
            heightInt={form.heightInt}
            heightDec={form.heightDec}
            onHeightIntChange={(val) => updateForm('heightInt', val)}
            onHeightDecChange={(val) => updateForm('heightDec', val)}
            textColor={pickerTextColor}
          />
        </Field>

        <Field label="Rol">
          <RolePicker
            value={form.role}
            onValueChange={(val) => updateForm('role', val)}
            textColor={pickerTextColor}
          />

          <ErrorText error={errors.role} />
        </Field>

        <Pressable
          onPress={handleSubmit}
          className="bg-primary rounded-md h-12 mb-10 justify-center items-center"
        >
          <Text className="text-base font-medium text-white">Crear cuenta</Text>
        </Pressable>

        <ErrorText error={submitError} />
      </View>
    </KeyboardAvoidingContainer>
  )
}

export default Register
