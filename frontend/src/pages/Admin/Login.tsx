import { useState } from "react"
import { useDispatch } from "react-redux"
import { adminLoginFailure, adminLoginStart, adminLoginSuccess } from "../../redux/admin/adminSlice"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"


const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(adminLoginStart())
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password})
      })

      const data = await res.json()

      if(data.success) {
        dispatch(adminLoginSuccess(data.token))
        navigate('/admin/dashboard')
        toast.success('Admin logged in Successfully')
      } else {
        dispatch(adminLoginFailure(data.message))
        toast.error(data.message)
      }

    } catch (error) {
      dispatch(adminLoginFailure('Login Failed'))
      toast.error('Login failed')
    }
  }

  return (
    <div className="bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] min-h-screen flex items-center justify-center"> {/* Tailwind classes for background color and centering */}
      <div className="bg-black p-6 rounded shadow-md w-96"> {/* Card styling */}
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <input type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-4 w-full" />
          <input type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-4 w-full" />
          <button type='submit' className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
        </form>
      </div>
    </div>
  )

}

export default AdminLogin