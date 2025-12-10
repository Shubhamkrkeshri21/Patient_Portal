import React, { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import './DocumentCard.css'
import { apiService as api } from '../services/api.jsx'

const DocumentCard = ({ document, onDelete, onError }) => {
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'MMM dd, yyyy')
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)
      await api.downloadDocument(document.id, document.originalName)
    } catch (error) {
      onError('Failed to download document')
    } finally {
      setDownloading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        setDeleting(true)
        await api.deleteDocument(document.id)
        onDelete(document.id)
      } catch (error) {
        onError('Failed to delete document')
        setDeleting(false)
      }
    }
  }

  return (
    <div className="document-card fade-in">
      <div className="document-header">
        <div className="document-icon">📄</div>
        <div className="document-info">
          <h3 className="document-title" title={document.originalName}>
            {document.originalName}
          </h3>
          <p className="document-date">
            Uploaded {formatTimeAgo(document.createdAt)}
          </p>
        </div>
      </div>

      <div className="document-details">
        <div className="detail-item">
          <span className="detail-label">Size:</span>
          <span className="detail-value">{formatFileSize(document.filesize)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Uploaded:</span>
          <span className="detail-value">{formatDate(document.createdAt)}</span>
        </div>
      </div>

      <div className="document-actions">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`action-button download-button ${downloading ? 'downloading' : ''}`}
        >
          {downloading ? (
            <>
              <span className="button-spinner"></span>
              Downloading...
            </>
          ) : (
            'Download'
          )}
        </button>
        
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`action-button delete-button ${deleting ? 'deleting' : ''}`}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

export default DocumentCard