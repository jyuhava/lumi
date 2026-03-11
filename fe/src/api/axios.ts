import axios from 'axios'

const api = axios.create({
    baseURL: 'https://lumine.syntaf.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.group('API Error Details')
        console.error('URL:', error.config?.url)
        console.error('Method:', error.config?.method?.toUpperCase())
        console.error('Status:', error.response?.status)
        console.error('Data:', error.response?.data)

        if (error.response?.status === 422) {
            console.error('Validation Errors:', error.response.data.errors)
        }
        console.groupEnd()

        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
