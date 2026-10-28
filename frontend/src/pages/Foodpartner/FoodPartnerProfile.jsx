import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './FoodPartnerProfile.css'

const FoodPartnerProfile = () => {
  const { partnerId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [currentPartnerId, setCurrentPartnerId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await axios.get(
          `http://localhost:3000/api/food/partners/${partnerId}`,
          { withCredentials: true },
        )

        if (isMounted) {
          setProfile(response.data)
        }
      } catch (error) {
        console.error('Fetch food partner profile error:', error)

        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ||
              'Unable to load this store. Please try again.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProfile()

    const fetchCurrentPartner = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/auth/foodpartner/me',
          { withCredentials: true },
        )

        if (isMounted) {
          setCurrentPartnerId(response.data.id)
        }
      } catch (error) {
        if (error.response?.status !== 400 && error.response?.status !== 401) {
          console.error('Fetch signed-in food partner error:', error)
        }
      }
    }

    fetchCurrentPartner()

    return () => {
      isMounted = false
    }
  }, [partnerId])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await axios.get('http://localhost:3000/api/auth/foodpartner/logout', {
        withCredentials: true,
      })
      navigate('/foodpartner/login', { replace: true })
    } catch (error) {
      console.error('Food partner logout error:', error)
      setErrorMessage(
        error.response?.data?.message || 'Unable to log out. Please try again.',
      )
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <main className="partner-profile-state" aria-live="polite">
        <p>Loading store...</p>
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className="partner-profile-state" role="alert">
        <p>{errorMessage}</p>
        <Link className="partner-profile__back" to="/user/dashboard">
          Back to videos
        </Link>
      </main>
    )
  }

  return (
    <main className="partner-profile">
      <header className="partner-profile__header">
        <div className="partner-profile__actions">
          <Link className="partner-profile__back" to="/user/dashboard">
            <span aria-hidden="true">&larr;</span> Back to videos
          </Link>
          {currentPartnerId === partnerId && (
            <button
              className="partner-profile__logout"
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
        <div className="partner-profile__identity">
          <p className="partner-profile__eyebrow">Food partner</p>
          <h1>{profile.foodPartner.restaurentName}</h1>
          <p className="partner-profile__name">By {profile.foodPartner.username}</p>
        </div>
      </header>

      <section className="partner-profile__videos" aria-labelledby="partner-videos-title">
        <div className="partner-profile__section-heading">
          <h2 id="partner-videos-title">Food videos</h2>
          <span>{profile.foodItems.length}</span>
        </div>

        {profile.foodItems.length ? (
          <div className="partner-profile__grid">
            {profile.foodItems.map((foodItem) => (
              <article className="partner-profile__video-card" key={foodItem._id}>
                <video
                  src={foodItem.url}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={foodItem.title || 'Food video'}
                />
                <div className="partner-profile__video-copy">
                  <h3>{foodItem.title}</h3>
                  <p>{foodItem.description}</p>
                  <p className="partner-profile__love-count" aria-label={`${foodItem.loveCount || 0} loves`}>
                    <span aria-hidden="true">♥</span> {foodItem.loveCount || 0}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="partner-profile__empty">
            This store hasn&apos;t uploaded any food videos yet.
          </p>
        )}
      </section>
      {errorMessage && (
        <p className="partner-profile__logout-error" role="alert">
          {errorMessage}
        </p>
      )}
    </main>
  )
}

export default FoodPartnerProfile
