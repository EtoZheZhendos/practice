<template>
  <q-page class="task-detail-page">
    <div class="task-detail-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <q-btn
              flat
              round
              dense
              icon="arrow_back"
              class="back-btn"
              @click="$router.go(-1)"
            />
            <div class="title-content">
              <h1 class="page-title">{{ task?.title || 'Загрузка...' }}</h1>
              <p class="page-subtitle">Детали задачи</p>
            </div>
          </div>
          <div class="header-actions">
            <q-btn
              v-if="!isEditing"
              color="primary"
              icon="edit"
              label="Редактировать"
              @click="startEditing"
            />
            <q-btn
              v-else
              color="positive"
              icon="save"
              label="Сохранить"
              :loading="saving"
              @click="saveTask"
            />
            <q-btn
              v-if="isEditing"
              flat
              color="grey"
              icon="close"
              label="Отмена"
              @click="cancelEditing"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <q-spinner-dots size="50px" color="primary" />
        <p class="loading-text">Загрузка задачи...</p>
      </div>

      <div v-else-if="task" class="task-content">
        <div class="task-flex-grid">
          <!-- Основная информация -->
          <CommonCard variant="modern" class="task-card main-info-card">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <q-icon name="info" class="title-icon" />
                  Основная информация
                </h3>
              </div>
            </template>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">Название</label>
                <div v-if="!isEditing" class="info-value">{{ task.title }}</div>
                <CommonInput v-else v-model="editForm.title" label="Название" variant="modern" :rules="[val => !!val || 'Название обязательно']" class="edit-input" />
              </div>
              <div class="info-item">
                <label class="info-label">Описание</label>
                <div v-if="!isEditing" class="info-value description-text">{{ task.description || 'Описание не указано' }}</div>
                <CommonInput v-else v-model="editForm.description" label="Описание" type="textarea" variant="modern" class="edit-textarea" />
              </div>
              <div class="info-item">
                <label class="info-label">Статус</label>
                <div v-if="!isEditing" class="info-value">
                  <span :class="getStatusColor(task.status)" class="status-badge">{{ getStatusText(task.status) }}</span>
                </div>
                <CommonSelect v-else v-model="editForm.status" :options="statusOptions" label="Статус" variant="modern" class="edit-select" />
              </div>
              <div class="info-item">
                <label class="info-label">Приоритет</label>
                <div v-if="!isEditing" class="info-value">
                  <span :class="getPriorityColor(task.priority)" class="priority-badge">{{ getPriorityText(task.priority) }}</span>
                </div>
                <CommonSelect v-else v-model="editForm.priority" :options="priorityOptions" label="Приоритет" variant="modern" class="edit-select" />
              </div>
              <div class="info-item">
                <label class="info-label">Срок выполнения</label>
                <div v-if="!isEditing" class="info-value">{{ task.dueDate ? formatDate(task.dueDate) : 'Не указан' }}</div>
                <CommonInput v-else v-model="editForm.dueDate" label="Срок выполнения" type="date" variant="modern" class="edit-input" />
              </div>
              <div class="info-item">
                <label class="info-label">Создана</label>
                <div class="info-value">{{ formatDate(task.createdAt) }}</div>
              </div>
            </div>
            <div v-if="isEditing" class="card-actions" style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
              <q-btn color="positive" label="Сохранить" icon="save" @click="saveTask" :loading="saving" />
              <q-btn flat color="grey" label="Отмена" icon="close" @click="cancelEditing" />
            </div>
          </CommonCard>

          <!-- Назначения -->
          <CommonCard variant="modern" class="task-card assignments-card">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <q-icon name="people" class="title-icon" />
                  Назначения
                </h3>
                <q-btn v-if="isEditing" flat round dense icon="add" class="add-assignee-btn" @click="showAssignDialog = true" />
              </div>
            </template>
            <div class="assignments-list">
              <div v-for="assignment in task.assignments" :key="assignment.id" class="assignment-item">
                <div class="assignment-info">
                  <q-avatar size="32px" color="primary"><q-icon name="person" color="white" /></q-avatar>
                  <div class="assignment-details">
                    <div class="assignee-name">{{ assignment.user?.firstName }} {{ assignment.user?.lastName }}</div>
                    <div class="assignment-date">Назначен: {{ formatDate(assignment.assignedAt) }}</div>
                  </div>
                </div>
                <q-btn v-if="isEditing" flat round dense icon="remove" color="negative" size="sm" @click="removeAssignment(assignment.id)" />
              </div>
              <div v-if="!task.assignments?.length" class="no-assignments">
                <q-icon name="people_outline" size="2rem" color="grey-4" />
                <span class="no-assignments-text">Нет назначений</span>
              </div>
            </div>
            <CommonDialog v-model="showAssignDialog" title="Добавить назначение" @confirm="addAssignment">
              <CommonSelect v-model="newAssignment" :options="availableUsers" placeholder="Выберите пользователя" label="Пользователь" />
            </CommonDialog>
          </CommonCard>

          <!-- Категории -->
          <CommonCard variant="modern" class="task-card categories-card">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <q-icon name="category" class="title-icon" />
                  Категории
                </h3>
                <q-btn
                  v-if="isEditing"
                  flat
                  round
                  dense
                  icon="add"
                  class="add-category-btn"
                  @click="showCategoryDialog = true"
                />
              </div>
            </template>

            <div class="categories-list">
              <div
                v-for="category in task.categories"
                :key="category.id"
                class="category-item"
              >
                <q-chip
                  :color="category.color || 'primary'"
                  text-color="white"
                  :label="category.name"
                  removable
                  @remove="isEditing && removeCategory(category.id)"
                />
              </div>
              <div v-if="!task.categories?.length" class="no-categories">
                <q-icon name="category_outline" size="2rem" color="grey-4" />
                <span class="no-categories-text">Нет категорий</span>
              </div>
            </div>
          </CommonCard>

          <!-- Проекты -->
          <CommonCard variant="modern" class="task-card projects-card">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <q-icon name="folder" class="title-icon" />
                  Проекты
                </h3>
                <q-btn v-if="isEditing" flat round dense icon="add" class="add-project-btn" @click="showProjectDialog = true" />
              </div>
            </template>
            <div class="projects-list">
              <div v-for="project in task.projects" :key="project.id" class="project-item">
                <div class="project-info">
                  <q-icon name="folder" color="primary" />
                  <span class="project-name">{{ project.name }}</span>
                </div>
                <q-btn v-if="isEditing" flat round dense icon="remove" color="negative" size="sm" @click="removeProject(project.id)" />
              </div>
              <div v-if="!task.projects?.length" class="no-projects">
                <q-icon name="folder_outline" size="2rem" color="grey-4" />
                <span class="no-projects-text">Нет проектов</span>
              </div>
            </div>
            <CommonDialog v-model="showProjectDialog" title="Добавить проект" @confirm="addProject">
              <CommonSelect v-model="newProject" :options="availableProjects" placeholder="Выберите проект" label="Проект" />
            </CommonDialog>
          </CommonCard>
        </div>
      </div>

      <!-- Диалоги -->
      <CommonDialog
        v-model="showCategoryDialog"
        title="Добавить категорию"
        @confirm="addCategory"
      >
        <CommonSelect
          v-model="newCategory"
          :options="availableCategories"
          placeholder="Выберите категорию"
          label="Категория"
        />
      </CommonDialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useTasksStore } from 'src/stores/tasks'
