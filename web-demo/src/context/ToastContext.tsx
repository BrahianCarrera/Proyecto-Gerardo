import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  type: ToastType
  text1: string
  text2?: string
}

interface ToastCtx {
  show: (type: ToastType, text1: string, text2?: string) => void
}

const Ctx = createContext<ToastCtx | null>(null)

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 size={20} className="text-white" />,
  error: <XCircle size={20} className="text-white" />,
  info: <Info size={20} className="text-white" />,
}

const bgs: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-500',
  info: 'bg-primary',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const show = useCallback(
    (type: ToastType, text1: string, text2?: string) => {
      const id = ++idRef.current
      setToasts((t) => [...t, { id, type, text1, text2 }])
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, 3200)
    },
    [],
  )

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast pointer-events-auto flex w-full max-w-[340px] items-start gap-2 rounded-xl px-4 py-3 text-white shadow-lg ${bgs[t.type]}`}
          >
            <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t.text1}</p>
              {t.text2 && (
                <p className="text-xs opacity-90">{t.text2}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
