import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import TabBar from '../components/TabBar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gray-100">
      <Header />
      <div className="phone-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="animate-screen min-h-full">
          <Outlet />
        </div>
      </div>
      <TabBar variant="admin" />
    </div>
  )
}
