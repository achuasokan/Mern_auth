import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useDispatch, UseDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'

const OAuth = () => {
  const dispatch = useDispatch()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: result.user.displayName,
          email:result.user.email,
          photo:result.user.photoURL
        })
      })

      const data = await res.json();
      dispatch(signInSuccess(data))
      console.log("data",data);
      
    } catch (error) {
      console.log('Could not login with google', error);
      
    }
  }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95 cursor-pointer'>Continue With google</button>
  )
}

export default OAuth
