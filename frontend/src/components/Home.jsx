
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import UserBottomNav from './UserBottomNav'
import './Home.css'

const Home = ({ isFoodPartner = false }) => {
  const navigate = useNavigate()
  const [foodItems, setFoodItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [loveError, setLoveError] = useState('')
  const [pendingLoveIds, setPendingLoveIds] = useState([])
  const [pendingSaveIds, setPendingSaveIds] = useState([])
  const [activeCommentFoodId, setActiveCommentFoodId] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState('')
  const [currentPartnerId, setCurrentPartnerId] = useState(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [replyingToCommentId, setReplyingToCommentId] = useState(null)
  const videoRefs = useRef([])
  const createFoodButton = isFoodPartner ? (
    <button
      className="food-feed__create-button"
      type="button"
      onClick={() => navigate('/foodpartner/create')}
    >
      Create food
    </button>
  ) : null

  const handleLoveClick = async (foodItem) => {
    if (pendingLoveIds.includes(foodItem._id)) {
      return
    }

    setLoveError('')
    setPendingLoveIds((ids) => [...ids, foodItem._id])

    try {
      const method = foodItem.isLoved ? 'delete' : 'post'
      const response = await axios({
        method,
        url: `http://localhost:3000/api/food/${foodItem._id}/love`,
        withCredentials: true,
      })

      setFoodItems((items) =>
        items.map((item) =>
          item._id === foodItem._id
            ? {
                ...item,
                isLoved: response.data.isLoved,
                loveCount: response.data.loveCount,
              }
            : item,
        ),
      )
    } catch (error) {
      console.error('Update video love error:', error)
      setLoveError(
        error.response?.status === 400 || error.response?.status === 401
          ? 'Sign in as a user to love videos.'
          : error.response?.data?.message || 'Unable to update love. Please try again.',
      )
    } finally {
      setPendingLoveIds((ids) => ids.filter((id) => id !== foodItem._id))
    }
  }

  const handleSaveClick = async (foodItem) => {
    if (pendingSaveIds.includes(foodItem._id)) {
      return
    }

    setLoveError('')
    setPendingSaveIds((ids) => [...ids, foodItem._id])

    try {
      const method = foodItem.isSaved ? 'delete' : 'post'
      const response = await axios({
        method,
        url: `http://localhost:3000/api/food/${foodItem._id}/save`,
        withCredentials: true,
      })

      setFoodItems((items) =>
        items.map((item) =>
          item._id === foodItem._id
            ? { ...item, isSaved: response.data.isSaved }
            : item,
        ),
      )
    } catch (error) {
      console.error('Save food item error:', error)
      setLoveError(
        error.response?.status === 400 || error.response?.status === 401
          ? 'Sign in as a user to save videos.'
          : error.response?.data?.message || 'Unable to save video. Please try again.',
      )
    } finally {
      setPendingSaveIds((ids) => ids.filter((id) => id !== foodItem._id))
    }
  }

  const openComments = async (foodItem) => {
    setActiveCommentFoodId(foodItem._id)
    setComments([])
    setCommentError('')
    setCommentsLoading(true)
    setCommentText('')
    setReplyText('')

    try {
      const response = await axios.get(
        `http://localhost:3000/api/food/${foodItem._id}/comments`,
      )
      setComments(response.data.comments)
    } catch (error) {
      console.error('Fetch post comments error:', error)
      setCommentError(
        error.response?.data?.message || 'Unable to load comments. Please try again.',
      )
    } finally {
      setCommentsLoading(false)
    }
  }

  const closeComments = () => {
    setActiveCommentFoodId(null)
    setCommentError('')
    setCommentText('')
    setReplyText('')
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    if (!activeCommentFoodId || !commentText.trim()) return

    setIsSubmittingComment(true)
    setCommentError('')
    try {
      const response = await axios.post(
        `http://localhost:3000/api/food/${activeCommentFoodId}/comments`,
        { text: commentText },
        { withCredentials: true },
      )
      setComments((existingComments) => [...existingComments, response.data.comment])
      setFoodItems((items) =>
        items.map((item) =>
          item._id === activeCommentFoodId
            ? { ...item, commentCount: response.data.commentCount }
            : item,
        ),
      )
      setCommentText('')
    } catch (error) {
      console.error('Create post comment error:', error)
      setCommentError(
        error.response?.status === 400 || error.response?.status === 401
          ? 'Sign in as a user to comment.'
          : error.response?.data?.message || 'Unable to add comment. Please try again.',
      )
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleReplySubmit = async (event, commentId) => {
    event.preventDefault()
    if (!activeCommentFoodId || !replyText.trim()) return

    setReplyingToCommentId(commentId)
    setCommentError('')
    try {
      const response = await axios.post(
        `http://localhost:3000/api/food/${activeCommentFoodId}/comments/${commentId}/reply`,
        { text: replyText },
        { withCredentials: true },
      )
      setComments((existingComments) =>
        existingComments.map((comment) =>
          comment.id === commentId ? response.data.comment : comment,
        ),
      )
      setReplyText('')
    } catch (error) {
      console.error('Reply to post comment error:', error)
      setCommentError(
        error.response?.status === 400 || error.response?.status === 401
          ? 'Sign in as the food partner to reply.'
          : error.response?.data?.message || 'Unable to send reply. Please try again.',
      )
    } finally {
      setReplyingToCommentId(null)
    }
  }

  useEffect(() => {
    if (!isFoodPartner) return undefined

    let isMounted = true
    axios.get('http://localhost:3000/api/auth/foodpartner/me', {
      withCredentials: true,
    }).then((response) => {
      if (isMounted) {
        setCurrentPartnerId(response.data.id)
      }
    }).catch((error) => {
      if (error.response?.status !== 400 && error.response?.status !== 401) {
        console.error('Fetch current food partner error:', error)
      }
    })

    return () => {
      isMounted = false
    }
  }, [isFoodPartner])

  useEffect(() => {
    let isMounted = true

    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/food/',
          { withCredentials: true }
        )

        if (isMounted) {
          setFoodItems(response.data.foodItems || [])
        }
      } catch (error) {
        console.error('Fetch food items error:', error)
        console.error('Server response:', error.response?.data)

        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ||
            error.message ||
            'Unable to load food videos. Please try again.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchFoodItems()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean)

    if (!videos.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target

          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.warn('Video playback failed:', error)
            })
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.6 }
    )

    videos.forEach((video) => observer.observe(video))

    return () => observer.disconnect()
  }, [foodItems])

  if (isLoading) {
    return (
      <>
        {createFoodButton}
        <main className="food-feed-state" aria-live="polite">
          <p>Loading food videos...</p>
        </main>
        {!isFoodPartner && <UserBottomNav />}
      </>
    )
  }

  if (errorMessage) {
    return (
      <>
        {createFoodButton}
        <main className="food-feed-state" role="alert">
          <p>{errorMessage}</p>
        </main>
        {!isFoodPartner && <UserBottomNav />}
      </>
    )
  }

  if (foodItems.length === 0) {
    return (
      <>
        {createFoodButton}
        <main className="food-feed-state">
          <p>No food videos yet. Check back soon.</p>
        </main>
        {!isFoodPartner && <UserBottomNav />}
      </>
    )
  }

  return (
    <>
      {createFoodButton}
      <main className="food-feed" aria-label="Food videos">
        {loveError && (
          <p className="food-feed__love-error" role="alert">
            {loveError}
          </p>
        )}
        {foodItems.map((foodItem, index) => {
          const partnerId =
            foodItem.foodpartnerId ||
            (typeof foodItem.foodpartner === 'string'
              ? foodItem.foodpartner
              : foodItem.foodpartner?._id)

          return (
            <article
              className="food-reel"
              key={foodItem._id || `${foodItem.url}-${index}`}
            >
              <video
                ref={(video) => {
                  videoRefs.current[index] = video
                }}
                className="food-reel__video"
                src={foodItem.url}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={foodItem.title || 'Food video'}
              />

              <div className="food-reel__top">
                {foodItem.title && (
                  <p className="food-reel__title">{foodItem.title}</p>
                )}

                <p className="food-reel__description">
                  {foodItem.description}
                </p>

                <button
                  className="food-reel__store-button"
                  type="button"
                  disabled={!partnerId}
                  onClick={() => navigate(`/foodpartner/${partnerId}`)}
                >
                  {partnerId ? 'Visit store' : 'Store unavailable'}
                </button>
              </div>
              <button
                className={`food-reel__love-button${foodItem.isLoved ? ' is-loved' : ''}`}
                type="button"
                aria-label={`${foodItem.isLoved ? 'Remove love from' : 'Love'} ${foodItem.title || 'video'}; ${foodItem.loveCount || 0} loves`}
                aria-pressed={Boolean(foodItem.isLoved)}
                disabled={pendingLoveIds.includes(foodItem._id)}
                onClick={() => handleLoveClick(foodItem)}
              >
                <span className="food-reel__heart" aria-hidden="true">
                  {foodItem.isLoved ? '♥' : '♡'}
                </span>
                <span>{foodItem.loveCount || 0}</span>
              </button>
              <button
                className={`food-reel__save-button${foodItem.isSaved ? ' is-saved' : ''}`}
                type="button"
                aria-label={`${foodItem.isSaved ? 'Remove' : 'Save'} ${foodItem.title || 'video'}`}
                aria-pressed={Boolean(foodItem.isSaved)}
                disabled={pendingSaveIds.includes(foodItem._id)}
                onClick={() => handleSaveClick(foodItem)}
              >
                <span className="food-reel__action-icon" aria-hidden="true">
                  {foodItem.isSaved ? '▣' : '▢'}
                </span>
              </button>
              <button
                className="food-reel__comments-button"
                type="button"
                aria-label={`View ${foodItem.commentCount || 0} comments`}
                onClick={() => openComments(foodItem)}
              >
                <span className="food-reel__action-icon" aria-hidden="true">▤</span>
                <span className="food-reel__action-count" aria-hidden="true">
                  {foodItem.commentCount || 0}
                </span>
              </button>
            </article>
          )
        })}
      </main>
      {activeCommentFoodId && (
        <div
          className="food-comments-backdrop"
          onClick={closeComments}
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeComments()
          }}
        >
          <section
            className="food-comments-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="food-comments-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="food-comments-panel__header">
              <div>
                <h2 id="food-comments-title">Comments</h2>
                <p>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</p>
              </div>
              <button
                className="food-comments-panel__close"
                type="button"
                onClick={closeComments}
                aria-label="Close comments"
              >
                ×
              </button>
            </header>

            {commentError && (
              <p className="food-comments-panel__error" role="alert">
                {commentError}
              </p>
            )}

            <div className="food-comments-panel__list" aria-live="polite">
              {commentsLoading ? (
                <p className="food-comments-panel__empty">Loading comments...</p>
              ) : comments.length ? (
                comments.map((comment) => {
                  const commentFood = foodItems.find(
                    (item) => item._id === activeCommentFoodId,
                  )
                  const ownsPost =
                    isFoodPartner &&
                    currentPartnerId &&
                    (commentFood?.foodpartnerId ||
                      commentFood?.foodpartner?._id) === currentPartnerId

                  return (
                    <article className="food-comment" key={comment.id}>
                      <p className="food-comment__author">{comment.username}</p>
                      <p className="food-comment__text">{comment.text}</p>
                      {comment.reply && (
                        <div className="food-comment__reply">
                          <p className="food-comment__author">
                            {comment.reply.username} <span>· Food partner</span>
                          </p>
                          <p className="food-comment__text">{comment.reply.text}</p>
                        </div>
                      )}
                      {ownsPost && !comment.reply && (
                        <form
                          className="food-comment__reply-form"
                          onSubmit={(event) => handleReplySubmit(event, comment.id)}
                        >
                          <input
                            type="text"
                            value={replyText}
                            onChange={(event) => setReplyText(event.target.value)}
                            placeholder={`Reply to ${comment.username}`}
                            maxLength={1000}
                            aria-label={`Reply to ${comment.username}`}
                            required
                          />
                          <button
                            type="submit"
                            disabled={
                              !replyText.trim() || replyingToCommentId === comment.id
                            }
                          >
                            {replyingToCommentId === comment.id ? 'Sending...' : 'Reply'}
                          </button>
                        </form>
                      )}
                    </article>
                  )
                })
              ) : (
                <p className="food-comments-panel__empty">
                  No comments yet. Start the conversation.
                </p>
              )}
            </div>

            <form className="food-comments-panel__form" onSubmit={handleCommentSubmit}>
              <input
                type="text"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Add a comment..."
                maxLength={1000}
                aria-label="Add a comment"
                required
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </button>
            </form>
          </section>
        </div>
      )}
      {!isFoodPartner && <UserBottomNav />}
    </>
  )
}

export default Home
