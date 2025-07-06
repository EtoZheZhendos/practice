<template>
  <q-page class="dashboard-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1 class="page-title">Дашборд</h1>
          <p class="page-subtitle">Обзор задач и проектов</p>
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats-section">
      <div class="stats-grid">
        <CommonCard variant="modern" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <q-icon name="task" size="2rem" color="primary" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ tasksStore.tasks.length }}</div>
              <div class="stat-label">Всего задач</div>
            </div>
          </div>
        </CommonCard>

        <CommonCard variant="modern" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <q-icon name="pending" size="2rem" color="warning" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ pendingTasks.length }}</div>
              <div class="stat-label">Ожидают</div>
            </div>
          </div>
        </CommonCard>

        <CommonCard variant="modern" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <q-icon name="play_arrow" size="2rem" color="info" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ inProgressTasks.length }}</div>
              <div class="stat-label">В работе</div>
            </div>
          </div>
        </CommonCard>

        <CommonCard variant="modern" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <q-icon name="check_circle" size="2rem" color="positive" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ completedTasks.length }}</div>
              <div class="stat-label">Завершено</div>
            </div>
          </div>
        </CommonCard>
      </div>
    </div>

    <!-- Основной контент -->
    <div class="content-section">
      <div class="content-grid">
        <!-- Последние задачи -->
        <CommonCard variant="modern" class="dashboard-card tasks-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <q-icon name="task" class="title-icon" />
                Последние задачи
              </h3>
              <q-btn
                flat
                color="primary"
                label="Посмотреть все"
                @click="$router.push('/tasks')"
              />
            </div>
          </template>

          <div v-if="recentTasks.length === 0" class="empty-state">
            <q-icon name="task_alt" size="3rem" color="grey-4" />
            <p>Нет задач для отображения</p>
          </div>

          <div v-else class="tasks-list">
            <div
              v-for="task in recentTasks"
              :key="task.id"
              class="task-item"
              @click="handleTaskClick(task)"
            >
              <div class="task-info">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta">
                  <span :class="getStatusColor(task.status)" class="task-status">
                    {{ getStatusText(task.status) }}
                  </span>
                  <span :class="getPriorityColor(task.priority)" class="task-priority">
                    {{ getPriorityText(task.priority) }}
                  </span>
                </div>
              </div>
              <div class="task-actions">
                <q-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  color="primary"
                  @click.stop="handleTaskClick(task)"
                />
              </div>
            </div>
          </div>
        </CommonCard>

        <!-- Активные проекты -->
        <CommonCard variant="modern" class="dashboard-card projects-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <q-icon name="folder" class="title-icon" />
                Активные проекты
              </h3>
            </div>
          </template>

          <div v-if="activeProjects.length === 0" class="empty-state">
            <q-icon name="folder_open" size="3rem" color="grey-4" />
            <p>Нет активных проектов</p>
          </div>

          <div v-else class="projects-list">
            <div
              v-for="project in activeProjects"
              :key="project.id"
              class="project-item"
            >
              <div class="project-info">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-description">{{ project.description }}</div>
                <div class="project-meta">
                  <span class="project-status">{{ getProjectStatusText(project.status) }}</span>
                </div>
              </div>
            </div>
          </div>
        </CommonCard>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useTasksStore, useCategoriesStore, useProjectsStore, useUsersStore, useAuthStore } from 'src/stores'
import { CommonTable, CommonButton, CommonDialog, CommonForm, CommonInput, CommonSelect, CommonCard } from 'src/components/common'

const $q = useQuasar()
const router = useRouter()
const tasksStore = useTasksStore()
const categoriesStore = useCategoriesStore()
const projectsStore = useProjectsStore()
const usersStore = useUsersStore()
const authStore = useAuthStore()

// Загрузка данных
const loadData = async () => {
  await Promise.all([
    tasksStore.fetchTasks(),
    categoriesStore.fetchCategories(),
    projectsStore.fetchProjects(),
    usersStore.fetchUsers()
  ])
}

// Вычисляемые свойства
const pendingTasks = computed(() =>
  tasksStore.tasks.filter(task => task.status === 'pending')
)

const inProgressTasks = computed(() =>
  tasksStore.tasks.filter(task => task.status === 'in_progress')
)

const completedTasks = computed(() =>
  tasksStore.tasks.filter(task => task.status === 'completed')
)

