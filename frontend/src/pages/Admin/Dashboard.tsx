import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminNavbar from '../../components/AdminNavbar';

interface User {
  _id: string;
  username: string;
  email: string;
  blocked: boolean;
}


const Dashboard = () => {

  const [users, setUsers] = useState<User[]>([])
  // const dispatch =useDispatch()

  useEffect(() => {
    const fetchUsers= async () => {
      try {
        const res = await fetch('/api/admin/users')
        const data = await res.json()

        // Check if data is an array
        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          console.error('Expected an array but got:', data)
        }
      } catch (error) {
        console.error('Failed to fetch users',error)
      }
    };
    fetchUsers()
  },[])


  const handleToggleUserBlock = async (userId) => {
    const user = users.find(user => user._id === userId);
    // const action = user.blocked ? 'unblock' : 'block';
    const confirmationMessage = user.blocked ? 'Are you sure you want to unblock this user?' : 'Are you sure you want to block this user?';
  
    if (window.confirm(confirmationMessage)) {
      const res = await fetch(`/api/admin/toggle-block/${userId}`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUsers(users.map(user => user._id === userId ? { ...user, blocked: !user.blocked } : user));
      } else {
        toast.error(data.message);
      }
    }
  };


  return (
    <>
      {/* Navbar */}
      <AdminNavbar />

      {/* Table */}
      <div className="container mx-auto p-4">
        <table className="min-w-full shadow-md rounded-lg overflow-hidden ">
          <thead className=' bg-[#1f1f1f] text-orange-500 '>
            <tr>
              <th className="py-4 px-6 font-medium text-xl">SI</th>
              <th className="py-4 px-6 font-medium text-xl">Username</th>
              <th className="py-4 px-6 font-medium text-xl">Email</th>
              <th className="py-4 px-6 font-medium text-xl">Status</th>
              <th className="py-4 px-6 font-medium text-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map(user => (
                <tr key={user._id} className="border-b border-[#3a3a3a] hover:bg-[#2a2a2a] transition-colors duration-200">
                  <td className="px-6 py-4 font-medium text-center text-lg text-lime-400">{users.indexOf(user) + 1}</td>
                  <td className="px-6 py-4 font-medium text-center text-blue-500">{user.username}</td>
                  <td className="px-6 py-4 font-medium text-center text-blue-500">{user.email}</td>
                  <td className="px-6 py-4 font-medium text-center">{user.blocked ? 'Blocked' : 'Active'}</td>
                  <td className="px-6 py-4 font-medium text-center text-blue-500">
                    {user.blocked ? (
                      <button onClick={() => handleToggleUserBlock(user._id)} className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded">
                        Unblock
                      </button>
                    ) : (
                      <button onClick={() => handleToggleUserBlock(user._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded">
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))
}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;