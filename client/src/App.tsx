import { Routes, Route, Navigate } from 'react-router-dom'
import { Error404 } from './pages/errors/404'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import PublicLanes from './pages/Lanes'
import Create from './pages/Create'
import Me from './pages/Me'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useAuth } from './contexts/AuthContext'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Settings from './pages/Settings'
import { ImSpinner2 } from "react-icons/im"


function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return (
    <div className="loader">
      <ImSpinner2 />
    </div>
  )

  return (
    <>
      <Navbar />
      <div style={{ padding: '65px 0 4rem 0', minHeight: '100vh' }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/lanes' element={<PublicLanes />} />
          <Route path='/signin' element={!isAuthenticated ? <Signin /> : <Navigate to='/' />} />
          <Route path='/signup' element={!isAuthenticated ? <Signup /> : <Navigate to='/' />} />
          <Route path='/create' element={isAuthenticated ? <Create /> : <Navigate to='/signin' />} />
          <Route path='/me' element={isAuthenticated ? <Me /> : <Navigate to='/signin' />} />
          <Route path='/settings' element={isAuthenticated ? <Settings /> : <Navigate to='/signin' />} />
          <Route path='*' element={<Error404 />} /> 
        </Routes>
      </div>
      <Footer />
      <ToastContainer  position='bottom-right' autoClose={3000} theme='dark'/>
    </>
  )
}

export default App
