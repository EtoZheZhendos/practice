<template>
  <q-page class="tasks-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1 class="page-title">Задачи</h1>
          <p class="page-subtitle">Управление задачами и проектами</p>
        </div>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="add"
            label="Новая задача"
            @click="showCreateTaskDialog = true"
          />
        </div>
      </div>
    </div>

    <div class="tasks-toggle-section">
      <q-btn-toggle
        v-model="viewMode"
        :options="toggleOptions"
        color="primary"
        toggle-color="accent"
        unelevated
        class="tasks-toggle"
      />
    </div>

    <div class="filters-section">
      <CommonCard variant="modern" class="filters-card">
        <div class="filters-grid">
          <div class="filter-item">
            <CommonInput
              v-model="filters.search"
              label="Поиск"
              placeholder="Поиск по названию или описанию..."
              icon="search"
              inputClass="text-white"
              @update:model-value="applyFilters"
            />
          </div>
          <div class="filter-item">
            <CommonSelect
              v-model="filters.status"
              :options="statusOptions"
              label="Статус"
              placeholder="Все статусы"
              clearable
              @update:model-value="applyFilters"
            />
          </div>
          <div class="filter-item">
            <CommonSelect
              v-model="filters.priority"
              :options="priorityOptions"
              label="Приоритет"
              placeholder="Все приоритеты"
              clearable
              @update:model-value="applyFilters"
            />
          </div>
          <div class="filter-item">
            <CommonSelect
              v-model="filters.assignee"
              :options="assigneeOptions"
              label="Исполнитель"
              placeholder="Все исполнители"
              clearable
              @update:model-value="applyFilters"
            />
          </div>
          <div class="filter-item">
            <q-btn
              flat
              color="grey"
              icon="clear"
              label="Очистить фильтры"
              @click="clearFilters"
            />
          </div>
        </div>
      </CommonCard>
    </div>

    <div class="tasks-section">
      <CommonCard variant="modern" class="tasks-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="task" class="title-icon" />
              Список задач
            </h3>
          </div>
        </template>

        <CommonTable
          :rows="displayedTasks"
          :columns="columns"
          :loading="tasksStore.isLoading"
          :search-text="filters.search"
          search-placeholder="Поиск по задачам..."
          @search="handleSearch"
          @edit="handleEdit"
          @delete="handleDelete"
          @row-click="handleRowClick"
          tableClass="common-table--darkglass"
        >
          <template #body-cell-title="{ row }">
            <span>{{ row.title }}</span>
          </template>
          <template #body-cell-status="{ row }">
            <q-badge :class="['status-badge', getStatusColor(row.status)]">
              {{ getStatusText(row.status) }}
            </q-badge>
          </template>
          <template #body-cell-priority="{ row }">
            <q-badge :class="['priority-badge', getPriorityColor(row.priority)]">
              {{ getPriorityText(row.priority) }}
            </q-badge>
          </template>
          <template #body-cell-assignments="{ row }">
            <div class="assignees-list">
              <q-avatar
                v-for="assignment in Array.isArray(row.assignments) ? row.assignments : []"
                :key="assignment.id"
                size="24px"
                color="primary"
                class="assignee-avatar"
                :title="assignment.user ? `${assignment.user.firstName} ${assignment.user.lastName}` : ''"
              >
                <q-icon name="person" color="white" size="12px" />
              </q-avatar>
              <span v-if="!row.assignments || !row.assignments.length" class="no-assignees">
                Нет назначений
              </span>
            </div>
          </template>
          <template #body-cell-dueDate="{ row }">
            <span :class="getDueDateClass(row.dueDate)">
              {{ formatDate(row.dueDate) }}
            </span>
          </template>
          <template #body-cell-createdBy="{ row }">
            <span>
              {{ row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : '' }}
            </span>
          </template>
          <template #body-cell-actions="{ row }">
            <q-btn
              icon="edit"
              size="sm"
              flat
              round
              dense
              color="primary"
              @click.stop="handleEdit(row)"
            />
            <q-btn
              icon="delete"
              size="sm"
              flat
              round
              dense
              color="negative"
              @click.stop="handleDelete(row)"
            />
          </template>
        </CommonTable>
      </CommonCard>
    </div>

    <CommonDialog
      v-model="showCreateTaskDialog"
      title="Создать новую задачу"
      variant="modern"
      size="lg"
    >
      <CommonForm variant="modern" @submit="createTask">
        <div class="form-row">
          <CommonInput
            v-model="newTask.title"
            label="Название задачи"
            variant="modern"
            :rules="[val => !!val || 'Название обязательно']"
          />
        </div>

        <div class="form-row">
          <CommonInput
            v-model="newTask.description"
            label="Описание"
            type="textarea"
            variant="modern"
          />
        </div>

        <div class="form-row">
          <CommonSelect
            v-model="newTask.priority"
            :options="priorityOptions"
            label="Приоритет"
            variant="modern"
          />
          <CommonSelect
            v-model="newTask.status"
            :options="statusOptions"
            label="Статус"
            variant="modern"
          />
        </div>

        <div class="form-row">
          <CommonInput
            v-model="newTask.dueDate"
            label="Срок выполнения"
            type="date"
            variant="modern"
          />
          <CommonSelect
            v-model="newTask.assigneeIds"
            :options="assigneeOptions"
            label="Исполнители"
            multiple
            variant="modern"
          />
        </div>

        <div class="form-row">
          <CommonSelect
            v-model="newTask.projectIds"
            :options="projectOptions"
            label="Проекты"
            multiple
            variant="modern"
          />
          <CommonSelect
            v-model="newTask.categoryIds"
            :options="categoryOptions"
            label="Категории"
            multiple
            variant="modern"
          />
        </div>

        <div class="form-actions">
          <q-btn type="submit" label="Создать" color="primary" class="create-btn" />
        </div>
      </CommonForm>
    </CommonDialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useTasksStore } from 'src/stores/tasks'
import { useUsersStore } from 'src/stores/users'
import { useCategoriesStore } from 'src/stores/categories'
import { useProjectsStore } from 'src/stores/projects'
import { useAuthStore } from 'src/stores/auth'
import CommonInput from 'components/common/CommonInput.vue'
import CommonSelect from 'components/common/CommonSelect.vue'
import CommonCard from 'components/common/CommonCard.vue'
import CommonTable from 'components/common/CommonTable.vue'
import CommonDialog from 'components/common/CommonDialog.vue'
import CommonForm from 'components/common/CommonForm.vue'

const router = useRouter()
const tasksStore = useTasksStore()
const usersStore = useUsersStore()
const categoriesStore = useCategoriesStore()
const projectsStore = useProjectsStore()
const authStore = useAuthStore()

// Состояние
const showCreateTaskDialog = ref(false)

// Переключатель "Все задачи / Назначенные мне"
const viewMode = ref('all')
const toggleOptions = [
  { label: 'Все задачи', value: 'all' },
  { label: 'Назначенные мне', value: 'assigned' }
]

// Фильтры
const filters = ref({
  search: '',
  status: null,
  priority: null,
  assignee: null
})

// Новая задача
const newTask = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 1,
  dueDate: '',
  assigneeIds: [],
  projectIds: [],
  categoryIds: []
})

// Колонки таблицы
const columns = [
  { name: 'title', label: 'Название', field: 'title', align: 'left', sortable: true },
  { name: 'status', label: 'Статус', field: 'status', align: 'center', sortable: true },
  { name: 'priority', label: 'Приоритет', field: 'priority', align: 'center', sortable: true },
  { name: 'assignments', label: 'Исполнители', field: 'assignments', align: 'center' },
  { name: 'dueDate', label: 'Срок', field: 'dueDate', align: 'center', sortable: true },
  { name: 'createdBy', label: 'Создатель', field: 'createdBy', align: 'left' },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'center' }
]

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

const assigneeOptions = computed(() =>
  usersStore.users.map(user => ({
    label: `${user.firstName} ${user.lastName} (${user.email})`,
    value: user.id
  }))
)

const projectOptions = computed(() =>
  projectsStore.projects.map(project => ({
    label: project.name,
    value: project.id
  }))
)

const categoryOptions = computed(() =>
  categoriesStore.categories.map(category => ({
    label: category.name,
    value: category.id
  }))
)

// Отображаемые задачи с учетом переключателя
const displayedTasks = computed(() => {
  let tasks = tasksStore.tasks

  if (viewMode.value === 'assigned') {
    const currentUserId = authStore.user?.id
    tasks = tasks.filter(task =>
      task.assignments && task.assignments.some(a => a.userId === currentUserId)
    )
  }

  // Применение фильтров
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    tasks = tasks.filter(task =>
      task.title?.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower)
    )
  }

  if (filters.value.status) {
    tasks = tasks.filter(task => task.status === filters.value.status)
  }

  if (filters.value.priority) {
    tasks = tasks.filter(task => task.priority === filters.value.priority)
  }

  if (filters.value.assignee) {
    tasks = tasks.filter(task =>
      task.assignments && task.assignments.some(assignment => assignment.userId === filters.value.assignee)
    )
  }

  return tasks
})

// Методы
const loadTasks = async () => {
  await tasksStore.fetchTasks()
}

const applyFilters = () => {
  // Фильтры применяются автоматически через computed
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: null,
    priority: null,
    assignee: null
  }
}

const handleSearch = (text) => {
  filters.value.search = text
}

const handleEdit = (task) => {
  router.push(`/task/${task.id}`)
}

const handleDelete = async (task) => {
  try {
    const result = await tasksStore.deleteTask(task.id)
    if (result.success) {
      Notify.create({
        message: 'Задача успешно удалена',
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
    console.error('Error deleting task:', error)
    Notify.create({
      message: 'Ошибка при удалении задачи',
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

const handleRowClick = (task) => {
  router.push(`/task/${task.id}`)
}

const createTask = async () => {
  if (!newTask.value.title) {
    Notify.create({
      message: 'Введите название задачи',
      title: 'Предупреждение',
      type: 'warning',
      icon: 'warning',
      position: 'top-right'
    })
    return
  }

  try {
    const payload = {
      ...newTask.value,
      priority: Number(newTask.value.priority),
      projectIds: newTask.value.projectIds || [],
      categoryIds: newTask.value.categoryIds || [],
      assigneeIds: newTask.value.assigneeIds || []
    }

    const result = await tasksStore.createTask(payload)
    if (result.success) {
      Notify.create({
        message: 'Задача успешно создана',
        title: 'Успех',
        type: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      })
      showCreateTaskDialog.value = false
      newTask.value = {
        title: '',
        description: '',
        status: 'pending',
        priority: 1,
        dueDate: '',
        assigneeIds: [],
        projectIds: [],
        categoryIds: []
      }
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
    console.error('Error creating task:', error)
    Notify.create({
      message: 'Ошибка при создании задачи',
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
  if (!dateString) return 'Не указан'
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const getDueDateClass = (dateString) => {
  if (!dateString) return 'text-grey-6'
  const dueDate = new Date(dateString)
  const today = new Date()
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-red-6' // Просрочено
  if (diffDays <= 3) return 'text-orange-6' // Скоро срок
  return 'text-grey-6' // В норме
}

// Загрузка данных при монтировании
onMounted(async () => {
  await Promise.all([
    usersStore.fetchUsers(),
    categoriesStore.fetchCategories(),
    projectsStore.fetchProjects(),
    loadTasks()
  ])
})
</script>

<style lang="scss" scoped>
.tasks-page {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;

  .page-header {
    margin-bottom: 24px;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;

      .header-title {
        .page-title {
          color: white;
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.8);
          margin: 4px 0 0 0;
          font-size: 1rem;
        }
      }

      .header-actions {
        .q-btn {
          font-weight: 600;
          text-transform: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
        }
      }
    }
  }

  .tasks-toggle-section {
    margin-bottom: 24px;
    display: flex;
    justify-content: flex-end;
    .tasks-toggle {
      background: rgba(255,255,255,0.13);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(102,126,234,0.10);
      .q-btn {
        font-weight: 600;
        border-radius: 12px;
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        color: #667eea;
        &.q-btn--active {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(118,75,162,0.15);
        }
      }
    }
  }

  .filters-section {
    margin-bottom: 24px;

    .filters-card {
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        align-items: end;

        .filter-item {
          .q-btn {
            width: 100%;
          }
        }
      }
    }
  }

  .tasks-section {
    .tasks-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .card-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f1f1;
          margin: 0;

          .title-icon {
            color: #667eea;
          }
        }
      }
    }
  }

  .assignees-list {
    display: flex;
    align-items: center;
    gap: 4px;

    .assignee-avatar {
      border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .no-assignees {
      color: #a0aec0;
      font-size: 0.875rem;
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

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .create-btn {
    margin-top: 1rem;
    width: 100%;
    color: #fff !important;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
    font-weight: 600;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(102,126,234,0.10);
  }
}
</style>
