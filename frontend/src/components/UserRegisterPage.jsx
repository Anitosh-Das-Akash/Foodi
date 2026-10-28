
import AuthLayout from './AuthLayout';
import axios from 'axios';

import {useNavigate} from 'react-router-dom'

const UserRegisterPage = () => {
const navigate=useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/users/register',
        {
          username,
          email,
          password,
        },{
          withCredentials: true, // Include credentials (cookies) in the request
        }
      );

      console.log('Registration successful:', response.data);
      navigate('/users/login')


    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <AuthLayout
      audience="user"
      mode="register"
      eyebrow="Welcome to Foodies"
      heading="Create your account"
      subtitle="Sign up to find your next favorite meal."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Full name</span>
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

export default UserRegisterPage;
