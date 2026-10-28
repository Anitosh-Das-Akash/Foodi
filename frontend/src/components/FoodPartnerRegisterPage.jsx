
import AuthLayout from './AuthLayout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodPartnerRegisterPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const restaurentName = formData.get('restaurentName');
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/foodpartner/register',
        {
          restaurentName,
          username,
          email,
          password,
        }
      );

      console.log('Registration successful:', response.data);

      navigate('/foodpartner/login');
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <AuthLayout
      audience="partner"
      mode="register"
      eyebrow="For food partners"
      heading="Create your account"
      subtitle="Bring your kitchen to the Foodies community."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Restaurant name</span>
          <input
            type="text"
            name="restaurentName"
            placeholder="Your restaurant"
            autoComplete="organization"
            required
          />
        </label>

        <label className="auth-field">
          <span>Your name</span>
          <input
            type="text"
            name="username"
            placeholder="Full name"
            autoComplete="name"
            required
          />
        </label>

        <label className="auth-field">
          <span>Email address</span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <button className="auth-submit" type="submit">
          Create account
        </button>
      </form>
    </AuthLayout>
  );
};

export default FoodPartnerRegisterPage;
