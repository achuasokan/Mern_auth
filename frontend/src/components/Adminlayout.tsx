
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="admin-layout bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] min-h-screen">
      <Outlet />
    </div>
  )
}

export default AdminLayout