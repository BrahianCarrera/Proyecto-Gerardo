interface ConfirmModalProps {
  open: boolean
  title: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <p className="mb-5 text-center text-lg font-bold text-gray-900">
          {title}
        </p>
        <div className="flex justify-around gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-5 py-2 font-bold text-white ${
              danger ? 'bg-red-500' : 'bg-primary'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-5 py-2 font-bold text-gray-800"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
