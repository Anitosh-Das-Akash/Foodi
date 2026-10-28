import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import UserRegisterPage from '../components/UserRegisterPage'
import UserLoginPage from '../components/UserLoginPage'
import FoodPartnerLoginPage from '../components/FoodPartnerLoginPage'
import FoodPartnerRegisterPage from '../components/FoodPartnerRegisterPage'
import Home from '../components/Home'
import CreateFood from '../pages/Foodpartner/CreateFood'
import FoodPartnerProfile from '../pages/Foodpartner/FoodPartnerProfile'
import UserProfile from '../pages/User/UserProfile'
import SavedFood from '../pages/User/SavedFood'


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/users/login' replace />} />
        <Route path='/users/register' element={<UserRegisterPage />} />
        <Route path='/users/login' element={<UserLoginPage />} />
        <Route path='/foodpartner/login' element={<FoodPartnerLoginPage />} />
        <Route path='/foodpartner/register' element={<FoodPartnerRegisterPage />} />
        <Route path='/foodpartner/create' element={<CreateFood />} />
        <Route path='/foodpartner/:partnerId' element={<FoodPartnerProfile />} />
        <Route path='/user/saved' element={<SavedFood />} />
        <Route path='/user/profile' element={<UserProfile />} />
        <Route path='*' element={<Navigate to='/users/login' replace />} />
        <Route path='/user/dashboard' element={<Home />} />
        <Route path='/foodpartner/dashboard' element={<Home isFoodPartner /> } />

      </Routes>
    </Router>
  )
}

export default AppRoutes