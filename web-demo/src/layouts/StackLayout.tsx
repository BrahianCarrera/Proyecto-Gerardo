import { Outlet } from 'react-router-dom'

/** Full-screen stack route: teal header + scrollable body, no tab bar. */
export default function StackLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gray-100">
      <div className="phone-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="animate-screen min-h-full pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
