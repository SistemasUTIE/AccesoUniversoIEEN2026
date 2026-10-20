import { defineRouter } from '#q-app'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import routes from './routes.js'
import { useAuthStore } from '@/stores/auth.store'
import { systemsApi } from '@/api/systems.api'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to) => {
    const currentUrl = new URL(window.location.href)
    const externalReturn = currentUrl.searchParams.get('return')
    if (externalReturn !== null) {
      currentUrl.searchParams.delete('return')
      window.history.replaceState(window.history.state, '', currentUrl.toString())
    }
    const returnParam = to.query.return ?? externalReturn
    const returnMode = Array.isArray(returnParam) ? returnParam[0] : returnParam

    if (returnMode !== 'true' && returnMode !== 'false') return true

    const authStore = useAuthStore()

    if (returnMode === 'false') {
      authStore.logout()
      return { name: 'login', replace: true }
    }

    if (!authStore.validateSession()) {
      return { name: 'login', query: { expired: '1' }, replace: true }
    }

    try {
      await systemsApi.getCurrent()
      return { name: 'home', replace: true }
    } catch {
      authStore.logout()
      return { name: 'login', query: { expired: '1' }, replace: true }
    }
  })

  return Router
})
