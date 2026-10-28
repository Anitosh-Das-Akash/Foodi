import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import UserBottomNav from '../../components/UserBottomNav'
import './UserPages.css'

const SavedFood = () => {
  const [foodItems, setFoodItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    axios.get('http://localhost:3000/api/food/saved', {
      withCredentials: true,
    }).then((response) => {
      if (isMounted) {
        setFoodItems(response.data.foodItems)
      }
    }).catch((error) => {
      console.error('Fetch saved videos error:', error)
      if (isMounted) {
        setErrorMessage(
          error.response?.data?.message || 'Unable to load saved videos.',
        )
      }
    }).finally(() => {
      if (isMounted) {
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const removeSavedFood = async (foodId) => {
    setErrorMessage('')

    try {
      await axios.delete(`http://localhost:3000/api/food/${foodId}/save`, {
        withCredentials: true,
      })
      setFoodItems((items) => items.filter((item) => item._id !== foodId))
    } catch (error) {
      console.error('Remove saved video error:', error)
      setErrorMessage(
        error.response?.data?.message || 'Unable to remove saved video.',
      )
    }
  }

  return (
    <>
      <main className="user-page user-page--saved">
        <section className="user-page__content" aria-labelledby="saved-food-title">
          <p className="user-page__eyebrow">Your collection</p>
          <h1 id="saved-food-title">Saved videos</h1>
          {errorMessage && (
            <p className="user-page__message" role="alert">{errorMessage}</p>
          )}

          {isLoading ? (
            <p className="user-page__message" aria-live="polite">Loading saved videos...</p>
          ) : foodItems.length ? (
            <div className="saved-food-grid">
              {foodItems.map((foodItem) => (
                <article className="saved-food-card" key={foodItem._id}>
                  <video
                    src={foodItem.url}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={foodItem.title || 'Saved food video'}
                  />
                  <div className="saved-food-card__body">
                    <h2>{foodItem.title}</h2>
                    <p>{foodItem.description}</p>
                    <span className="saved-food-card__loves">
                      ♥ {foodItem.loveCount || 0}
                    </span>
                    {foodItem.foodpartnerId && (
                      <Link
                        className="saved-food-card__store"
                        to={`/foodpartner/${foodItem.foodpartnerId}`}
                      >
                        Visit store
                      </Link>
                    )}
                    <button
                      className="saved-food-card__remove"
                      type="button"
                      onClick={() => removeSavedFood(foodItem._id)}
                    >
                      Remove from saved
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="user-page__message">
              You haven&apos;t saved any videos yet.
            </p>
          )}
        </section>
      </main>
      <UserBottomNav />
    </>
  )
}

export default SavedFood
