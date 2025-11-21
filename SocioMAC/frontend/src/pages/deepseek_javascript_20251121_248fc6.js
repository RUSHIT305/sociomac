import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import CreatePost from '../components/CreatePost'
import Post from '../components/Post'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchFeed()
      fetchStories()
    }
  }, [user])

  const fetchFeed = async () => {
    try {
      const res = await axios.get('/api/posts/feed')
      setPosts(res.data)
    } catch (error) {
      console.error('Error fetching feed:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStories = async () => {
    try {
      const res = await axios.get('/api/stories/feed')
      setStories(res.data)
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  const addPost = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Welcome to SocialMedia Pro</h2>
        <p>Please login or register to continue</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      {/* Stories */}
      {stories.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Stories</h3>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {stories.map(story => (
              <div key={story._id} style={{
                width: '80px',
                flexShrink: 0,
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                  margin: '0 auto',
                  padding: '2px'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>👤</span>
                  </div>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  color: '#374151'
                }}>
                  {story.user.username}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <CreatePost onPostCreated={addPost} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map(post => (
          <Post key={post._id} post={post} />
        ))}
        
        {posts.length === 0 && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <h3>No posts yet</h3>
            <p>Follow some users or create your first post!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home