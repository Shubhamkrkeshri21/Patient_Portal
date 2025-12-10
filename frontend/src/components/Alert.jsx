import React, { useEffect } from 'react'
import './Alert.css'

const Alert = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success'
      case 'error':
        return 'alert-error'
      case 'warning':
        return 'alert-warning'
      default:
        return 'alert-info'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`alert ${getAlertClass()} slide-up`}>
      <span className="alert-icon">{getIcon()}</span>
      <span className="alert-message">{message}</span>
      <button onClick={onClose} className="alert-close">
        ×
      </button>
    </div>
  )
}

export default Alert