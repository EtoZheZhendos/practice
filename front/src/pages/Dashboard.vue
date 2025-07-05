<template>
  <q-page class="dashboard-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1 class="page-title">Дашборд</h1>
          <p class="page-subtitle">Обзор ваших задач и проектов</p>
        </div>
        <div class="header-actions">
          <CommonButton
            label="Новая задача"
            icon="add"
            color="primary"
            variant="modern"
            @click="showCreateTaskDialog = true"
          />
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <CommonCard
        v-for="stat in statistics"
        :key="stat.title"
        variant="modern"
        hover
        class="stat-card"
      >
        <div class="stat-content">
          <div class="stat-icon" :style="{ background: stat.color }">
            <q-icon :name="stat.icon" color="white" />
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-change" :class="stat.changeType">
              {{ stat.change }}
            </div>
          </div>
        </div>
      </CommonCard>
    </div>

    <div class="dashboard-grid">
      <CommonCard variant="modern" class="dashboard-card tasks-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="task" class="title-icon" />
              Последние задачи
            </h3>
            <q-btn
              flat
              round
              dense
              icon="more_vert"
              class="card-menu-btn"
            />
          </div>
        </template>

        <div class="tasks-toggle">
          <q-btn-toggle
            v-model="tasksViewMode"
            :options="[
              { label: 'Все задачи', value: 'all' },
              { label: 'Назначенные мне', value: 'assigned' }
            ]"
            color="primary"
            toggle-color="accent"
            unelevated
            class="q-mb-md"
          />
        </div>

        <div class="tasks-list">
          <CommonTable
            :rows="displayedTasks"
            :columns="columns"
            :loading="tasksStore.isLoading"
            :search-text="searchText"
            search-placeholder="Поиск по задачам..."
            @search="handleSearch"
            @edit="handleEdit"
            @delete="handleDelete"
            tableClass="common-table--darkglass"
          >
          </CommonTable>
        </div>

        <template #footer>
          <div class="card-footer">
            <q-btn
              flat
              color="primary"
              label="Посмотреть все"
              icon="arrow_forward"
            />
          </div>
        </template>
      </CommonCard>

      <CommonCard variant="modern" class="dashboard-card projects-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="folder" class="title-icon" />
              Проекты
            </h3>
            <q-btn
              flat
              round
              dense
              icon="add"
              class="add-project-btn"
              @click="showCreateProjectDialog = true"
            />
          </div>
        </template>

        <div class="projects-list">
          <div
            v-for="project in projects"
            :key="project.id"
            class="project-item"
            @click="selectProject(project)"
          >
            <div class="project-info">
              <div class="project-name">{{ project.name }}</div>
              <div class="project-progress">
                <q-linear-progress
                  :value="project.progress"
                  :color="getProgressColor(project.progress)"
                  class="progress-bar"
                />
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
            </div>
            <div class="project-stats">
              <div class="stat">
                <q-icon name="task" size="sm" />
                <span>{{ project.taskCount }}</span>
              </div>
              <div class="stat">
                <q-icon name="person" size="sm" />
                <span>{{ project.memberCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </CommonCard>

      <CommonCard variant="modern" class="dashboard-card activity-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="timeline" class="title-icon" />
              Активность
            </h3>
          </div>
        </template>

        <div class="activity-list">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-avatar">
              <q-avatar size="32px" :color="activity.color">
                <q-icon :name="activity.icon" color="white" />
              </q-avatar>
            </div>
            <div class="activity-content">
              <div class="activity-message">{{ activity.message }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </CommonCard>

      <CommonCard variant="modern" class="dashboard-card quick-actions-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="flash_on" class="title-icon" />
              Быстрые действия
            </h3>
          </div>
        </template>

        <div class="quick-actions-grid">
          <div
            v-for="action in quickActions"
            :key="action.title"
            class="quick-action-item"
            @click="action.handler"
          >
            <div class="action-icon" :style="{ background: action.color }">
              <q-icon :name="action.icon" color="white" />
            </div>
            <div class="action-title">{{ action.title }}</div>
          </div>
        </div>
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
            placeholder="Введите название задачи"
            variant="modern"
            :rules="[val => !!val || 'Название обязательно']"
          />
        </div>

        <div class="form-row">
          <CommonInput
            v-model="newTask.description"
            label="Описание"
            placeholder="Введите описание задачи"
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
            v-model="newTask.project"
            :options="projectOptions"
            label="Проект"
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
        </div>

        <div class="form-row">
          <CommonSelect
            v-model="newTask.assigneeIds"
            :options="assigneeOptions"
            label="Исполнители"
            variant="modern"
            multiple
          />
        </div>
      </CommonForm>

      <template #footer>
        <div class="dialog-footer">
          <q-btn
            flat
            label="Отмена"
            @click="showCreateTaskDialog = false"
          />
          <q-btn
            unelevated
            color="primary"
            label="Создать"
            :loading="creatingTask"
            @click="createTask"
          />
        </div>
      </template>
    </CommonDialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useTasksStore, useCategoriesStore, useProjectsStore, useUsersStore, useAuthStore } from 'src/stores'
import { CommonTable, CommonButton, CommonDialog, CommonForm, CommonInput, CommonSelect, CommonCard } from 'src/components/common'

const $q = useQuasar()
const tasksStore = useTasksStore()
const categoriesStore = useCategoriesStore()
const projectsStore = useProjectsStore()
const usersStore = useUsersStore()
const authStore = useAuthStore()

const showCreateTaskDialog = ref(false)
const showCreateProjectDialog = ref(false)
const creatingTask = ref(false)
const tasksViewMode = ref('all')
const searchText = ref('')

const columns = ref([
  {
    name: 'title',
    label: 'Название',
    field: 'title',
    align: 'left',
    sortable: true
  },
  {
    name: 'status',
    label: 'Статус',
    field: 'status',
    align: 'center',
    sortable: true
  },
  {
    name: 'priority',
    label: 'Приоритет',
    field: 'priority',
    align: 'center',
    sortable: true
  },
  {
    name: 'dueDate',
    label: 'Срок',
    field: 'dueDate',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Действия',
    field: 'actions',
    align: 'center',
    sortable: false
  }
])

const newTask = ref({
  title: '',
  description: '',
  priority: 2,
  project: null,
  dueDate: '',
  assigneeIds: []
})

const statistics = ref([
  {
    title: 'Всего задач',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: 'task',
    color: '#667eea'
  },
  {
    title: 'В работе',
    value: '8',
    change: '+5%',
    changeType: 'positive',
    icon: 'pending',
    color: '#f093fb'
  },
  {
    title: 'Завершено',
    value: '12',
    change: '+8%',
    changeType: 'positive',
    icon: 'check_circle',
    color: '#4facfe'
  },
  {
    title: 'Просрочено',
    value: '4',
    change: '-2%',
    changeType: 'negative',
    icon: 'warning',
    color: '#43e97b'
  }
])

const recentTasks = ref([
  {
    id: 1,
    title: 'Обновить документацию API',
    status: 'in_progress',
    priority: 'high',
    project: 'Backend Development',
    dueDate: '2024-01-15'
  },
  {
    id: 2,
    title: 'Исправить баг в форме входа',
    status: 'completed',
    priority: 'medium',
    project: 'Frontend Development',
    dueDate: '2024-01-10'
  },
  {
    id: 3,
    title: 'Добавить новые тесты',
    status: 'pending',
    priority: 'low',
    project: 'Testing',
    dueDate: '2024-01-20'
  },
  {
    id: 4,
    title: 'Оптимизировать базу данных',
    status: 'in_progress',
    priority: 'high',
    project: 'Backend Development',
    dueDate: '2024-01-12'
  }
])

const projects = ref([
  {
    id: 1,
    name: 'Backend Development',
    progress: 75,
    taskCount: 12,
    memberCount: 4
  },
  {
    id: 2,
    name: 'Frontend Development',
    progress: 60,
    taskCount: 8,
    memberCount: 3
  },
  {
    id: 3,
    name: 'Testing',
    progress: 30,
    taskCount: 6,
    memberCount: 2
  },
  {
    id: 4,
    name: 'Documentation',
    progress: 90,
    taskCount: 4,
    memberCount: 1
  }
])

const activities = ref([
  {
    id: 1,
    message: 'Новая задача создана: "Обновить документацию API"',
    time: '5 минут назад',
    icon: 'add',
    color: 'primary'
  },
  {
    id: 2,
    message: 'Задача "Исправить баг в форме" завершена',
    time: '1 час назад',
    icon: 'check_circle',
    color: 'positive'
  },
  {
    id: 3,
    message: 'Новый участник добавлен в проект "Frontend Development"',
    time: '2 часа назад',
    icon: 'person_add',
    color: 'info'
  },
  {
    id: 4,
    message: 'Комментарий к задаче "Оптимизировать БД"',
    time: '3 часа назад',
    icon: 'comment',
    color: 'warning'
  }
])

const quickActions = ref([
  {
    title: 'Новая задача',
    icon: 'add_task',
    color: '#667eea',
    handler: () => showCreateTaskDialog.value = true
  },
  {
    title: 'Новый проект',
    icon: 'create_new_folder',
    color: '#f093fb',
    handler: () => showCreateProjectDialog.value = true
  },
  {
    title: 'Отчет',
    icon: 'analytics',
    color: '#4facfe',
    handler: () => $q.notify({ message: 'Отчеты будут добавлены позже' })
  },
  {
    title: 'Настройки',
    icon: 'settings',
    color: '#43e97b',
    handler: () => $q.notify({ message: 'Настройки будут добавлены позже' })
  }
])

const priorityOptions = [
  { label: 'Низкий', value: 1 },
  { label: 'Средний', value: 2 },
  { label: 'Высокий', value: 3 },
  { label: 'Очень высокий', value: 4 },
  { label: 'Критический', value: 5 }
]

const projectOptions = computed(() => {
  return projects.value.map(project => ({
    label: project.name,
    value: project.id
  }))
})

const assigneeOptions = computed(() =>
  usersStore.users.map(user => ({
    label: user.firstName + ' ' + user.lastName + ' (' + user.email + ')',
    value: user.id
  }))
)

const createTask = async () => {
  if (!newTask.value.title) {
    console.log('Введите название задачи')
    return
  }

  creatingTask.value = true

  try {
    const payload = {
      ...newTask.value,
      priority: Number(newTask.value.priority),
      projectIds: newTask.value.project ? [newTask.value.project] : [],
      assigneeIds: newTask.value.assigneeIds
    }
    delete payload.project
    console.log('Creating task with payload:', payload)
    console.log('Assignee IDs:', newTask.value.assigneeIds)

    const res = await tasksStore.createTask(payload)
    if (res.success) {
      console.log('Задача успешно создана!')
      console.log('Created task:', res.task)
      showCreateTaskDialog.value = false
      resetNewTask()
      // Перезагружаем задачи, чтобы получить обновленные данные с assignments
      await tasksStore.fetchTasks()
    } else {
      console.log('Ошибка при создании задачи', res.error)
    }
  } catch (error) {
    console.log('Ошибка при создании задачи', error)
  } finally {
    creatingTask.value = false
  }
}

const resetNewTask = () => {
  newTask.value = {
    title: '',
    description: '',
    priority: 2,
    project: null,
    dueDate: '',
    assigneeIds: []
  }
}

const editTask = (task) => {
  $q.notify({
    message: `Редактирование задачи: ${task.title}`,
    type: 'info'
  })
}

const deleteTask = (task) => {
  $q.dialog({
    title: 'Подтверждение удаления',
    message: `Вы уверены, что хотите удалить задачу "${task.title}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: 'Задача удалена'
    })
  })
}

const selectProject = (project) => {
  $q.notify({
    message: `Выбран проект: ${project.name}`,
    type: 'info'
  })
}

const getProgressColor = (progress) => {
  if (progress >= 80) return 'positive'
  if (progress >= 60) return 'warning'
  return 'negative'
}

onMounted(async () => {
  await usersStore.fetchUsers()
  await tasksStore.fetchTasks()
  await categoriesStore.fetchCategories()
  await projectsStore.fetchProjects()
})

const displayedTasks = computed(() => {
  if (tasksViewMode.value === 'assigned') {
    // Фильтруем задачи на фронтенде по assigneeIds
    const currentUserId = authStore.user?.id
    console.log('Current userId:', currentUserId)

    const filteredTasks = tasksStore.tasks.filter(task => {
      // Извлекаем assigneeIds из ассоциации assignments
      const assigneeIds = task.assignments ? task.assignments.map(a => a.userId) : []

      console.log(`Task ${task.id} assignments:`, task.assignments)
      console.log(`Task ${task.id} assigneeIds:`, assigneeIds)
      return assigneeIds.includes(currentUserId)
    })

    console.log('Filtered assigned tasks:', filteredTasks)
    return filteredTasks
  }
  return tasksStore.tasks
})

watch(tasksViewMode, (mode) => {
  console.log('Switched to mode:', mode)
  if (mode === 'assigned') {
    const currentUserId = authStore.user?.id
    console.log('Current userId:', currentUserId)
    console.log('All tasks count:', tasksStore.tasks.length)

    const assignedTasks = tasksStore.tasks.filter(task => {
      const assigneeIds = task.assignments ? task.assignments.map(a => a.userId) : []
      return assigneeIds.includes(currentUserId)
    })

    console.log('Assigned tasks count:', assignedTasks.length)
    console.log('Assigned tasks:', assignedTasks)
  }
})

const handleSearch = (text) => {
  tasksStore.searchTasks(text)
}

const handleEdit = (task) => {
  editTask(task)
}

const handleDelete = (task) => {
  deleteTask(task)
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem;

  // Page Header
  .page-header {
    margin-bottom: 2rem;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;

      .header-title {
        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #f1f1f1;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.025em;
        }

        .page-subtitle {
          font-size: 1.125rem;
          color: #b3b8c5;
          margin: 0;
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

  // Statistics Grid
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 1rem;

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

          .q-icon {
            font-size: 1.5rem;
          }
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #f1f1f1;
            line-height: 1;
            margin-bottom: 0.25rem;
          }

          .stat-title {
            font-size: 0.875rem;
            color: #b3b8c5;
            margin-bottom: 0.25rem;
          }

          .stat-change {
            font-size: 0.75rem;
            font-weight: 600;

            &.positive {
              color: #48bb78;
            }

            &.negative {
              color: #f56565;
            }
          }
        }
      }
    }
  }

  // Dashboard Grid
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;

    .dashboard-card {
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

        .card-menu-btn,
        .add-project-btn {
          color: #b3b8c5;
          transition: all 0.3s ease;

          &:hover {
            color: #667eea;
            transform: scale(1.1);
          }
        }
      }

      // Tasks Card
      &.tasks-card {
        .tasks-list {
          background: rgba(30, 32, 48, 0.55);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          backdrop-filter: blur(12px);
          padding: 1.5rem 1rem 1rem 1rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(255,255,255,0.08);
          transition: box-shadow 0.2s;

          .q-table {
            background: transparent;
            border-radius: 14px;
            color: #f1f1f1;
            box-shadow: none;
            border: none;
            font-size: 1rem;
            th, td {
              background: transparent;
              border-bottom: 1px solid rgba(255,255,255,0.06);
            }
            th {
              color: #b3b8c5;
              font-weight: 600;
              font-size: 1rem;
              background: rgba(255,255,255,0.03);
            }
            td {
              color: #f1f1f1;
            }
            tr {
              transition: background 0.2s;
              &:hover {
                background: rgba(255,255,255,0.04);
              }
            }
            .q-table__bottom, .q-table__top {
              background: transparent;
            }
            .q-table__pagination {
              .q-btn, .q-btn--flat {
                background: rgba(255,255,255,0.08);
                color: #fff;
                border-radius: 8px;
                margin: 0 2px;
                transition: background 0.2s;
                &:hover {
                  background: rgba(255,255,255,0.18);
                }
              }
            }
          }
          // Поиск
          .q-field {
            background: rgba(255,255,255,0.08);
            border-radius: 8px;
            color: #fff;
            margin-bottom: 1rem;
            .q-field__control {
              color: #fff;
            }
            input {
              color: #fff;
            }
          }
        }

        // Кнопки переключения
        .tasks-toggle {
          margin-bottom: 1rem;
          .q-btn-toggle {
            background: rgba(255,255,255,0.08);
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(31,38,135,0.10);
            .q-btn {
              color: #fff;
              font-weight: 600;
              border-radius: 8px;
              transition: background 0.2s, color 0.2s;
              &.q-btn--active {
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                box-shadow: 0 2px 8px rgba(118,75,162,0.15);
              }
            }
          }
        }
        // Кнопка "Посмотреть все"
        .card-footer {
          .q-btn {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border-radius: 10px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(118,75,162,0.15);
            transition: background 0.2s;
            &:hover {
              background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
            }
          }
        }
      }

      // Projects Card
      &.projects-card {
        .projects-list {
          .project-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            margin-bottom: 0.75rem;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(226, 232, 240, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(255, 255, 255, 0.8);
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .project-info {
              flex: 1;

              .project-name {
                font-weight: 600;
                color: #f1f1f1;
                margin-bottom: 0.5rem;
              }

              .project-progress {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                .progress-bar {
                  flex: 1;
                  height: 6px;
                  border-radius: 3px;
                }

                .progress-text {
                  font-size: 0.75rem;
                  font-weight: 600;
                  color: #b3b8c5;
                  min-width: 40px;
                }
              }
            }

            .project-stats {
              display: flex;
              gap: 1rem;

              .stat {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.875rem;
                color: #b3b8c5;

                .q-icon {
                  color: #667eea;
                }
              }
            }
          }
        }
      }

      // Activity Card
      &.activity-card {
        .activity-list {
          .activity-item {
            display: flex;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(226, 232, 240, 0.5);

            &:last-child {
              border-bottom: none;
            }

            .activity-avatar {
              flex-shrink: 0;
            }

            .activity-content {
              flex: 1;

              .activity-message {
                font-size: 0.875rem;
                color: #f1f1f1;
                margin-bottom: 0.25rem;
                line-height: 1.4;
              }

              .activity-time {
                font-size: 0.75rem;
                color: #b3b8c5;
              }
            }
          }
        }
      }

      // Quick Actions Card
      &.quick-actions-card {
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;

          .quick-action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            padding: 1.5rem;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(226, 232, 240, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(255, 255, 255, 0.8);
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .action-icon {
              width: 48px;
              height: 48px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

              .q-icon {
                font-size: 1.25rem;
              }
            }

            .action-title {
              font-size: 0.875rem;
              font-weight: 600;
              color: #f1f1f1;
              text-align: center;
            }
          }
        }
      }
    }
  }

  // Form styles
  .form-row {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // Dialog footer
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(226, 232, 240, 0.5);

    .q-btn {
      font-weight: 600;
      text-transform: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
    }
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .dashboard-page {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);

    .page-header .header-content .header-title {
      .page-title {
        color: #f7fafc;
      }

      .page-subtitle {
        color: #a0aec0;
      }
    }

    .stats-grid .stat-card .stat-content .stat-info {
      .stat-value {
        color: #f7fafc;
      }

      .stat-title {
        color: #a0aec0;
      }
    }

    .dashboard-grid .dashboard-card {
      .card-header .card-title {
        color: #f7fafc;
      }

      &.tasks-card .tasks-list {
        background: rgba(45, 55, 72, 0.5);
        border-color: rgba(74, 85, 104, 0.5);
      }

      &.projects-card .projects-list .project-item {
        background: rgba(45, 55, 72, 0.5);
        border-color: rgba(74, 85, 104, 0.5);
      }

      &.activity-card .activity-list .activity-item {
        border-bottom-color: rgba(74, 85, 104, 0.5);
      }

      &.quick-actions-card .quick-actions-grid .quick-action-item {
        background: rgba(45, 55, 72, 0.5);
        border-color: rgba(74, 85, 104, 0.5);
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem;

    .page-header .header-content {
      flex-direction: column;
      align-items: flex-start;

      .header-title .page-title {
        font-size: 2rem;
      }
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .dashboard-grid {
      grid-template-columns: 1fr;

      .dashboard-card.quick-actions-card .quick-actions-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-page {
  animation: fadeInUp 0.6s ease-out;
}

// Loading states
.dashboard-page.loading {
  opacity: 0.7;
  pointer-events: none;
}

// Focus states
.dashboard-page .dashboard-grid .dashboard-card:focus-within {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

// Hover effects
.dashboard-page .dashboard-grid .dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

// Стилизация таблицы задач под dark/glassmorphism
.q-table,
.q-table__container,
.q-table th,
.q-table td {
  background: transparent !important;
  color: #f1f1f1 !important;
  border-color: rgba(255,255,255,0.08) !important;
}
.q-table,
.q-table__container {
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  overflow: hidden;
}
.q-table th {
  color: #b3b8c5 !important;
  font-weight: 600;
  font-size: 1rem;
  background: rgba(255,255,255,0.03) !important;
  border-bottom: 1px solid rgba(255,255,255,0.08) !important;
}
.q-table td {
  color: #f1f1f1 !important;
}
.q-table tbody tr {
  transition: background 0.2s;
}
.q-table tbody tr:hover {
  background: rgba(255,255,255,0.04) !important;
}
.q-table__bottom,
.q-table__top {
  background: transparent !important;
  color: #b3b8c5 !important;
}
.q-table__pagination .q-btn,
.q-table__pagination .q-btn--flat {
  background: rgba(255,255,255,0.08) !important;
  color: #fff !important;
  border-radius: 8px;
  margin: 0 2px;
  transition: background 0.2s;
}
.q-table__pagination .q-btn:hover {
  background: rgba(255,255,255,0.18) !important;
}
.q-table__top .q-field {
  background: rgba(255,255,255,0.08) !important;
  border-radius: 8px;
  color: #fff !important;
}
.q-table__top .q-field__control,
.q-table__top input {
  color: #fff !important;
}
</style>
