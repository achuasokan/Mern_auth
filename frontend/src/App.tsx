import { Routes, Route, useLocation } from "react-router-dom"
import Home from './pages/Home'
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminLogin from "./pages/Admin/Login"
import Dashboard from "./pages/Admin/Dashboard"
import AdminLayout from "./components/Adminlayout"
import AdminProtectedRoute from "./components/AdminProtectedRoute"

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/' element={ <Home />} />
        <Route path='/about' element={ <About />} />
        <Route path='/sign-in' element={ <SignIn />} />
        <Route path='/sign-up' element={ <SignUp />} />
        <Route path='/admin/login' element={<AdminLogin />} />

         <Route element={<AdminProtectedRoute />}>
           <Route element={<AdminLayout />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
        </Route>
         </Route>

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
