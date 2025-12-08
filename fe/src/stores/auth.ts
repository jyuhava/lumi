import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

interface User {
    id: number
    name: string
    username: string
    email: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref(localStorage.getItem('token') || null)
    const isAuthenticated = ref(!!token.value)

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post('/login', { username, password })

            if (response.data.success) {
                token.value = response.data.data.token
                user.value = response.data.data.user
                isAuthenticated.value = true

                localStorage.setItem('token', response.data.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.data.user))

                return { success: true }
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const logout = async () => {
        try {
            await api.post('/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            token.value = null
            user.value = null
            isAuthenticated.value = false
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }

    const loadUser = () => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            user.value = JSON.parse(storedUser)
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        loadUser
    }
})
