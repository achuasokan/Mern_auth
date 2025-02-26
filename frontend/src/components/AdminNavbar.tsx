import { useDispatch } from "react-redux"
import { adminLogout } from "../redux/admin/adminSlice"
import { toast } from "react-toastify"
import React from "react"

interface NavbarProps {
  setSearchQuery: (query: string) => void
}

const AdminNavbar:React.FC<NavbarProps> = ({ setSearchQuery }) => {

  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(adminLogout())
    toast.success('Admin logged out')
  }

  return (
    <>
    {/* Navbar */}
    <div className="flex items-center justify-between p-4 bg-black text-white">
        <h1 className="text-2xl font-bold"><span className="text-orange-500">Dash</span>board</h1>
        <input type='text' placeholder='search'onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#242526] text-gray-200 text-sm px-4 py-2 rounded-full w-96 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500" />
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </>
  )
}

export default AdminNavbar