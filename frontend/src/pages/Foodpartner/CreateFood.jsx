import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './CreateFood.css'

const MAX_VIDEO_SIZE = 15 * 1024 * 1024

const CreateFood = () => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    const video = formData.get('video')

    if (!(video instanceof File) || video.size === 0) {
      setErrorMessage('Choose a video to upload.')
      return
    }

    if (video.size > MAX_VIDEO_SIZE) {
      setErrorMessage('Video must be 15 MB or smaller.')
      return
    }

    setIsSubmitting(true)

    try {
      await axios.post('http://localhost:3000/api/food/food-item', formData, {
        withCredentials: true,
      })
      navigate('/foodpartner/dashboard')
    } catch (error) {
      console.error('Create food item error:', error)
      setErrorMessage(
        error.response?.data?.message || 'Unable to upload food video. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="create-food-page">
      <section className="create-food-card" aria-labelledby="create-food-title">
        <Link className="create-food-back" to="/foodpartner/dashboard">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>

        <p className="create-food-eyebrow">Food partner</p>
        <h1 id="create-food-title">Share a food video</h1>
        <p className="create-food-intro">
          Add a dish and a short video to introduce it to Foodies.
        </p>

        <form className="create-food-form" onSubmit={handleSubmit}>
          <label className="create-food-field">
            <span>Food title</span>
            <input
              type="text"
              name="title"
              placeholder="e.g. House special burger"
              maxLength={100}
              required
            />
          </label>

          <label className="create-food-field">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Tell people what makes this dish special"
              rows={4}
              maxLength={1000}
              required
            />
          </label>

          <label className="create-food-field">
            <span>Food video</span>
            <input
              type="file"
              name="video"
              accept="video/*"
              required
            />
            <small>Maximum file size: 15 MB.</small>
          </label>

          {errorMessage && (
            <p className="create-food-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="create-food-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Create food'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default CreateFood
