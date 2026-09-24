import { useCallback, useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'
import StackHeader from '../../components/StackHeader'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import {
  acceptCaregiverRequest,
  cancelCaregiverRequest,
  getPatientRequests,
} from '../../data/mockApi'
import type { CaregiverRequest } from '../../types'

export default function PatientRequests() {
  const { user } = useAuth()
  const { show } = useToast()
  const [requests, setRequests] = useState<CaregiverRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<{
    req: CaregiverRequest
    action: 'accept' | 'reject'
  } | null>(null)

  const fetchRequests = useCallback(async () => {
    if (!user?.id) return
    try {
      const all = await getPatientRequests(user.id)
      setRequests(all.filter((r) => r.status === 'pending'))
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleAction = async () => {
    if (!confirm || !user) return
    try {
      if (confirm.action === 'accept') {
        await acceptCaregiverRequest(confirm.req.id, user.id)
        show('success', 'Solicitud aceptada', 'Ahora puedes ver a tu cuidador')
      } else {
        await cancelCaregiverRequest(confirm.req.id)
        show('info', 'Solicitud rechazada')
      }
      setConfirm(null)
      await fetchRequests()
    } catch (err) {
      show('error', 'Error', (err as Error).message)
    }
  }

  if (loading)
    return (
      <>
        <StackHeader title="Mis Solicitudes de Cuidador" />
        <Spinner text="Cargando solicitudes..." />
      </>
    )

  return (
    <>
      <StackHeader title="Mis Solicitudes de Cuidador" />
      <div className="p-4">
        {requests.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <BellRing size={44} className="text-gray-300" />
            <p className="text-base text-gray-600">
              No tienes solicitudes de cuidador pendientes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <p className="text-base font-semibold text-gray-900">
                  Solicitud de: {req.caregiverName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Fecha:{' '}
                  {new Date(req.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirm({ req, action: 'accept' })}
                    className="flex-1 rounded-lg bg-green-500 py-2.5 font-bold text-white"
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirm({ req, action: 'reject' })}
                    className="flex-1 rounded-lg bg-red-500 py-2.5 font-bold text-white"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirm !== null}
        danger={confirm?.action === 'reject'}
        title={
          confirm?.action === 'accept'
            ? `¿Aceptar a ${confirm?.req.caregiverName} como tu cuidador?`
            : `¿Rechazar la solicitud de ${confirm?.req.caregiverName}?`
        }
        confirmLabel={confirm?.action === 'accept' ? 'Aceptar' : 'Rechazar'}
        cancelLabel="Cancelar"
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />
    </>
  )
}
