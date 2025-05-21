const BASE_URL = 'http://localhost:4000'

export async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Error de red')
  }

  return response.json()
}

// Atajos si lo prefieres
export const api = {
  get: (path: string) => apiFetch(path),
  post: (path: string, data: any) =>
    apiFetch(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: any) =>
    apiFetch(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string) => apiFetch(path, { method: 'DELETE' }),
}
