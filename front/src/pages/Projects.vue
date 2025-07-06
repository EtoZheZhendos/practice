<template>
  <q-page class="projects-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1 class="page-title">Проекты</h1>
          <p class="page-subtitle">Управление проектами и командами</p>
        </div>
        <div class="header-actions">
          <q-btn
            color="primary"
            icon="add"
            label="Новый проект"
            class="create-project-btn"
            @click="showCreateProjectDialog = true"
          />
        </div>
      </div>
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
              v-model="filters.owner"
              :options="ownerOptions"
              label="Владелец"
              placeholder="Все владельцы"
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

    <div class="projects-section">
      <CommonCard variant="modern" class="projects-card">
        <template #header>
          <div class="card-header">
            <h3 class="card-title">
              <q-icon name="folder" class="title-icon" />
              Список проектов
            </h3>
          </div>
        </template>

        <CommonTable
          :rows="displayedProjects"
          :columns="columns"
          :loading="projectsStore.isLoading"
          :search-text="filters.search"
          search-placeholder="Поиск по проектам..."
          @search="handleSearch"
          @edit="handleEdit"
          @delete="handleDelete"
          @row-click="handleRowClick"
          tableClass="common-table--darkglass"
        >
          <template #cell-status="{ row }">
            <span :class="getStatusColor(row.status)" class="status-badge">
              {{ getStatusText(row.status) }}
            </span>
          </template>
          <template #cell-members="{ row }">
            <div class="members-list">
              <q-avatar
                v-for="member in row.members"
                :key="member.id"
                size="24px"
                color="primary"
                class="member-avatar"
              >
                <q-icon name="person" color="white" size="12px" />
              </q-avatar>
              <span v-if="!row.members?.length" class="no-members">
                Нет участников
              </span>
            </div>
          </template>
        </CommonTable>
      </CommonCard>
    </div>

    <!-- Диалог создания проекта -->
    <CommonDialog
      v-model="showCreateProjectDialog"
      title="Создать новый проект"
      variant="modern"
      size="lg"
    >
      <CommonForm variant="modern" @submit="createProject">
        <div class="form-row">
          <CommonInput
            v-model="newProject.name"
            label="Название проекта"
            variant="modern"
            :rules="[val => !!val || 'Название обязательно']"
          />
        </div>
        <div class="form-row">
          <CommonInput
            v-model="newProject.description"
            label="Описание"
            type="textarea"
            variant="modern"
          />
        </div>
        <div class="form-row">
          <CommonSelect
            v-model="newProject.status"
            :options="statusOptions"
            label="Статус"
            variant="modern"
          />
          <CommonSelect
            v-model="newProject.memberIds"
            :options="ownerOptions"
            label="Участники"
            multiple
            variant="modern"
          />
        </div>
        <div class="form-row">
          <CommonInput
            v-model="newProject.startDate"
            label="Дата начала"
            type="date"
            variant="modern"
          />
          <CommonInput
            v-model="newProject.endDate"
            label="Дата окончания"
            type="date"
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
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useProjectsStore } from 'src/stores/projects'
import { useUsersStore } from 'src/stores/users'
import CommonInput from 'components/common/CommonInput.vue'
import CommonSelect from 'components/common/CommonSelect.vue'
import CommonCard from 'components/common/CommonCard.vue'
import CommonTable from 'components/common/CommonTable.vue'
import CommonDialog from 'components/common/CommonDialog.vue'
import CommonForm from 'components/common/CommonForm.vue'

const projectsStore = useProjectsStore()
const usersStore = useUsersStore()

const showCreateProjectDialog = ref(false)

const filters = ref({
  search: '',
  status: null,
  owner: null
})

const newProject = ref({
  name: '',
  description: '',
  status: 'active',
  memberIds: [],
  startDate: '',
  endDate: ''
})

const statusOptions = [
  { label: 'Активен', value: 'active' },
  { label: 'Планируется', value: 'planned' },
  { label: 'Завершён', value: 'completed' }
]

