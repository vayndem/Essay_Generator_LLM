import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

// Create an Axios instance
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const uploadFile = async (file, taxonomy, number) => {
  const formData = new FormData()
  formData.append('file', file)

  const endpoint = `/upload/${taxonomy}/${number}`

  try {
    const response = await apiClient.post(endpoint, formData)
    return response.data
  } catch (error) {
    throw error.response?.data?.error || 'An error occurred while uploading the file.'
  }
}

export default apiClient
