const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/AuthLogin.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/AuthRegister.vue')
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/Dashboard.vue') }
    ]
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/dashboard'
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'profile', component: () => import('pages/UserProfile.vue') }
    ]
  },
  {
    path: '/task/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'task-detail', component: () => import('pages/TaskDetail.vue') }
    ]
  },
  {
    path: '/tasks',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'tasks', component: () => import('pages/Tasks.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
