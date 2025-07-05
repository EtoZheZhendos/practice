import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    filters: {
      status: null,
      priority: null,
      assignee: null,
      category: null,
      project: null
    }
  }),

  getters: {
    getTasks: (state) => state.tasks,
    getCurrentTask: (state) => state.currentTask,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getFilters: (state) => state.filters,

    // Фильтрованные задачи
    filteredTasks: (state) => {
      let filtered = [...state.tasks]

      if (state.filters.status) {
        filtered = filtered.filter(task => task.status === state.filters.status)
      }
      if (state.filters.priority) {
        filtered = filtered.filter(task => task.priority === state.filters.priority)
      }
      if (state.filters.assignee) {
        filtered = filtered.filter(task => task.assignee_id === state.filters.assignee)
      }
      if (state.filters.category) {
        filtered = filtered.filter(task =>
          task.categories && task.categories.some(cat => cat.id === state.filters.category)
        )
      }
      if (state.filters.project) {
        filtered = filtered.filter(task => task.project_id === state.filters.project)
      }

      return filtered
    },

    // Задачи по статусу
    tasksByStatus: (state) => {
      const grouped = {}
      state.tasks.forEach(task => {
        if (!grouped[task.status]) {
          grouped[task.status] = []
        }
        grouped[task.status].push(task)
      })
      return grouped
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/tasks')
        this.tasks = response.data
        return { success: true, tasks: response.data }
      } catch (error) {
        console.error('Fetch tasks error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch tasks'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchTask(id) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/tasks/${id}`)
        this.currentTask = response.data
        return { success: true, task: response.data }
      } catch (error) {
        console.error('Fetch task error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch task'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/tasks', taskData)
        this.tasks.unshift(response.data)
        return { success: true, task: response.data }
      } catch (error) {
        console.error('Create task error:', error)
        this.error = error.response?.data?.message || 'Failed to create task'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateTask(id, taskData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.patch(`/tasks/${id}`, taskData)

        // Обновляем задачу в списке
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }

        // Обновляем текущую задачу если она открыта
        if (this.currentTask && this.currentTask.id === id) {
          this.currentTask = response.data
        }

        return { success: true, task: response.data }
      } catch (error) {
        console.error('Update task error:', error)
        this.error = error.response?.data?.message || 'Failed to update task'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteTask(id) {
      this.loading = true
      this.error = null

      try {
        await api.delete(`/tasks/${id}`)

        // Удаляем задачу из списка
        this.tasks = this.tasks.filter(task => task.id !== id)

        // Очищаем текущую задачу если она была удалена
        if (this.currentTask && this.currentTask.id === id) {
          this.currentTask = null
        }

        return { success: true }
      } catch (error) {
        console.error('Delete task error:', error)
        this.error = error.response?.data?.message || 'Failed to delete task'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        status: null,
        priority: null,
        assignee: null,
        category: null,
        project: null
      }
    },

    setCurrentTask(task) {
      this.currentTask = task
    },

    clearCurrentTask() {
      this.currentTask = null
    },

    clearError() {
      this.error = null
    },

    async fetchAssignedTasks() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/tasks/assigned')
        return { success: true, tasks: response.data }
      } catch (error) {
        console.error('Fetch assigned tasks error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch assigned tasks'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Поиск задач
    searchTasks(searchText) {
      if (!searchText || searchText.trim() === '') {
        return this.tasks
      }

      const searchLower = searchText.toLowerCase().trim()
      return this.tasks.filter(task => {
        return (
          task.title?.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.status?.toLowerCase().includes(searchLower) ||
          task.priority?.toString().includes(searchLower)
        )
      })
    }
  }
})
