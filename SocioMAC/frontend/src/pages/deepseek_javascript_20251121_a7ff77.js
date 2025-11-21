import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState([])
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchConversations()
      fetchUsers()
    }
  }, [user])

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/chat/conversations')
      setConversations(res.data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/test/users')
      setUsers(res.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(`/api/chat/messages/${userId}`)
      setMessages(res.data)
      setSelectedUser(userId)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      const res = await axios.post('/api/chat/messages', {
        receiverId: selectedUser,
        text: newMessage
      })
      
      setMessages(prev => [...prev, res.data])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please login to access chat</p>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '1rem',
      height: 'calc(100vh - 80px)',
      display: 'flex'
    }}>
      {/* Conversations Sidebar */}
      <div style={{
        width: '300px',
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        padding: '1rem',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Messages</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            Start New Chat
          </h4>
          {users.map(userItem => (
            <div
              key={userItem.id}
              onClick={() => fetchMessages(userItem.id)}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                background: selectedUser === userItem.id ? '#f3f4f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
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
                {userItem.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{userItem.name}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Click to chat</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              background: 'white'
            }}>
              <h3 style={{ margin: 0 }}>
                {users.find(u => u.id === selectedUser)?.name || 'User'}
              </h3>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              background: '#f9fafb'
            }}>
              {messages.map(message => (
                <div
                  key={message._id || message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender === user.id ? 'flex-end' : 'flex-start',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{
                    background: message.sender === user.id ? '#3b82f6' : 'white',
                    color: message.sender === user.id ? 'white' : '#374151',
                    padding: '0.75rem 1rem',
                    borderRadius: '18px',
                    maxWidth: '70%',
                    border: message.sender === user.id ? 'none' : '1px solid #e5e7eb'
                  }}>
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              background: 'white'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '24px',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    cursor: 'pointer'
                  }}
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb'
          }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <h3>Select a conversation</h3>
              <p>Choose a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat