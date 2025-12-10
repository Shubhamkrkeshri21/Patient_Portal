import React, { useState } from 'react'
import './UploadForm.css'
import { apiService as api } from '../services/api.jsx'

const UploadForm = ({ onUploadSuccess, onError }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        onError('Please select a PDF file')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        onError('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        onError('Please drop a PDF file')
        return
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        onError('File size must be less than 10MB')
        return
      }
      setFile(droppedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      onError('Please select a file to upload')
      return
    }

    setUploading(true)
    
    try {
      const response = await api.uploadDocument(file)
      
      if (response.success) {
        onUploadSuccess(response.document)
        setFile(null)
        e.target.reset()
      } else {
        onError(response.error || 'Upload failed')
      }
    } catch (error) {
      onError('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="file-input"
        />
        
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-icon">
            {uploading ? (
              <div className="upload-spinner"></div>
            ) : (
              <span>📄</span>
            )}
          </div>
          
          <div className="upload-text">
            {uploading ? (
              <p className="uploading-text">Uploading...</p>
            ) : file ? (
              <>
                <p className="file-name">{file.name}</p>
                <p className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <p className="upload-title">Choose a PDF file or drag & drop</p>
                <p className="upload-subtitle">PDF up to 10MB</p>
              </>
            )}
          </div>
        </label>
      </div>

      <div className="upload-actions">
        <button
          type="submit"
          disabled={!file || uploading}
          className={`upload-button ${(!file || uploading) ? 'disabled' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
        
        {file && !uploading && (
          <button
            type="button"
            onClick={() => setFile(null)}
            className="cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default UploadForm