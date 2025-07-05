<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- Header -->
    <q-header elevated class="main-header">
      <q-toolbar class="main-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="menu-toggle"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="toolbar-title">
          <div class="title-content">
            <q-icon name="dashboard" class="title-icon" />
            <span class="title-text">Task Manager</span>
          </div>
        </q-toolbar-title>

        <div class="toolbar-actions">
          <q-btn
            flat
            round
            dense
            icon="notifications"
            class="notification-btn"
            @click="showNotifications = !showNotifications"
          >
            <q-badge
              v-if="notificationCount > 0"
              color="red"
              floating
              :label="notificationCount"
            />
          </q-btn>

          <q-btn
            flat
            round
            dense
            icon="account_circle"
            class="profile-btn"
            @click="showProfileMenu = !showProfileMenu"
          />

          <q-menu
            v-model="showProfileMenu"
            anchor="bottom right"
            self="top right"
            class="profile-menu"
          >
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Профиль</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Выйти</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="main-sidebar"
    >
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <q-icon name="task_alt" class="logo-icon" />
          <span class="logo-text">TaskManager</span>
        </div>
      </div>

      <q-list class="sidebar-menu">
        <q-item-label header class="menu-section-title">
          Основное
        </q-item-label>

        <q-item
          v-for="link in essentialLinks"
          :key="link.title"
          clickable
          tag="a"
          :href="link.link"
          :class="{ 'menu-item--active': $route.path === link.link }"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" class="menu-icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="menu-label">{{ link.title }}</q-item-label>
            <q-item-label caption class="menu-caption">
              {{ link.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="menu-separator" />

        <q-item-label header class="menu-section-title">
          Дополнительно
        </q-item-label>

        <q-item
          v-for="link in additionalLinks"
          :key="link.title"
          clickable
          tag="a"
          :href="link.link"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" class="menu-icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="menu-label">{{ link.title }}</q-item-label>
            <q-item-label caption class="menu-caption">
              {{ link.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="sidebar-footer">
        <div class="user-info">
          <q-avatar class="user-avatar">
            <q-icon name="person" />
          </q-avatar>
          <div class="user-details">
            <div class="user-name">{{ user?.name || 'Пользователь' }}</div>
            <div class="user-role">{{ user?.role || 'Пользователь' }}</div>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container class="main-content">
      <router-view />
    </q-page-container>

    <!-- Notifications Panel -->
    <q-drawer
      v-model="showNotifications"
      side="right"
      bordered
      class="notifications-panel"
    >
      <q-toolbar class="notifications-header">
        <q-toolbar-title>Уведомления</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          @click="showNotifications = false"
        />
      </q-toolbar>

      <q-list class="notifications-list">
        <q-item
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
        >
          <q-item-section avatar>
            <q-icon :name="notification.icon" :color="notification.color" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="notification-title">
              {{ notification.title }}
            </q-item-label>
            <q-item-label caption class="notification-message">
              {{ notification.message }}
            </q-item-label>
            <q-item-label caption class="notification-time">
              {{ notification.time }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const showNotifications = ref(false)
const showProfileMenu = ref(false)

const user = computed(() => authStore.user)

const notificationCount = ref(3)

const notifications = ref([
  {
    id: 1,
    title: 'Новая задача',
    message: 'Вам назначена новая задача "Обновить документацию"',
    icon: 'task',
    color: 'primary',
    time: '5 минут назад'
  },
  {
    id: 2,
    title: 'Задача завершена',
    message: 'Задача "Исправить баг в форме" была завершена',
    icon: 'check_circle',
    color: 'positive',
    time: '1 час назад'
  },
  {
    id: 3,
    title: 'Напоминание',
    message: 'У вас есть задачи с истекающим сроком',
    icon: 'warning',
    color: 'warning',
    time: '2 часа назад'
  }
])

const essentialLinks = [
  {
    title: 'Дашборд',
    caption: 'Обзор задач и проектов',
    icon: 'dashboard',
    link: '/'
  },
  {
    title: 'Задачи',
    caption: 'Управление задачами',
    icon: 'task',
    link: '/tasks'
  },
  {
    title: 'Проекты',
    caption: 'Управление проектами',
    icon: 'folder',
    link: '/projects'
  },
  {
    title: 'Категории',
    caption: 'Управление категориями',
    icon: 'category',
    link: '/categories'
  }
]

const additionalLinks = [
  {
    title: 'Отчеты',
    caption: 'Аналитика и отчеты',
    icon: 'analytics',
    link: '/reports'
  },
  {
    title: 'Настройки',
    caption: 'Настройки системы',
    icon: 'settings',
    link: '/settings'
  }
]

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const goToProfile = () => {
  router.push('/profile')
  showProfileMenu.value = false
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
  showProfileMenu.value = false
}
</script>

<style lang="scss" scoped>
.main-layout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;

  // Header styling
  .main-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    .main-toolbar {
      padding: 0 1rem;
      height: 64px;

      .menu-toggle {
        color: white;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }
      }

      .toolbar-title {
        .title-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .title-icon {
            font-size: 1.5rem;
            color: white;
          }

          .title-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: white;
            letter-spacing: 0.025em;
          }
        }
      }

      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .notification-btn,
        .profile-btn {
          color: white;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.1);
          }
        }
      }
    }
  }

  // Sidebar styling
  .main-sidebar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(0, 0, 0, 0.1);

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .logo-icon {
          font-size: 2rem;
          color: #667eea;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          letter-spacing: -0.025em;
        }
      }
    }

    .sidebar-menu {
      padding: 1rem 0;

      .menu-section-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: #718096;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 1rem 1.5rem 0.5rem;
      }

      .menu-item {
        margin: 0.25rem 0.75rem;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(4px);
        }

        &.menu-item--active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

          .menu-icon {
            color: white;
          }

          .menu-label {
            color: white;
            font-weight: 600;
          }

          .menu-caption {
            color: rgba(255, 255, 255, 0.8);
          }
        }

        .menu-icon {
          color: #718096;
          transition: all 0.3s ease;
        }

        .menu-label {
          font-weight: 500;
          color: #2d3748;
          transition: all 0.3s ease;
        }

        .menu-caption {
          color: #718096;
          transition: all 0.3s ease;
        }
      }

      .menu-separator {
        margin: 1rem 0;
        border-color: rgba(0, 0, 0, 0.1);
      }
    }

    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: rgba(248, 250, 252, 0.8);
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .user-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .user-details {
          flex: 1;

          .user-name {
            font-weight: 600;
            color: #2d3748;
            font-size: 0.875rem;
          }

          .user-role {
            color: #718096;
            font-size: 0.75rem;
          }
        }
      }
    }
  }

  // Main content styling
  .main-content {
    background: rgba(248, 250, 252, 0.95);
    backdrop-filter: blur(10px);
    min-height: calc(100vh - 64px);
    padding: 2rem;

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }

  // Notifications panel styling
  .notifications-panel {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-left: 1px solid rgba(0, 0, 0, 0.1);

    .notifications-header {
      background: rgba(248, 250, 252, 0.8);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .q-toolbar-title {
        font-weight: 600;
        color: #2d3748;
      }
    }

    .notifications-list {
      padding: 1rem 0;

      .notification-item {
        margin: 0.5rem 1rem;
        border-radius: 12px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(102, 126, 234, 0.05);
          transform: translateX(-4px);
        }

        .notification-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .notification-message {
          color: #718096;
          line-height: 1.4;
        }

        .notification-time {
          color: #a0aec0;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
      }
    }
  }

  // Profile menu styling
  .profile-menu {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

    .q-item {
      border-radius: 8px;
      margin: 0.25rem;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.1);
        transform: translateX(4px);
      }
    }
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  .main-layout {
    .main-sidebar {
      background: rgba(26, 32, 44, 0.95);

      .sidebar-header .sidebar-logo .logo-text {
        color: #f7fafc;
      }

      .sidebar-menu {
        .menu-section-title {
          color: #a0aec0;
        }

        .menu-item {
          &:hover {
            background: rgba(102, 126, 234, 0.2);
          }

          .menu-label {
            color: #f7fafc;
          }

          .menu-caption {
            color: #a0aec0;
          }

          .menu-icon {
            color: #a0aec0;
          }
        }
      }

      .sidebar-footer {
        background: rgba(45, 55, 72, 0.8);

        .user-info .user-details {
          .user-name {
            color: #f7fafc;
          }

          .user-role {
            color: #a0aec0;
          }
        }
      }
    }

    .main-content {
      background: rgba(26, 32, 44, 0.95);
    }

    .notifications-panel {
      background: rgba(26, 32, 44, 0.95);

      .notifications-header {
        background: rgba(45, 55, 72, 0.8);

        .q-toolbar-title {
          color: #f7fafc;
        }
      }

      .notifications-list .notification-item {
        &:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        .notification-title {
          color: #f7fafc;
        }

        .notification-message {
          color: #a0aec0;
        }

        .notification-time {
          color: #718096;
        }
      }
    }

    .profile-menu {
      background: rgba(26, 32, 44, 0.95);

      .q-item:hover {
        background: rgba(102, 126, 234, 0.2);
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .main-layout {
    .main-header .main-toolbar {
      padding: 0 0.5rem;

      .title-content .title-text {
        font-size: 1rem;
      }
    }

    .main-sidebar {
      .sidebar-header {
        padding: 1rem;

        .sidebar-logo .logo-text {
          font-size: 1rem;
        }
      }

      .sidebar-menu .menu-item {
        margin: 0.125rem 0.5rem;
      }
    }

    .main-content {
      padding: 1rem;
    }
  }
}

// Animations
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.main-sidebar {
  animation: slideInLeft 0.3s ease-out;
}

.notifications-panel {
  animation: slideInRight 0.3s ease-out;
}
</style>
