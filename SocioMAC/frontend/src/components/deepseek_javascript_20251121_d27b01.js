import React from 'react'

const VideoCall = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <button
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#10b981',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        title="Start Video Call"
      >
        📹
      </button>
    </div>
  )
}

export default VideoCall