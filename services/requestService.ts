// services/requestService.ts
import { protectedApiCall } from './api'; // Importa la función protegida

const API_BASE_URL_PATH = '/request'; // Solo el path base, ya que protectedApiCall usa BASE_URL de apiService

// Definiciones de tipos para las funciones pasadas desde el contexto
type GetAccessTokenFunc = () => Promise<string | null>;
type RefreshAccessTokenFunc = () => Promise<boolean>;
type OnSessionExpiredFunc = () => void;

// Variables para almacenar las funciones de autenticación inyectadas
let _getAccessToken: GetAccessTokenFunc | undefined;
let _refreshAccessTokenFn: RefreshAccessTokenFunc | undefined;
let _onSessionExpired: OnSessionExpiredFunc | undefined;

/**
 * Inicializa el servicio de solicitudes con las funciones de autenticación.
 * Debe llamarse una vez al inicio de la aplicación.
 */
export const initRequestService = (
  getAccessToken: GetAccessTokenFunc,
  refreshAccessTokenFn: RefreshAccessTokenFunc,
  onSessionExpired: OnSessionExpiredFunc
) => {
  _getAccessToken = getAccessToken;
  _refreshAccessTokenFn = refreshAccessTokenFn;
  _onSessionExpired = onSessionExpired;
};

// Interfaz para los datos de la solicitud (sin cambios)
interface SendRequestPayload {
  identifier: string;
}

interface Request {
  id: string;
  caregiverId: string;
  caregiverName: string;
  patientId: string;
  patientName?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
}

interface AcceptRequestPayload {
  requestId: string;
  patientId: string;
}

// Las funciones ahora no reciben el token, usan las variables inyectadas
export const sendCaregiverRequest = async (payload: SendRequestPayload): Promise<any> => {
  if (!_getAccessToken || !_refreshAccessTokenFn || !_onSessionExpired) {
    throw new Error("Request service not initialized. Call initRequestService first.");
  }
  return protectedApiCall(
    `${API_BASE_URL_PATH}/send`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    _getAccessToken,
    _refreshAccessTokenFn,
    _onSessionExpired
  );
};

export const getCaregiverRequests = async (): Promise<Request[]> => {
  if (!_getAccessToken || !_refreshAccessTokenFn || !_onSessionExpired) {
    throw new Error("Request service not initialized. Call initRequestService first.");
  }
  return protectedApiCall(
    API_BASE_URL_PATH,
    { method: 'GET' },
    _getAccessToken,
    _refreshAccessTokenFn,
    _onSessionExpired
  );
};

export const acceptCaregiverRequest = async (payload: AcceptRequestPayload): Promise<any> => {
  if (!_getAccessToken || !_refreshAccessTokenFn || !_onSessionExpired) {
    throw new Error("Request service not initialized. Call initRequestService first.");
  }
  return protectedApiCall(
    `${API_BASE_URL_PATH}/accept`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    _getAccessToken,
    _refreshAccessTokenFn,
    _onSessionExpired
  );
};

export const cancelCaregiverRequest = async (requestId: string): Promise<any> => {
  if (!_getAccessToken || !_refreshAccessTokenFn || !_onSessionExpired) {
    throw new Error("Request service not initialized. Call initRequestService first.");
  }
  return protectedApiCall(
    `${API_BASE_URL_PATH}/cancel/${requestId}`,
    { method: 'PATCH' },
    _getAccessToken,
    _refreshAccessTokenFn,
    _onSessionExpired
  );
};

export const unlikePatient = async (patientId: string): Promise<any> => {
  if (!_getAccessToken || !_refreshAccessTokenFn || !_onSessionExpired) {
    throw new Error("Request service not initialized. Call initRequestService first.");
  }
  return protectedApiCall(
    `${API_BASE_URL_PATH}/unlike/${patientId}`,
    { method: 'PATCH' },
    _getAccessToken,
    _refreshAccessTokenFn,
    _onSessionExpired
  );
};
