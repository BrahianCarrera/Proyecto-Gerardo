const BASE_URL = 'http://localhost:4000'


export async function apiFetch(path: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Error de red')
  }

  return response.json()
}