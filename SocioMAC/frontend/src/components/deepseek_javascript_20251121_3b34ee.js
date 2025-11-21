import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Post = ({ post }) => {
  const [currentPost, setCurrentPost] = useState(post)
  const [comment, setComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const { user } = useAuth()

  const handleLike = async () => {
    try {
      const res = await axios.put(`/api/posts/${post._id}/like`)
      setCurrentPost(res.data)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      const res = await axios.post(`/api/posts/${post._id}/comment`, { text: comment })
      setCurrentPost(prev => ({
        ...prev,
        comments: [...prev.comments, res.data]
      }))
      setComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const isLiked = user && currentPost.likes.includes(user.id)

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid #e5e7eb'
    }}>
      {/* Post Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {post.user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: '500' }}>{post.user.username}</div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>
          {post.content}
        </p>
      )}

      {/* Post Images */}
      {post.images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt="Post"
              style={{
                width: '100%',
                borderRadius: '8px',
                maxHeight: '400px',
                objectFit: 'cover'
              }}
            />
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#6b7280',
        fontSize: '0.875rem',
        marginBottom: '0.5rem'
      }}>
        <span>{currentPost.likes.length} likes</span>
        <span>{currentPost.comments.length} comments</span>
      </div>

      {/* Post Actions */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        padding: '0.5rem 0',
        marginBottom: '1rem'
      }}>
        <button
          onClick={handleLike}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '0.5rem',
            cursor: 'pointer',
            color: isLiked ? '#3b82f6' : '#6b7280',
            fontWeight: isLiked ? 'bold' : 'normal'
          }}
        >
          ❤️ Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '0.5rem',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          💬 Comment
        </button>
        <button style={{
          flex: 1,
          background: 'none',
          border: 'none',
          padding: '0.5rem',
          cursor: 'pointer',
          color: '#6b7280'
        }}>
          🔄 Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div>
          {/* Add Comment */}
          <form onSubmit={handleComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '0.875rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {currentPost.comments.map(comment => (
              <div key={comment._id} style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '0.75rem',
                padding: '0.5rem',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}>
                  {comment.user.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    {comment.user.username}
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>{comment.text}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Post