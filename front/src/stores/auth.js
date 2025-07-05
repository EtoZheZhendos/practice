import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated && !!state.token
  },

  actions: {
    async login(credentials) {
      try {
        console.log('Login attempt with:', credentials)
        const response = await api.post('/auth/login', credentials)
        const { access_token, user } = response.data

        console.log('Login successful:', { access_token: !!access_token, user: !!user })

        this.token = access_token
        this.user = user
        this.isAuthenticated = true

        localStorage.setItem('token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

        console.log('Auth state after login:', {
          token: !!this.token,
          user: !!this.user,
          isAuthenticated: this.isAuthenticated,
          isLoggedIn: this.isLoggedIn
        })

        return { success: true, user }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Login failed'
        }
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/auth/register', userData)
        const { access_token, user } = response.data

        this.token = access_token
        this.user = user
        this.isAuthenticated = true

        localStorage.setItem('token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

        return { success: true, user }
      } catch (error) {
        console.error('Register error:', error)
        return {
          success: false,
          error: error.response?.data?.message || 'Registration failed'
        }
      }
    },

    async getProfile() {
      try {
        console.log('Getting profile...')
        this.isLoading = true
        const response = await api.get('/auth/profile')
        this.user = response.data
        this.isAuthenticated = true

        console.log('Profile loaded:', {
          user: !!this.user,
          isAuthenticated: this.isAuthenticated,
          isLoggedIn: this.isLoggedIn
        })

        return { success: true, user: response.data }
      } catch (error) {
        console.error('Get profile error:', error)
        this.logout()
        return { success: false, error: 'Failed to get profile' }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },

    async initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.isLoading = true
        this.token = token
        this.isAuthenticated = true
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Попытка загрузить профиль пользователя
        try {
          await this.getProfile()
        } catch (error) {
          // Если токен недействителен, очищаем состояние
          console.error('Invalid token, logging out:', error)
          this.logout()
        } finally {
          this.isLoading = false
        }
      }
    }
  }
})
