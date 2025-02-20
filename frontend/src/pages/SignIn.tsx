import React, { useState } from 'react' 
import { Link, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
  const navigate = useNavigate()
const [formData, setFormData] = useState({})

const { loading, error} = useSelector((state) => state.user)
const dispatch = useDispatch()

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({...formData, [e.target.id]: e.target.value})
}


const handleSubmit = async (e:React.FormEvent) => {

  try {
    e.preventDefault()
    dispatch(signInStart())
    const res = await fetch('/api/auth/signin',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
   
    
    if(data.success === false) {
      dispatch(signInFailure(data))
      return
    }
    dispatch(signInSuccess(data))
    navigate('/')
  } catch (error) {
    dispatch(signInFailure(error))
  }

}



  return (
    <div className='p-3 max-w-lg mx-auto '>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input type='text'  placeholder='Email' id='email' className='bg-slate-100 p-3'  onChange={handleChange}/>
      <input type='text'  placeholder='Password' id='password' className='bg-slate-100 p-3'  onChange={handleChange}/>
      <button className='bg-slate-700 text-white p-3 rounded uppercase hover:opacity-95'> {loading ? 'Loading...' : 'Sign In'}  </button>

      <OAuth />
    </form>
    <div className=' flex gap-2 mt-5'>
      <p> Don't Have an account?</p>
      <Link to='/sign-up'>
      <span className='text-blue-500'>Sign Up</span>
      </Link>
    </div>
    <p className='text-red-500 '>{error ? error.message || 'Something went wrong' : ''}</p>
    </div>
  )
}

export default SignIn