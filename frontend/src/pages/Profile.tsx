import { useSelector,useDispatch } from "react-redux"
import React, { useRef, useState } from "react"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from "../redux/user/userSlice"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';






const Profile = () => {
  const {currentUser, loading, error} = useSelector(state => state.user)       //~ Accessing the user state from the redux
  const fileRef = useRef(null)
  const [form,setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isSignOutModalOpen, setSignOutModalOpen] = useState(false)
   
  //^ Show the cloudinary upload widget for image uploads
  let showWidget = () => { 
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setProfilePicture(result.info.url);
        }
      }
    );
    widget.open();
  }

  //^ Form submit to update to user info
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

  //^ handle changes in the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...form,[e.target.id]: e.target.value})
  }

  //^ Handle user account deletion 
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

  //^ Opening the signout modal
  const handleSignOut = () => {
    setSignOutModalOpen(true)
  }

  //^ Confirm Signout in the modal 
  const confirmSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
      toast.success('User logged out')
    } catch (error) {
      console.log(error);
    }
    setSignOutModalOpen(false)
  }

  //^ Style for the modal overlay
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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

    {isSignOutModalOpen && (
      <div style={modalOverlayStyle}>
        <div className="bg-black border-2 border-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
          <h2 className="text-xl  font-semibold mb-4 text-gray-300 ">Confirm Sign Out</h2>
          <p className="mb-4 text-gray-200">Are you sure you want to sign out?</p>
          <div className="flex justify-end space-x-2">
            <button onClick={() => setSignOutModalOpen(false)} className="mr-2 bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md  hover:bg-gray-700 transition font-semibold ">
              Cancel
            </button>
            <button onClick={confirmSignOut} className="bg-red-600 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition">
              Yes
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default Profile