import { useSelector, UseDispatch, useDispatch } from "react-redux"
import React, { useRef, useState } from "react"
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice"








const Profile = () => {
  const {currentUser, loading, error} = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [img, setImage] = useState<File | null>(null)
  const [form,setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
   

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      setImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if(data.success === false) {
        dispatch(updateUserFailure(data))
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch(error) {
     dispatch(updateUserFailure(error))
      
    }
  }

  const handleChange = (e) => {
    setFormData({...form,[e.target.id]: e.target.value})
  }
  console.log(form);
  

  return (
    <>
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
        <input type='file' ref={fileRef}  hidden  accept='image/*' onChange={handleImage}/>
        <img src={currentUser.profilePicture} alt="profile" onClick={()=> fileRef.current.click()} className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"/>

        <input type='text' id='username' placeholder="Username" onChange={handleChange} defaultValue={currentUser.username} className="bg-slate-100 rounded-lg p-3" />
        <input type='email' id='email' placeholder="Email" onChange={handleChange} defaultValue={currentUser.email} className="bg-slate-100 rounded-lg p-3 disabled:opacity-35"  disabled/>
        <input type='password' id='password' placeholder="Password" onChange={handleChange} className="bg-slate-100 rounded-lg p-3" />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">{loading ? 'Loading...' : 'Update'}</button>

  
      </form>

      <div className="flex justify-between mt-5">
        <span className=" text-red-700 cursor-pointer">Delete Account</span>
        <span className=" text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-500 mt-5">{error && 'Something went wrong'}</p>
      <p className="text-green-500 mt-5">{updateSuccess && 'User is updated successfully'}</p>
    </div>
    </>
  )
}

export default Profile