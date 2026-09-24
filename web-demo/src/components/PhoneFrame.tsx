import type { ReactNode } from 'react'

/**
 * Renders the demo inside a realistic phone frame, emphasizing that
 * Gerardo App was designed as a mobile experience.
 * The status bar is provided by the app itself so it can adapt
 * to each screen's background color.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="animate-phone-in relative mx-auto w-full max-w-[390px]">
      {/* device glow */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[70px] bg-primary/20 blur-3xl"
      />
      <div className="relative rounded-[54px] bg-gradient-to-b from-[#2a2f3a] to-[#0f1218] p-[10px] shadow-[0_35px_80px_-20px_rgba(0,0,0,0.7)]">
        {/* side buttons */}
        <div className="absolute -left-[3px] top-[130px] h-14 w-[3px] rounded-l bg-[#3a3f4a]" />
        <div className="absolute -left-[3px] top-[190px] h-14 w-[3px] rounded-l bg-[#3a3f4a]" />
        <div className="absolute -left-[3px] top-[250px] h-14 w-[3px] rounded-l bg-[#3a3f4a]" />
        <div className="absolute -right-[3px] top-[210px] h-20 w-[3px] rounded-r bg-[#3a3f4a]" />

        <div className="relative h-[760px] overflow-hidden rounded-[44px] bg-white transform-gpu">
          {/* dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-black" />

          <div className="relative flex h-full flex-col">{children}</div>

          {/* home indicator */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-50 h-[5px] w-[130px] -translate-x-1/2 rounded-full bg-gray-900/75" />
        </div>
      </div>
    </div>
  )
}
