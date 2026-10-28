import { useEffect, useState } from 'react'
import axios from 'axios'
import UserBottomNav from '../../components/UserBottomNav'
import './UserPages.css'

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    axios.get('http://localhost:3000/api/auth/users/me', {
      withCredentials: true,
    }).then((response) => {
      if (isMounted) {
        setUser(response.data)
      }
    }).catch((error) => {
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

  return (
    <>
      <main className="user-page">
        <section className="user-page__card" aria-labelledby="user-profile-title">
          <p className="user-page__eyebrow">Your account</p>
          <h1 id="user-profile-title">Profile</h1>
          {errorMessage ? (
            <p className="user-page__message" role="alert">{errorMessage}</p>
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
        </section>
      </main>
      <UserBottomNav />
    </>
  )
}

export default UserProfile
