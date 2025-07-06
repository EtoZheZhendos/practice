import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }),

  getters: {
    getUsers: (state) => state.users,
    getCurrentUser: (state) => state.currentUser,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,

    // Пользователи по роли
    usersByRole: (state) => {
      const grouped = {}
      state.users.forEach(user => {
        if (user.roles && user.roles.length > 0) {
          user.roles.forEach(role => {
            if (!grouped[role.name]) {
              grouped[role.name] = []
            }
            grouped[role.name].push(user)
          })
        }
      })
      return grouped
    },

    // Пользователи для селекта
    usersOptions: (state) => {
      return state.users.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
        email: user.email
      }))
    },

    // Активные пользователи
    activeUsers: (state) => {
      return state.users.filter(user => user.isActive)
    }
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/users')
        this.users = response.data
        return { success: true, users: response.data }
      } catch (error) {
        console.error('Fetch users error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch users'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchUser(id) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/users/${id}`)
        this.currentUser = response.data
        return { success: true, user: response.data }
      } catch (error) {
        console.error('Fetch user error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/users', userData)
        this.users.push(response.data)

        return { success: true, user: response.data }
      } catch (error) {
        console.error('Create user error:', error)
        this.error = error.response?.data?.message || 'Failed to create user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.patch(`/users/${id}`, userData)

        // Обновляем пользователя в списке
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = response.data
        }

        // Обновляем текущего пользователя если он открыт
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = response.data
        }

        return { success: true, user: response.data }
      } catch (error) {
        console.error('Update user error:', error)
        this.error = error.response?.data?.message || 'Failed to update user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id) {
      this.loading = true
      this.error = null

      try {
        await api.delete(`/users/${id}`)

        // Удаляем пользователя из списка
        this.users = this.users.filter(user => user.id !== id)

        // Очищаем текущего пользователя если он был удален
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = null
        }

        return { success: true }
      } catch (error) {
        console.error('Delete user error:', error)
        this.error = error.response?.data?.message || 'Failed to delete user'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    setCurrentUser(user) {
      this.currentUser = user
    },

    clearCurrentUser() {
      this.currentUser = null
    },

    clearError() {
      this.error = null
    }
  }
})
