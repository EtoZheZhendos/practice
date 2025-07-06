import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null
  }),

  getters: {
    getProjects: (state) => state.projects,
    getCurrentProject: (state) => state.currentProject,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,

    // Проекты для селекта
    projectsOptions: (state) => {
      return state.projects.map(project => ({
        label: project.name,
        value: project.id,
        description: project.description
      }))
    },

    // Активные проекты
    activeProjects: (state) => {
      return state.projects.filter(project => project.status !== 'completed')
    },

    // Проекты по статусу
    projectsByStatus: (state) => {
      const grouped = {}
      state.projects.forEach(project => {
        if (!grouped[project.status]) {
          grouped[project.status] = []
        }
        grouped[project.status].push(project)
      })
      return grouped
    }
  },

  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/projects')
        this.projects = response.data
        return { success: true, projects: response.data }
      } catch (error) {
        console.error('Fetch projects error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch projects'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchProject(id) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/projects/${id}`)
        this.currentProject = response.data
        return { success: true, project: response.data }
      } catch (error) {
        console.error('Fetch project error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch project'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createProject(projectData) {
      this.loading = true
      this.error = null
      const $q = useQuasar()

      try {
        const response = await api.post('/projects', projectData)
        this.projects.push(response.data)

        $q.notify({
          type: 'positive',
          message: 'Проект успешно создан',
          icon: 'check_circle',
          position: 'top-right'
        })

        return { success: true, project: response.data }
      } catch (error) {
        console.error('Create project error:', error)
        this.error = error.response?.data?.message || 'Failed to create project'

        $q.notify({
          type: 'negative',
          message: this.error,
          icon: 'error',
          position: 'top-right'
        })

        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateProject(id, projectData) {
      this.loading = true
      this.error = null
      const $q = useQuasar()

      try {
        const response = await api.patch(`/projects/${id}`, projectData)

        // Обновляем проект в списке
        const index = this.projects.findIndex(project => project.id === id)
        if (index !== -1) {
          this.projects[index] = response.data
        }

        // Обновляем текущий проект если он открыт
        if (this.currentProject && this.currentProject.id === id) {
          this.currentProject = response.data
        }

        $q.notify({
          type: 'positive',
          message: 'Проект успешно обновлен',
          icon: 'check_circle',
          position: 'top-right'
        })

        return { success: true, project: response.data }
      } catch (error) {
        console.error('Update project error:', error)
        this.error = error.response?.data?.message || 'Failed to update project'

        $q.notify({
          type: 'negative',
          message: this.error,
          icon: 'error',
          position: 'top-right'
        })

        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteProject(id) {
      this.loading = true
      this.error = null
      const $q = useQuasar()

      try {
        await api.delete(`/projects/${id}`)

        // Удаляем проект из списка
        this.projects = this.projects.filter(project => project.id !== id)

        // Очищаем текущий проект если он был удален
        if (this.currentProject && this.currentProject.id === id) {
          this.currentProject = null
        }

        $q.notify({
          type: 'positive',
          message: 'Проект успешно удален',
          icon: 'check_circle',
          position: 'top-right'
        })

        return { success: true }
      } catch (error) {
        console.error('Delete project error:', error)
        this.error = error.response?.data?.message || 'Failed to delete project'

        $q.notify({
          type: 'negative',
          message: this.error,
          icon: 'error',
          position: 'top-right'
        })

        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    setCurrentProject(project) {
      this.currentProject = project
    },

    clearCurrentProject() {
      this.currentProject = null
    },

    clearError() {
      this.error = null
    }
  }
})
