import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Stories = () => {
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchStories()
    }
  }, [user])

  const fetchStories = async () => {
    try {
      const res = await axios.get('/api/stories/feed')
      setStories(res.data)
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  const viewStory = async (storyId) => {
    try {
      await axios.put(`/api/stories/${storyId}/view`)
      setSelectedStory(stories.find(s => s._id === storyId))
    } catch (error) {
      console.error('Error viewing story:', error)
    }
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please login to view stories</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem', color: '#374151' }}>Stories</h2>
      
      {selectedStory ? (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '400px',
            width: '100%',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              {selectedStory.content || "User Story"}
            </div>
            
            <div style={{
              padding: '1rem',
              background: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  {selectedStory.user.username.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>{selectedStory.user.username}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(selectedStory.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setSelectedStory(null)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {stories.map(story => (
            <div
              key={story._id}
              onClick={() => viewStory(story._id)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                margin: '0 auto 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                {story.user.username.charAt(0)}
              </div>
              <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                {story.user.username}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                {story.views.length} views
              </div>
            </div>
          ))}
          
          {stories.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              background: 'white',
              padding: '3rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ marginBottom: '0.5rem' }}>No stories available</h3>
              <p style={{ color: '#6b7280' }}>Follow more users to see their stories</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Stories