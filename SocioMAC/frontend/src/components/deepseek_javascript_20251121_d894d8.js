import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && images.length === 0) return

    setLoading(true)
    
    try {
      const uploadedImages = []
      
      for (const image of images) {
        const formData = new FormData()
        formData.append('image', image)
        const res = await axios.post('/api/upload/image', formData)
        uploadedImages.push(res.data)
      }

      const postData = {
        content,
        images: uploadedImages
      }

      const res = await axios.post('/api/posts', postData)
      onPostCreated(res.data)
      setContent('')
      setImages([])
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  if (!user) return null

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid #e5e7eb'
    }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          style={{
            width: '100%',
            border: 'none',
            resize: 'none',
            fontSize: '1rem',
            minHeight: '100px',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        
        {images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {images.map((image, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1rem'
        }}>
          <div>
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="image-upload"
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-block'
              }}
            >
              📷 Add Photos
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || (!content.trim() && images.length === 0)}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: (!content.trim() && images.length === 0) ? 0.5 : 1
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost