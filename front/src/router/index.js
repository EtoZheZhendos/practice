import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Инициализация авторизации при запуске
  const authStore = useAuthStore()

  // Route guard
  Router.beforeEach(async (to, from, next) => {
    console.log('Route guard triggered:', {
      from: from.name,
      to: to.name,
      currentAuth: {
        isAuthenticated: authStore.isAuthenticated,
        hasToken: !!authStore.token,
        isLoggedIn: authStore.isLoggedIn
      }
    })

    // Инициализируем авторизацию при первом переходе
    if (!authStore.isAuthenticated && localStorage.getItem('token')) {
      console.log('Initializing auth from localStorage')
      await authStore.initializeAuth()
    }

    // Ждем завершения загрузки
    if (authStore.isLoading) {
      console.log('Auth is loading, waiting...')
      return
    }

    const publicPages = ['login', 'register']
    const isPublic = publicPages.includes(to.name)
    const isLoggedIn = authStore.isLoggedIn

    console.log('Route guard decision:', {
      to: to.name,
      isPublic,
      isLoggedIn,
      isAuthenticated: authStore.isAuthenticated,
      hasToken: !!authStore.token
    })

    if (!isLoggedIn && !isPublic) {
      // Неавторизованный пользователь пытается попасть на защищенную страницу
      console.log('Redirecting to login - not authenticated')
      next({ name: 'login' })
    } else if (isLoggedIn && isPublic) {
      // Авторизованный пользователь пытается попасть на страницы авторизации
      console.log('Redirecting to dashboard - already authenticated')
      next({ name: 'dashboard' })
    } else if (isLoggedIn && to.path === '/') {
      // Авторизованный пользователь на корневом пути
      console.log('Redirecting to dashboard - root path')
      next({ name: 'dashboard' })
    } else {
      console.log('Proceeding to:', to.name)
      next()
    }
  })

  return Router
})