import { useUsersStore } from 'src/stores/users'
import { useCategoriesStore } from 'src/stores/categories'
import { useProjectsStore } from 'src/stores/projects'
import CommonInput from 'src/components/common/CommonInput.vue'
import CommonSelect from 'src/components/common/CommonSelect.vue'
import CommonCard from 'src/components/common/CommonCard.vue'
import CommonDialog from 'src/components/common/CommonDialog.vue'

const route = useRoute()
const router = useRouter()
const tasksStore = useTasksStore()
const usersStore = useUsersStore()
const categoriesStore = useCategoriesStore()
const projectsStore = useProjectsStore()

const task = ref(null)
const loading = ref(true)
const saving = ref(false)
const isEditing = ref(false)

// Диалоги
const showAssignDialog = ref(false)
const showCategoryDialog = ref(false)
const showProjectDialog = ref(false)

// Новые значения для добавления
const newAssignment = ref(null)
const newCategory = ref(null)
const newProject = ref(null)

// Форма редактирования
const editForm = ref({
  title: '',
  description: '',
  status: '',
  priority: null,
  dueDate: ''
})

// Опции для селектов
const statusOptions = [
  { label: 'Ожидает', value: 'pending' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'Завершено', value: 'completed' }
]

const priorityOptions = [
  { label: 'Низкий', value: 1 },
  { label: 'Средний', value: 2 },
  { label: 'Высокий', value: 3 },
  { label: 'Очень высокий', value: 4 },
  { label: 'Критический', value: 5 }
]

// Доступные пользователи, категории и проекты
const availableUsers = computed(() =>
  usersStore.users.map(user => ({
    label: `${user.firstName} ${user.lastName} (${user.email})`,
    value: user.id
  }))
)

const availableCategories = computed(() =>
  categoriesStore.categories.map(category => ({
    label: category.name,
    value: category.id
  }))
)

const availableProjects = computed(() =>
  projectsStore.projects.map(project => ({
    label: project.name,
    value: project.id
  }))
)

// Загрузка данных
const loadTask = async () => {
  loading.value = true
  try {
    const taskId = parseInt(route.params.id)
    const result = await tasksStore.fetchTask(taskId)
    if (result.success) {
      task.value = result.task
      initEditForm()
    } else {
      console.error('Failed to load task:', result.error)
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error loading task:', error)
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}

const initEditForm = () => {
  if (task.value) {
    editForm.value = {
      title: task.value.title,
      description: task.value.description || '',
      status: task.value.status,
      priority: task.value.priority,
      dueDate: task.value.dueDate ? task.value.dueDate.split('T')[0] : ''
    }
  }
}

// Редактирование
const startEditing = () => {
  isEditing.value = true
  initEditForm()
}

const cancelEditing = () => {
  isEditing.value = false
  initEditForm()
}

const saveTask = async () => {
  saving.value = true
  try {
    const result = await tasksStore.updateTask(task.value.id, editForm.value)
    if (result.success) {
      task.value = result.task
      isEditing.value = false
      Notify.create({
        message: 'Задача успешно обновлена',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: result.error,
        title: 'Ошибка',
        type: 'negative',
        icon: 'error',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error updating task:', error)
    Notify.create({
      message: 'Ошибка при обновлении задачи',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  } finally {
    saving.value = false
  }
}

// Назначения
const addAssignment = async () => {
  if (!newAssignment.value) return

  try {
    const result = await tasksStore.updateTask(task.value.id, {
      assigneeIds: [...(task.value.assignments?.map(a => a.userId) || []), newAssignment.value]
    })
    if (result.success) {
      task.value = result.task
      newAssignment.value = null
      showAssignDialog.value = false
      Notify.create({
        message: 'Назначение добавлено',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: result.error,
        title: 'Ошибка',
        type: 'negative',
        icon: 'error',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error adding assignment:', error)
    Notify.create({
      message: 'Ошибка при добавлении назначения',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

const removeAssignment = async (assignmentId) => {
  try {
    const currentAssigneeIds = task.value.assignments?.map(a => a.userId) || []
    const updatedAssigneeIds = currentAssigneeIds.filter(id =>
      !task.value.assignments.find(a => a.id === assignmentId && a.userId === id)
    )

    const result = await tasksStore.updateTask(task.value.id, {
      assigneeIds: updatedAssigneeIds
    })
    if (result.success) {
      task.value = result.task
      Notify.create({
        message: 'Назначение удалено',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: result.error,
        title: 'Ошибка',
        type: 'negative',
        icon: 'error',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error removing assignment:', error)
    Notify.create({
      message: 'Ошибка при удалении назначения',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

// Категории
const addCategory = async () => {
  if (!newCategory.value) return

  try {
    const result = await tasksStore.updateTask(task.value.id, {
      categoryIds: [...(task.value.categories?.map(c => c.id) || []), newCategory.value]
    })
    if (result.success) {
      task.value = result.task
      newCategory.value = null
      showCategoryDialog.value = false
      Notify.create({
        message: 'Категория добавлена',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: result.error,
        title: 'Ошибка',
        type: 'negative',
        icon: 'error',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error adding category:', error)
    Notify.create({
      message: 'Ошибка при добавлении категории',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

const removeCategory = async (categoryId) => {
  try {
    const currentCategoryIds = task.value.categories?.map(c => c.id) || []
    const updatedCategoryIds = currentCategoryIds.filter(id => id !== categoryId)

    const result = await tasksStore.updateTask(task.value.id, {
      categoryIds: updatedCategoryIds
    })
    if (result.success) {
      task.value = result.task
      Notify.create({
        message: 'Категория удалена',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: result.error,
        title: 'Ошибка',
        type: 'negative',
        icon: 'error',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error removing category:', error)
    Notify.create({
      message: 'Ошибка при удалении категории',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

// Проекты
const addProject = async () => {
  if (!newProject.value) return

  try {
    const result = await tasksStore.updateTask(task.value.id, {
      projectIds: [...(task.value.projects?.map(p => p.id) || []), newProject.value]
    })
    if (result.success) {
      task.value = result.task
      newProject.value = null
      showProjectDialog.value = false
      Notify.create({
        message: 'Проект добавлен',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: result.error,
        title: 'Ошибка',
        type: 'negative',
        icon: 'error',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error adding project:', error)
    Notify.create({
      message: 'Ошибка при добавлении проекта',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

const removeProject = async (projectId) => {
  try {
    const currentProjectIds = task.value.projects?.map(p => p.id) || []
    const updatedProjectIds = currentProjectIds.filter(id => id !== projectId)

    const result = await tasksStore.updateTask(task.value.id, {
      projectIds: updatedProjectIds
    })
    if (result.success) {
      task.value = result.task
      Notify.create({
        message: 'Проект удален',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
    } else {
      Notify.create({
        message: result.error,
        title: 'Ошибка',
        type: 'negative',
        icon: 'error',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Error removing project:', error)
    Notify.create({
      message: 'Ошибка при удалении проекта',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

// Утилиты
const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Ожидает',
    'in_progress': 'В работе',
    'completed': 'Завершено'
  }
  return statusMap[status] || status
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'text-grey-6'
    case 'in_progress': return 'text-blue-6'
    case 'completed': return 'text-green-6'
    default: return 'text-grey-6'
  }
}

const getPriorityText = (priority) => {
  const option = priorityOptions.find(opt => opt.value === priority)
  return option ? option.label : 'Неизвестно'
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 1: return 'text-grey-6'
    case 2: return 'text-blue-6'
    case 3: return 'text-orange-6'
    case 4: return 'text-red-6'
    case 5: return 'text-red-8'
    default: return 'text-grey-6'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Загрузка данных при монтировании
onMounted(async () => {
  await Promise.all([
    usersStore.fetchUsers(),
    categoriesStore.fetchCategories(),
    projectsStore.fetchProjects()
  ])
  await loadTask()
})

// Следим за изменением ID в роуте
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadTask()
  }
})
</script>

<style lang="scss" scoped>
.task-detail-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 0;
}

.task-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header {
  margin-bottom: 0;
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    .header-title {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      .back-btn {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
      }
      .title-content {
        .page-title {
          color: #f1f1f1;
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }
        .page-subtitle {
          color: #b3b8c5;
          margin: 4px 0 0 0;
          font-size: 1rem;
        }
      }
    }
    .header-actions {
      display: flex;
      gap: 12px;
      .q-btn {
        font-weight: 600;
        text-transform: none;
        border-radius: 12px;
        padding: 0.75rem 1.5rem;
      }
    }
  }
}

.task-content {
  width: 100%;
  .task-flex-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: flex-start;
    justify-content: flex-start;
    > .task-card {
      flex: 1 1 340px;
      min-width: 320px;
      max-width: 420px;
      background: rgba(30, 32, 48, 0.55);
      border-radius: 18px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 0;
    }
  }
}

.status-badge,
.priority-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.priority-badge {
  background: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}
</style>
