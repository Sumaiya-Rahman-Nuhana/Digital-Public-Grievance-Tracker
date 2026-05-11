import { createContext, useContext, useEffect, useState } from 'react'
import socket from '../socket'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    socket.on('grievanceUpdated', (data) => {
      addNotification(`📋 Complaint "${data.title}" status changed to ${data.status}`, 'update')
    })

    socket.on('newGrievance', (data) => {
      addNotification(`🆕 New complaint submitted: "${data.title}"`, 'new')
    })

    return () => {
      socket.off('grievanceUpdated')
      socket.off('newGrievance')
    }
  }, [])

  const addNotification = (message, type) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}

      {/* Toast notifications */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.map(n => (
          <div key={n.id}
            style={{ background: n.type === 'update' ? '#003135' : '#024950', color: '#AFDDE5', padding: '1rem 1.5rem', borderRadius: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: '600', boxShadow: '0 8px 30px rgba(0,49,53,0.3)', border: '1.5px solid rgba(15,164,175,0.3)', maxWidth: '360px', animation: 'slideIn 0.3s ease' }}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}