const recentTasks = computed(() =>
  tasksStore.tasks.slice(0, 5) // Показываем только 5 последних задач
)

const activeProjects = computed(() =>
  projectsStore.projects.filter(project => project.status === 'active').slice(0, 3)
)

// Методы
const handleTaskClick = (task) => {
  router.push(`/task/${task.id}`)
}

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
  const priorityMap = {
    1: 'Низкий',
    2: 'Средний',
    3: 'Высокий',
    4: 'Очень высокий',
    5: 'Критический'
  }
  return priorityMap[priority] || 'Неизвестно'
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

const getProjectStatusText = (status) => {
  const statusMap = {
    'active': 'Активный',
    'completed': 'Завершен',
    'archived': 'Архивный'
  }
  return statusMap[status] || status
}

// Загрузка данных при монтировании
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 32px 0 0 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;

  .page-header {
    margin-bottom: 32px;
    .header-content {
      .header-title {
        .page-title {
          color: #fff;
          margin: 0 0 8px 0;
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .page-subtitle {
          color: rgba(255,255,255,0.85);
          margin: 0;
          font-size: 1.15rem;
          font-weight: 400;
        }
      }
    }
  }

  .stats-section {
    margin-bottom: 32px;
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 32px;
      .stat-card {
        background: rgba(255,255,255,0.13);
        border-radius: 20px;
        box-shadow: 0 6px 32px 0 rgba(102,126,234,0.10);
        padding: 28px 32px;
        transition: box-shadow 0.2s;
        .stat-content {
          display: flex;
          align-items: center;
          gap: 20px;
          .stat-icon {
            background: rgba(102,126,234,0.12);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            .q-icon {
              font-size: 2.2rem;
            }
          }
          .stat-info {
            .stat-value {
              font-size: 2.2rem;
              font-weight: 800;
              color: #fff;
              line-height: 1;
            }
            .stat-label {
              color: #e0e7ff;
              font-size: 1rem;
              margin-top: 6px;
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  .content-section {
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
      .dashboard-card {
        background: rgba(255,255,255,0.10);
        border-radius: 20px;
        box-shadow: 0 4px 24px 0 rgba(102,126,234,0.10);
        padding: 24px 24px 16px 24px;
        margin-bottom: 0;
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          .card-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.25rem;
            font-weight: 700;
            color: #fff;
            margin: 0;
            .title-icon {
              color: #667eea;
            }
          }
        }
        .empty-state {
          text-align: center;
          padding: 2rem 0;
          color: #a0aec0;
          p {
            margin: 1rem 0 0 0;
            font-size: 1rem;
          }
        }
        .tasks-list {
          .task-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            transition: background 0.2s;
            cursor: pointer;
            &:last-child { border-bottom: none; }
            &:hover {
              background: rgba(102, 126, 234, 0.08);
              border-radius: 12px;
            }
            .task-info {
              flex: 1;
              .task-title {
                font-weight: 700;
                color: #fff;
                margin-bottom: 4px;
                font-size: 1.08rem;
              }
              .task-meta {
                display: flex;
                gap: 10px;
                font-size: 0.85rem;
                .task-status, .task-priority {
                  padding: 2px 12px;
                  border-radius: 12px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  font-size: 0.8rem;
                }
                .task-status {
                  background: rgba(102, 126, 234, 0.13);
                  color: #a5b4fc;
                }
                .task-priority {
                  background: rgba(237, 137, 54, 0.13);
                  color: #fdba74;
                }
              }
            }
            .task-actions {
              flex-shrink: 0;
              .q-btn {
                color: #a5b4fc;
                &:hover { color: #fff; background: #667eea; }
              }
            }
          }
        }
        .projects-list {
          .project-item {
            padding: 16px 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            &:last-child { border-bottom: none; }
            .project-info {
              .project-name {
                font-weight: 700;
                color: #fff;
                margin-bottom: 4px;
                font-size: 1.08rem;
              }
              .project-description {
                color: #e0e7ff;
                font-size: 0.95rem;
                margin-bottom: 8px;
                line-height: 1.4;
              }
              .project-meta {
                .project-status {
                  font-size: 0.8rem;
                  color: #a5b4fc;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 900px) {
  .dashboard-page {
    .stats-section .stats-grid { gap: 16px; }
    .content-section .content-grid { gap: 16px; }
    .dashboard-card { padding: 16px !important; }
  }
}
</style>
