import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile()
      fetchUserPosts()
    }
  }, [currentUser])

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/users/me')
      setUser(res.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get('/api/posts/feed')
      const userPosts = res.data.filter(post => post.user._id === currentUser.id)
      setPosts(userPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <div>Error loading profile</div>
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      {/* Profile Header */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '1rem',
        border: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: '#3b82f6',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {user.username}
        </h2>
        
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          {user.bio}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{posts.length}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{user.followers.length}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{user.following.length}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Following</div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Your Posts</h3>
        
        {posts.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>No posts yet</h4>
            <p style={{ color: '#6b7280' }}>Share your first post with the world!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {posts.map(post => (
              <div key={post._id} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1rem',
                border: '1px solid #e5e7eb'
              }}>
                {post.images.length > 0 && (
                  <img 
                    src={post.images[0].url} 
                    alt="Post" 
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}
                  />
                )}
                <p style={{ 
                  color: '#374151',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.content}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginTop: '0.5rem'
                }}>
                  <span>❤️ {post.likes.length}</span>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile