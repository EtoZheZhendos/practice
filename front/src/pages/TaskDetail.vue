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
        <div class="task-main-center-container">
          <div class="task-main-dark-bg">
            <div class="task-info-auth-card no-bg">
              <div class="task-info-header">
                <q-icon name="info" size="md" color="primary" class="info-icon" />
                <span>Основная информация</span>
              </div>
              <div v-if="!isEditing" class="task-info-list">
                <div class="task-info-row"><span class="info-label">Название</span><span class="info-value">{{ task.title }}</span></div>
                <div class="task-info-row"><span class="info-label">Описание</span><span class="info-value description-text">{{ task.description || 'Описание не указано' }}</span></div>
                <div class="task-info-row"><span class="info-label">Статус</span><span class="info-value"><span :class="getStatusColor(task.status)" class="status-badge">{{ getStatusText(task.status) }}</span></span></div>
                <div class="task-info-row"><span class="info-label">Приоритет</span><span class="info-value"><span :class="getPriorityColor(task.priority)" class="priority-badge">{{ getPriorityText(task.priority) }}</span></span></div>
                <div class="task-info-row"><span class="info-label">Срок выполнения</span><span class="info-value">{{ task.dueDate ? formatDate(task.dueDate) : 'Не указан' }}</span></div>
                <div class="task-info-row"><span class="info-label">Создана</span><span class="info-value">{{ formatDate(task.createdAt) }}</span></div>
              </div>
              <form v-else class="task-info-list task-edit-form" @submit.prevent="saveTask">
                <div class="task-info-row"><span class="info-label">Название</span><span class="info-value"><CommonInput v-model="editForm.title" label="Название" variant="modern" :rules="[val => !!val || 'Название обязательно']" class="edit-input" /></span></div>
                <div class="task-info-row"><span class="info-label">Описание</span><span class="info-value"><CommonInput v-model="editForm.description" label="Описание" type="textarea" variant="modern" class="edit-textarea" /></span></div>
                <div class="task-info-row"><span class="info-label">Статус</span><span class="info-value"><CommonSelect v-model="editForm.status" :options="statusOptions" label="Статус" variant="modern" class="edit-select" /></span></div>
                <div class="task-info-row"><span class="info-label">Приоритет</span><span class="info-value"><CommonSelect v-model="editForm.priority" :options="priorityOptions" label="Приоритет" variant="modern" class="edit-select" /></span></div>
                <div class="task-info-row"><span class="info-label">Срок выполнения</span><span class="info-value"><CommonInput v-model="editForm.dueDate" label="Срок выполнения" type="date" variant="modern" class="edit-input" /></span></div>
                <div class="task-edit-actions">
                  <q-btn color="positive" label="Сохранить" icon="save" type="submit" :loading="saving" class="q-mr-sm" />
                  <q-btn flat color="grey" label="Отмена" icon="close" @click="cancelEditing" />
                </div>
              </form>
            </div>
            <div v-if="task.assignments && task.assignments.length" class="task-user-card styled-user-card">
              <div v-if="!isEditing">
                <div class="user-header">
                  <q-icon name="person" size="md" color="primary" class="user-icon" />
                  <span>Исполнитель</span>
                </div>
                <div class="user-info-row">
                  <q-avatar size="48px" color="primary"><q-icon name="person" color="white" /></q-avatar>
                  <div class="user-details">
                    <div class="user-name">{{ task.assignments[0].user?.firstName }} {{ task.assignments[0].user?.lastName }}</div>
                    <div class="user-email">{{ task.assignments[0].user?.email }}</div>
                    <div class="user-date">Назначен: {{ formatDate(task.assignments[0].assignedAt) }}</div>
                  </div>
                </div>
              </div>
              <form v-else class="user-edit-form" @submit.prevent>
                <div class="user-header">
                  <q-icon name="person" size="md" color="primary" class="user-icon" />
                  <span>Исполнитель</span>
                </div>
                <CommonSelect v-model="editForm.assigneeId" :options="availableUsers" label="Исполнитель" variant="modern" class="edit-select" />
              </form>
            </div>
          </div>
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
  dueDate: '',
  assigneeId: null
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
      dueDate: task.value.dueDate ? task.value.dueDate.split('T')[0] : '',
      assigneeId: task.value.assignments && task.value.assignments.length ? task.value.assignments[0].userId : null
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
    const payload = { ...editForm.value }
    if (payload.assigneeId) {
      payload.assigneeIds = [payload.assigneeId]
      delete payload.assigneeId
    }
    const result = await tasksStore.updateTask(task.value.id, payload)
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

.task-main-center-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 70vh;
  width: 100%;
}
.task-main-dark-bg {
  background: rgba(20, 22, 34, 0.92);
  border-radius: 32px;
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.22);
  padding: 3.5rem 3.5rem 2.5rem 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.2rem;
  min-width: 420px;
  max-width: 540px;
  margin: 0 auto;
}
.task-info-auth-card.no-bg {
  background: none;
  box-shadow: none;
  padding: 0;
  margin-bottom: 0;
}
.styled-user-card {
  background: rgba(30, 32, 48, 0.98);
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.22);
  padding: 1.7rem 2.2rem;
  color: #fff;
  min-width: 320px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-header {
    display: flex;
    align-items: center;
    font-size: 1.13rem;
    font-weight: 600;
    margin-bottom: 1.3rem;
    color: #fff;
    .user-icon {
      margin-right: 0.75rem;
    }
  }
  .user-info-row {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.22rem;
      .user-name {
        font-weight: 600;
        font-size: 1.09rem;
      }
      .user-email {
        font-size: 0.99rem;
        color: #b3b8c5;
      }
      .user-date {
        font-size: 0.94rem;
        color: #b3b8c5;
      }
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

.task-info-auth-card {
  background: rgba(30, 32, 48, 0.92);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  padding: 2.2rem 2.7rem 1.7rem 2.7rem;
  margin-bottom: 2rem;
  color: #fff;
  min-width: 340px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  transition: box-shadow 0.25s, transform 0.25s;
  &:hover {
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.28);
    transform: translateY(-2px) scale(1.01);
  }
  .task-info-header {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #fff;
    .info-icon {
      margin-right: 0.85rem;
    }
  }
  .task-info-list {
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
  }
  .task-info-row {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: center;
    font-size: 1.12rem;
    padding: 0.2rem 0.1rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    &:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #b3b8c5;
      text-align: right;
      padding-right: 1.7rem;
      letter-spacing: 0.01em;
      font-size: 1.08rem;
      min-width: 120px;
      flex-shrink: 0;
    }
    .info-value {
      color: #fff;
      font-weight: 500;
      text-align: left;
      word-break: break-word;
      font-size: 1.11rem;
      padding-left: 0.5rem;
    }
    .description-text {
      font-style: italic;
      opacity: 0.85;
    }
  }
}
.task-user-card {
  background: rgba(30, 32, 48, 0.92);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  padding: 1.7rem 2.2rem;
  margin-bottom: 2rem;
  color: #fff;
  min-width: 340px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  transition: box-shadow 0.25s, transform 0.25s;
  &:hover {
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.28);
    transform: translateY(-2px) scale(1.01);
  }
  .user-header {
    display: flex;
    align-items: center;
    font-size: 1.13rem;
    font-weight: 600;
    margin-bottom: 1.3rem;
    color: #fff;
    .user-icon {
      margin-right: 0.75rem;
    }
  }
  .user-info-row {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.22rem;
      .user-name {
        font-weight: 600;
        font-size: 1.09rem;
      }
      .user-email {
        font-size: 0.99rem;
        color: #b3b8c5;
      }
      .user-date {
        font-size: 0.94rem;
        color: #b3b8c5;
      }
    }
  }
}

.task-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  .task-info-row {
    align-items: flex-start;
    .info-label {
      padding-top: 0.45rem;
    }
    .info-value {
      width: 100%;
      .edit-input, .edit-select, .edit-textarea {
        width: 100%;
        min-width: 180px;
        max-width: 260px;
      }
    }
  }
}
.task-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.1rem;
  margin-top: 1.5rem;
}

.user-edit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  .edit-select {
    width: 100%;
    min-width: 180px;
    max-width: 260px;
  }
}
</style>
