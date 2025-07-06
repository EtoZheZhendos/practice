import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null
  }),

  getters: {
    getCategories: (state) => state.categories,
    getCurrentCategory: (state) => state.currentCategory,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,

    // Категории для селекта
    categoriesOptions: (state) => {
      return state.categories.map(category => ({
        label: category.name,
        value: category.id,
        color: category.color
      }))
    }
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/categories')
        this.categories = response.data
        return { success: true, categories: response.data }
      } catch (error) {
        console.error('Fetch categories error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch categories'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchCategory(id) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/categories/${id}`)
        this.currentCategory = response.data
        return { success: true, category: response.data }
      } catch (error) {
        console.error('Fetch category error:', error)
        this.error = error.response?.data?.message || 'Failed to fetch category'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createCategory(categoryData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/categories', categoryData)
        this.categories.push(response.data)

        return { success: true, category: response.data }
      } catch (error) {
        console.error('Create category error:', error)
        this.error = error.response?.data?.message || 'Failed to create category'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id, categoryData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.patch(`/categories/${id}`, categoryData)

        // Обновляем категорию в списке
        const index = this.categories.findIndex(category => category.id === id)
        if (index !== -1) {
          this.categories[index] = response.data
        }

        // Обновляем текущую категорию если она открыта
        if (this.currentCategory && this.currentCategory.id === id) {
          this.currentCategory = response.data
        }

        return { success: true, category: response.data }
      } catch (error) {
        console.error('Update category error:', error)
        this.error = error.response?.data?.message || 'Failed to update category'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id) {
      this.loading = true
      this.error = null

      try {
        await api.delete(`/categories/${id}`)

        // Удаляем категорию из списка
        this.categories = this.categories.filter(category => category.id !== id)

        // Очищаем текущую категорию если она была удалена
        if (this.currentCategory && this.currentCategory.id === id) {
          this.currentCategory = null
        }

        return { success: true }
      } catch (error) {
        console.error('Delete category error:', error)
        this.error = error.response?.data?.message || 'Failed to delete category'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    setCurrentCategory(category) {
      this.currentCategory = category
    },

    clearCurrentCategory() {
      this.currentCategory = null
    },

    clearError() {
      this.error = null
    }
  }
})
