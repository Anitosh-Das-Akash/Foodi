
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import UserBottomNav from '../../components/UserBottomNav'
import './UserPages.css'

const UserProfile = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [logoutError, setLogoutError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    api.get('/api/auth/users/me')
      .then((response) => {
        if (isMounted) {
          setUser(response.data)
        }
      })
      .catch((error) => {
        console.error('Fetch user profile error:', error)

        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || 'Unable to load your profile.',
          )
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setLogoutError('')

    try {
      await api.get('/api/auth/users/logout')

      navigate('/users/login', { replace: true })
    } catch (error) {
      console.error('User logout error:', error)

      setLogoutError(
        error.response?.data?.message || 'Unable to log out. Please try again.',
      )

      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <main className="user-page">
        <section
          className="user-page__card"
          aria-labelledby="user-profile-title"
        >
          <p className="user-page__eyebrow">Your account</p>
          <h1 id="user-profile-title">Profile</h1>

          {errorMessage ? (
            <p className="user-page__message" role="alert">
              {errorMessage}
            </p>
          ) : user ? (
            <dl className="user-profile-details">
              <div>
                <dt>Name</dt>
                <dd>{user.username}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
            </dl>
          ) : (
            <p className="user-page__message" aria-live="polite">
              Loading profile...
            </p>
          )}

          {user && (
            <button
              className="user-profile__logout"
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          )}

          {logoutError && (
            <p className="user-page__error" role="alert">
              {logoutError}
            </p>
          )}
        </section>
      </main>

      <UserBottomNav />
    </>
  )
}

export default UserProfile
