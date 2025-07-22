// RegisterSpecialist.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Eye, EyeOff } from 'lucide-react-native'
import { api } from 'services/api'
import Logo from '../../assets/logo.svg'
import Toast from 'react-native-toast-message'
import DateInput from 'components/Datepicker'
import { router } from 'expo-router'
import KeyboardAvoidingContainer from 'components/KeyboardAvoidingContainer'
import { registerSpecialist } from 'services/userService'

interface FormData {
  id: string
  name: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  date: Date
  enterpriseCode: string
}

interface FormErrors {
  [key: string]: string
}

// Constants
const INITIAL_FORM_STATE: FormData = {
  id: '',
  name: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  date: new Date(),
  enterpriseCode: '',
}

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const useFormValidation = () => {
  const validateForm = (form: FormData): FormErrors => {
    const errors: FormErrors = {}

    if (!form.id.trim()) {
      errors.id = 'La cédula es obligatoria'
    }

    if (!form.name.trim()) {
      errors.name = 'El nombre es obligatorio.'
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

    if (!form.enterpriseCode) {
      errors.code = 'Debes ingresar un codigo de especialista'
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
    name: form.name + ' ' + form.lastName,
    email: form.email,
    password: form.password,
    enterpriseCode: form.enterpriseCode,
    birthDate: form.date,
  })

  return { form, updateForm, resetForm, createPayload }
}

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

const RegisterSpecialist = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const { form, updateForm, createPayload, resetForm } = useFormData()
  const { validateForm } = useFormValidation()

  const handleSubmit = async () => {
    setSubmitError('')
    const formErrors = validateForm(form)
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      setLoading(true)
      try {
        const payload = createPayload()

        await api.post('/users/register/specialist', payload)
        console.log(payload)
        resetForm()

        router.push({
          pathname: './verificationScreen',
          params: { email: form.email },
        })

        Toast.show({
          type: 'success',
          text1: 'Registro exitoso',
          text2: 'Se ha enviado un código de verificación a tu correo.',
          position: 'bottom',
        })
      } catch (error: any) {
        console.error('Error al registrar usuario:', error)
        const errorMessage =
          error.data?.message || 'Inténtalo de nuevo más tarde'
        Toast.show({
          type: 'error',
          text1: 'Error al registrar',
          text2: errorMessage,
          position: 'bottom',
        })
      } finally {
        setLoading(false)
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
        <Text className="text-2xl font-bold text-gray-900">Regístrate</Text>
        <Text className="text-gray-600">Crea una cuenta para continuar</Text>
      </View>

      <View className="mt-4 gap-y-6">
        <Field label="Identificación">
          <TextInput
            className="px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tu cédula"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={form.id}
            scrollEnabled={false}
            onChangeText={(val) => updateForm('id', val)}
          />
          <ErrorText error={errors.id} />
        </Field>

        <Field label="Nombre">
          <TextInput
            className="px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#9CA3AF"
            value={form.name}
            scrollEnabled={false}
            onChangeText={(val) => updateForm('name', val)}
          />
          <ErrorText error={errors.name} />
        </Field>

        <Field label="Apellidos">
          <TextInput
            className="px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tus apellidos "
            placeholderTextColor="#9CA3AF"
            value={form.lastName}
            scrollEnabled={false}
            onChangeText={(val) => updateForm('lastName', val)}
          />
          <ErrorText error={errors.name} />
        </Field>

        <Field label="Correo">
          <TextInput
            className="px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa tu Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
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

        <Field label="Código">
          <TextInput
            className="px-4 border border-gray-300 rounded-md text-base"
            placeholder="Ingresa el código para especialistas"
            placeholderTextColor="#9CA3AF"
            value={form.enterpriseCode}
            scrollEnabled={false}
            onChangeText={(val) => updateForm('enterpriseCode', val)}
          />
          <ErrorText error={errors.code} />
        </Field>

        <Pressable
          onPress={handleSubmit}
          className="bg-primary rounded-md h-12 mb-10 justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-medium text-white">
              Crear cuenta
            </Text>
          )}
        </Pressable>

        <ErrorText error={submitError} />
      </View>
    </KeyboardAvoidingContainer>
  )
}

export default RegisterSpecialist
