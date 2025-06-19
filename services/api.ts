// apiService.ts
import AsyncStorage from '@react-native-async-storage/async-storage' // Necesario para obtener tokens si no usas UserContext directamente aquí

const BASE_URL = 'http://localhost:4000'

interface ApiCallOptions extends RequestInit {
  // Puedes extender RequestInit si necesitas más opciones personalizadas
  method?: string
  headers?: Record<string, string>
  body?: BodyInit | null
}

/**
 * Función base para realizar peticiones a la API.
 * Ideal para rutas públicas o para la obtención inicial de tokens.
 */
export async function apiFetch(path: string, options: ApiCallOptions = {}): Promise<any> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  // Manejo de errores genérico para todas las peticiones
  if (!response.ok) {
    let errorData: any
    try {
      errorData = await response.json() // Intenta parsear como JSON
    } catch (e) {
      errorData = { message: response.statusText || 'Error desconocido del servidor.' } // Si no es JSON, usa el texto de estado
    }
    // Puedes lanzar un error más específico aquí si lo necesitas
    throw { status: response.status, data: errorData }
  }

  // Si la respuesta no tiene contenido (ej. 204 No Content), no intentes parsear JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null; // O un objeto vacío, dependiendo de lo que esperes
}

/**
 * Objeto 'api' para facilitar las llamadas a rutas públicas.
 */
export const api = {
  get: (path: string) => apiFetch(path),
  post: (path: string, data: any) =>
    apiFetch(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: any) =>
    apiFetch(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string) => apiFetch(path, { method: 'DELETE' }),
}

// --- Lógica para Peticiones Protegidas con Tokens ---

// Definiciones de tipos para las funciones pasadas
type GetAccessTokenFunc = () => Promise<string | null>
type RefreshAccessTokenFunc = () => Promise<boolean>
type OnSessionExpiredFunc = () => void

/**
 * Realiza una llamada a la API con manejo automático de tokens de autenticación.
 * Esta función es ideal para rutas que requieren un access token y que pueden
 * necesitar un refresco automático del token.
 *
 * @param url La URL completa o el path relativo de la API.
 * @param options Opciones estándar de RequestInit para fetch.
 * @param getAccessToken Función asíncrona que debe retornar el access token actual.
 * @param refreshAccessTokenFn Función asíncrona que intenta refrescar el access token y retorna true si fue exitoso, false si falló.
 * @param onSessionExpired Función a llamar si la sesión no puede ser restaurada (ej. refresh token inválido).
 */
export const protectedApiCall = async (
  path: string,
  options: ApiCallOptions = {},
  getAccessToken: GetAccessTokenFunc, // Se pasa desde el componente/hook que usa el contexto
  refreshAccessTokenFn: RefreshAccessTokenFunc, // Se pasa desde el componente/hook que usa el contexto
  onSessionExpired: OnSessionExpiredFunc // Se pasa desde el componente/hook que usa el contexto
): Promise<any> => {
  let currentAccessToken = await getAccessToken() // Obtiene el token más reciente del contexto

  // Si no hay token al principio, es un error de autenticación
  if (!currentAccessToken) {
    onSessionExpired() // Dispara la acción de cierre de sesión
    throw new Error('No authenticated. Please login again.')
  }

  // Prepara los headers con el access token
  let headers = {
    ...options.headers,
    'Content-Type': 'application/json', // Asegura que el content type sea JSON por defecto
    Authorization: `Bearer ${currentAccessToken}`,
  }

  try {
    let response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

    // Si el token actual expiró (401 Unauthorized)
    if (response.status === 401) {
      console.log('Access token expirado/inválido. Intentando refrescar...')
      const refreshed = await refreshAccessTokenFn() // Intenta refrescar el token

      if (refreshed) {
        // Si el refresco fue exitoso, obtenemos el nuevo token y reintentamos la petición
        currentAccessToken = await getAccessToken()
        if (currentAccessToken) {
          headers.Authorization = `Bearer ${currentAccessToken}`
          response = await fetch(`${BASE_URL}${path}`, { ...options, headers }) // Reintenta la petición original
        } else {
          // Esto no debería ocurrir si refreshAccessTokenFn devuelve true
          onSessionExpired()
          throw new Error('Session refresh succeeded but no new token found. Please login again.')
        }
      } else {
        // Si el refresh token también falló o no se pudo renovar
        onSessionExpired() // Dispara la acción de cierre de sesión
        throw new Error('Session expired. Please login again.')
      }
    }

    // Manejo de errores para la respuesta final (después de posible reintento)
    if (!response.ok) {
      let errorData: any
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { message: response.statusText || 'Error desconocido del servidor.' }
      }
      throw { status: response.status, data: errorData }
    }

    // Retorna el JSON si la respuesta es exitosa y tiene contenido
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return null;
  } catch (error) {
    console.error('Error en protectedApiCall:', error)
    throw error // Propagar el error para que sea manejado por el componente
  }
}