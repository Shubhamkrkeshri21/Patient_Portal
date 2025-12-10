import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const apiService = {
  uploadDocument: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return axiosInstance.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getDocuments: async () => {
    return axiosInstance.get('/documents')
  },

  downloadDocument: async (id, filename) => {
    const response = await axiosInstance.get(`/documents/${id}/download`, {
      responseType: 'blob',
    })
    
    const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  deleteDocument: async (id) => {
    return axiosInstance.delete(`/documents/${id}`)
  },
}

export default apiService