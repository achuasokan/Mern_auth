import { useSelector,useDispatch } from "react-redux"
import React, { useRef, useState } from "react"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from "../redux/user/userSlice"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';






const Profile = () => {
  const {currentUser, loading, error} = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [img, setImage] = useState<File | null>(null)
  const [form,setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
   
  let showWidget = () => {
    
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log(result.info.url);
          setProfilePicture(result.info.url);
        }
      }
    );
    widget.open();
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
        body: JSON.stringify({
          ...form,
          profilePicture: profilePicture,
        })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...form,[e.target.id]: e.target.value})
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success(data)
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
      toast.success('User logged out ')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
        <input type='file' ref={fileRef}  hidden  accept='image/*' onChange={showWidget}/>

        <div className="relative flex justify-center">
        <img 
          src={profilePicture || currentUser.profilePicture} 
          alt="profile" 
          onClick={showWidget} 
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
        />
        <FontAwesomeIcon icon={faEdit} className="absolute  bottom-1 left-65  text-white  rounded-full p-1 cursor-pointer" />
        </div>
 
        <input type='text' id='username' placeholder="Username" onChange={handleChange} defaultValue={currentUser.username} className="bg-slate-100 rounded-lg p-3" />
        <input type='email' id='email' placeholder="Email" onChange={handleChange} defaultValue={currentUser.email} className="bg-slate-100 rounded-lg p-3 disabled:opacity-35"  disabled/>
        <input type='password' id='password' placeholder="Password" onChange={handleChange} className="bg-slate-100 rounded-lg p-3" />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">{loading ? 'Loading...' : 'Update'}</button>

  
      </form>

      <div className="flex justify-between mt-5">
        <span onDoubleClick={handleDelete} className=" text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className=" text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-500 mt-5">{error && 'Something went wrong'}</p>
      <p className="text-green-500 mt-5">{updateSuccess && 'Updated successfully'}</p>
    </div>
    </>
  )
}

export default Profile