import type { Role } from '../types'
import Logo from './Logo'
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  HeartPulse,
  Link2,
  Pill,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Users,
} from 'lucide-react'

interface PortfolioShellProps {
  children: React.ReactNode
  onDemoLogin: (role: Role) => void
  busyRole: Role | null
}

const FEATURES = [
  {
    icon: HeartPulse,
    title: 'Seguimiento de comidas',
    text: 'Las personas mayores registran las comidas de su dieta asignada con un toque, agrupadas por desayuno, almuerzo, merienda y cena.',
  },
  {
    icon: Pill,
    title: 'Medicamentos y alarmas',
    text: 'Recordatorios de medicamentos y suplementos por día y hora, con lista de “tomadas” del día y alarmas programadas.',
  },
  {
    icon: Link2,
    title: 'Vínculo cuidador–paciente',
    text: 'El familiar envía una solicitud con el correo del paciente; ella la acepta o rechaza desde su perfil. Hasta entonces no hay acceso a sus datos.',
  },
  {
    icon: Users,
    title: 'Tres roles claros',
    text: 'Especialista de la salud gestiona pacientes, dietas y alarmas. Paciente y cuidador consumen el plan personalizado.',
  },
  {
    icon: CalendarCheck,
    title: 'Dietas y catálogo nutricional',
    text: 'Platos con calorías, proteínas, carbohidratos e ingredientes; el especialista arma dietas y las asigna a cada paciente.',
  },
  {
    icon: ShieldCheck,
    title: 'Registro verificado',
    text: 'Los especialistas se registran con un código institucional y validan su cuenta por OTP de 6 dígitos.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Registro',
    text: 'Paciente o cuidador completa cédula, peso, estatura y fecha de nacimiento. El especialista usa código empresarial + OTP.',
  },
  {
    n: '02',
    title: 'Solicitud de vínculo',
    text: 'El cuidador envía una solicitud por correo. El paciente la acepta desde “Gestionar Solicitudes de Cuidadores”.',
  },
  {
    n: '03',
    title: 'Monitoreo diario',
    text: 'Comidas, medicamentos y alarmas quedan disponibles. El especialista edita pacientes, dietas y recordatorios.',
  },
]

export default function PortfolioShell({
  children,
  onDemoLogin,
  busyRole,
}: PortfolioShellProps) {
  const demos: { role: Role; label: string; desc: string; cls: string }[] = [
    {
      role: 'ESPECIALISTA',
      label: 'Especialista',
      desc: 'Gestiona pacientes, dietas y alarmas',
      cls: 'bg-primary hover:bg-primary-dark',
    },
    {
      role: 'PACIENTE',
      label: 'Paciente (adulta mayor)',
      desc: 'Ve su dieta, medicamentos y alarmas',
      cls: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      role: 'CUIDADOR',
      label: 'Cuidador familiar',
      desc: 'Monitorea a un familiar vinculado',
      cls: 'bg-blue-600 hover:bg-blue-700',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0b1220] text-gray-100">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0b1220]/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Logo width={32} height={32} />
            <span className="text-lg font-bold text-white">Gerardo App</span>
            <span className="ml-2 hidden rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary sm:inline">
              Demo web
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
            <a href="#funciones" className="transition hover:text-white">
              Funciones
            </a>
            <a href="#roles" className="transition hover:text-white">
              Roles
            </a>
            <a href="#como-funciona" className="transition hover:text-white">
              Cómo funciona
            </a>
            <a
              href="#probar"
              className="rounded-full bg-primary px-4 py-1.5 font-semibold text-white transition hover:bg-primary-dark"
            >
              Probar demo
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              <Smartphone size={14} className="text-primary" />
              Aplicación móvil · Expo + React Native — ahora en tu navegador
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Cuidado de adultos mayores,{' '}
              <span className="text-primary">en tus manos</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
              <strong className="text-gray-200">Gerardo App</strong> conecta a
              un especialista de la salud con personas mayores y sus familiares
              para monitorear comidas, dietas, medicamentos y alarmas. Fue
              diseñada como app móvil; esta demo reproduce su interfaz y
              flujos originales de forma interactiva, sin servicios externos.
            </p>

            <div id="probar" className="mt-8 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Entra con una cuenta demo
              </p>
              {demos.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => onDemoLogin(d.role)}
                  disabled={busyRole !== null}
                  className={`group flex w-full max-w-md items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-white shadow-lg transition disabled:opacity-60 ${d.cls}`}
                >
                  <span>
                    <span className="block text-sm font-bold">{d.label}</span>
                    <span className="block text-xs opacity-85">{d.desc}</span>
                  </span>
                  {busyRole === d.role ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />
                  )}
                </button>
              ))}
              <p className="pt-1 text-xs text-gray-500">
                Contraseña de todas las cuentas:{' '}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-gray-300">
                  demo123
                </code>{' '}
                · o crea una cuenta desde la app.
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-x-8 top-10 h-72 rounded-full bg-primary/25 blur-[90px]" />
            <div className="relative">{children}</div>
          </div>
        </div>
      </section>

      {/* ── Problem / purpose ───────────────────────────── */}
      <section className="border-t border-white/5 bg-[#0e1626]">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-white">
                El problema que resuelve
              </h2>
              <div className="mt-3 h-1 w-12 rounded bg-primary" />
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-gray-400 md:col-span-2 sm:text-base">
              <p>
                Las personas mayores suelen seguir dietas especiales y
                tratamientos con varios medicamentos al día. Familiares y
                profesionales de la salud no siempre tienen visibilidad de si
                se alimentaron bien o tomaron sus pastillas.
              </p>
              <p>
                Gerardo App centraliza esa información: el especialista define
                la dieta y las alarmas, el paciente registra sus comidas y
                medicamentos, y el cuidador vinculado lo monitorea a distancia
                —todo con la validación del propio paciente sobre quién puede
                ver sus datos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="funciones" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">Funciones principales</h2>
          <p className="mt-3 text-gray-400">
            Cada módulo fue reconstruido a partir del código original de la app
            móvil.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition hover:border-primary/40 hover:bg-white/[0.06]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                <f.icon size={22} className="text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roles ───────────────────────────────────────── */}
      <section id="roles" className="border-y border-white/5 bg-[#0e1626]">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white">
              Tres roles, una sola red de cuidado
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                role: 'Especialista de la salud',
                color: 'text-primary border-primary/40 bg-primary/10',
                items: [
                  'Lista de pacientes con búsqueda por cédula',
                  'Edita diagnóstico y hábitos alimenticios',
                  'Crea dietas y catálogo de comidas nutricionales',
                  'Programa alarmas de medicamentos por paciente',
                ],
              },
              {
                role: 'Paciente (adulto mayor)',
                color: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
                items: [
                  'Ve las comidas de su dieta agrupadas por momento',
                  'Marca comidas y medicamentos como consumidos',
                  'Consulta sus alarmas programadas',
                  'Acepta o rechaza solicitudes de cuidadores',
                ],
              },
              {
                role: 'Cuidador (familiar)',
                color: 'text-blue-400 border-blue-400/40 bg-blue-400/10',
                items: [
                  'Envía solicitud de vínculo por correo del paciente',
                  'Selecciona al paciente para ver su dieta',
                  'Revisa y marca medicamentos del día',
                  'Mismo flujo de comidas y alarmas que el paciente',
                ],
              },
            ].map((r) => (
              <div
                key={r.role}
                className={`rounded-2xl border p-6 ${r.color}`}
              >
                <h3 className="mb-4 font-bold">{r.role}</h3>
                <ul className="space-y-2.5 text-sm text-gray-300">
                  {r.items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">Cómo funciona</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl bg-white/[0.04] p-6">
              <span className="text-4xl font-extrabold text-primary/30">
                {s.n}
              </span>
              <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {s.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-sm text-gray-300">
          <p className="flex items-start gap-2">
            <Activity size={16} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <strong className="text-white">Nota técnica:</strong> la app
              original consumía una API REST propia con JWT. Esta demo
              sustituye ese backend con una capa de datos simulada (mock)
              persistente en tu navegador —mismos flujos, cero servicios
              externos—.
            </span>
          </p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#0e1626]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center">
          <div className="flex items-center gap-2">
            <Logo width={28} height={28} />
            <span className="font-bold text-white">Gerardo App</span>
            <RotateCcw size={14} className="text-gray-500" />
          </div>
          <p className="text-xs text-gray-500">
            Demo de portafolio · Expo / React Native original reconstruido en
            la web
          </p>
          <div className="text-xs text-gray-500">
            <p className="font-semibold text-gray-400">Autores del proyecto</p>
            <p className="mt-1">
              Miguelangel Vélez Aguirre · Braian Carrera Rodríguez · Diana
              Margot López Herrera · Francia Edith López Herrera
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
