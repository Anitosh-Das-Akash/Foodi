import AuthLayout from './AuthLayout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'  
const FoodPartnerLoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit =  async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');    

    try{
      const response = await axios.post('http://localhost:3000/api/auth/foodpartner/login',{
        email,
        password    

    },{
        withCredentials:true
      });
      console.log('Login successful:', response.data);
      navigate('/foodpartner/dashboard');
    }catch(error){
      console.error('Login failed:', error.response?.data || error.message);
    }
  }

  return(

  <AuthLayout
    audience="partner"
    mode="login"
    eyebrow="For food partners"
    heading="Welcome back"
    subtitle="Sign in to manage your food partner account."
  >
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>Email address</span>
        <input type="email" name="email" placeholder="you@example.com" autoComplete="email" />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input type="password" name="password" placeholder="At least 8 characters" autoComplete="current-password" />
      </label>
      <div className="auth-options">
        <label className="auth-remember">
          <input type="checkbox" name="remember" />
          <span>Remember me</span>
        </label>
        <a href="#forgot-password">Forgot password?</a>
      </div>
      <button className="auth-submit" type="submit">Sign in</button>
    </form>
  </AuthLayout>
  );
}

export default FoodPartnerLoginPage