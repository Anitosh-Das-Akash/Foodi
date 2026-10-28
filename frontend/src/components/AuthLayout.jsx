import { Link } from 'react-router-dom'
import './AuthPage.css'

const AuthLayout = ({ audience, mode, eyebrow, heading, subtitle, children }) => {
  const isPartner = audience === 'partner'
  const isRegister = mode === 'register'
  const basePath = isPartner ? '/foodpartner' : '/users'

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-heading">
        <Link className="auth-brand" to="/users/login" aria-label="Foodies home">
          <span className="auth-brand-mark" aria-hidden="true">f</span>
          <span>foodies</span>
        </Link>

        <div className="auth-intro">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1 id="auth-heading">{heading}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>

        <div className="auth-audience" aria-label="Account type">
          <Link className={!isPartner ? 'is-selected' : ''} to={isRegister ? '/users/register' : '/users/login'}>
            Customer
          </Link>
          <Link className={isPartner ? 'is-selected' : ''} to={isRegister ? '/foodpartner/register' : '/foodpartner/login'}>
            Food partner
          </Link>
        </div>

        {children}

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link to={`${basePath}/${isRegister ? 'login' : 'register'}`}>
            {isRegister ? 'Sign in' : 'Create account'}
          </Link>
        </p>
        <p className="auth-legal">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </section>
    </main>
  )
}

export default AuthLayout