const ownerOptions = computed(() =>
  usersStore.users.map(user => ({
    label: `${user.firstName} ${user.lastName} (${user.email})`,
    value: user.id
  }))
)

const columns = [
  { name: 'name', label: 'Название', field: 'name', sortable: true, align: 'left' },
  { name: 'status', label: 'Статус', field: 'status', sortable: true, align: 'center' },
  { name: 'members', label: 'Участники', field: 'members', sortable: false, align: 'center' },
  { name: 'startDate', label: 'Начало', field: 'startDate', sortable: true, align: 'center' },
  { name: 'endDate', label: 'Окончание', field: 'endDate', sortable: true, align: 'center' },
  { name: 'actions', label: 'Действия', field: 'actions', sortable: false, align: 'center' }
]

const displayedProjects = computed(() => {
  let projects = projectsStore.projects
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    projects = projects.filter(project =>
      project.name?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower)
    )
  }
  if (filters.value.status) {
    projects = projects.filter(project => project.status === filters.value.status)
  }
  if (filters.value.owner) {
    projects = projects.filter(project =>
      project.members && project.members.some(member => member.id === filters.value.owner)
    )
  }
  return projects
})

const applyFilters = () => {}
const clearFilters = () => {
  filters.value = { search: '', status: null, owner: null }
}
const handleSearch = (text) => { filters.value.search = text }
const handleEdit = (project) => { /* переход к редактированию */ }
const handleDelete = async (project) => {
  const result = await projectsStore.deleteProject(project.id)
  if (result.success) {
    Notify.create({
      message: 'Проект успешно удален',
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
}
const handleRowClick = (project) => { /* переход к деталям */ }

const createProject = async () => {
  if (!newProject.value.name) return

  const payload = {
    name: newProject.value.name,
    description: newProject.value.description,
    status: newProject.value.status,
    startDate: newProject.value.startDate,
    endDate: newProject.value.endDate
  }

  const result = await projectsStore.createProject(payload)

  if (result.success) {
    Notify.create({
      message: 'Проект успешно создан',
      title: 'Успех',
      type: 'positive',
      icon: 'check_circle',
      position: 'top-right'
    })
    showCreateProjectDialog.value = false
    newProject.value = { name: '', description: '', status: 'active', memberIds: [], startDate: '', endDate: '' }
  } else {
    Notify.create({
      message: result.error,
      title: 'Ошибка',
      type: 'negative',
      icon: 'error',
      position: 'top-right'
    })
  }
}

const getStatusText = (status) => {
  const map = { active: 'Активен', planned: 'Планируется', completed: 'Завершён' }
  return map[status] || status
}

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'text-blue-6'
    case 'planned': return 'text-orange-6'
    case 'completed': return 'text-green-6'
    default: return 'text-grey-6'
  }
}

onMounted(async () => {
  await usersStore.fetchUsers()
  await projectsStore.fetchProjects()
})
</script>

<style lang="scss" scoped>
.projects-page {
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
          color: #fff;
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }
        .page-subtitle {
          color: #e2e8f0;
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
          color: #fff;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 2px 8px rgba(102,126,234,0.10);
        }
      }
    }
  }
  .filters-section, .projects-section {
    .filters-card, .projects-card {
      background: rgba(30, 32, 48, 0.55) !important;
      .filters-grid, .card-header, .q-table, .q-table th, .q-table td {
        color: #fff !important;
      }
      .card-title {
        color: #fff;
      }
      .status-badge, .priority-badge {
        color: #fff;
      }
      .no-members {
        color: #e2e8f0;
      }
    }
  }
  .q-field__label, .q-field__native, .q-field__native::placeholder {
    color: #fff !important;
    opacity: 1 !important;
  }
}

.create-project-btn {
  color: #fff !important;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%) !important;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(102,126,234,0.10);
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
</style>
