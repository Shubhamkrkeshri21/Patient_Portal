export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase()
}

export const isValidPDF = (file) => {
  const allowedExtensions = ['pdf']
  const allowedMimeTypes = ['application/pdf']
  
  const extension = getFileExtension(file.name)
  const isValidExtension = allowedExtensions.includes(extension)
  const isValidMimeType = allowedMimeTypes.includes(file.type)
  
  return isValidExtension && isValidMimeType
}