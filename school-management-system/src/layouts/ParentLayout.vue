<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">

    <!-- Mobile overlay backdrop -->
    <transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 bg-black/40 z-20 lg:hidden"
        @click="mobileOpen = false"
      />
    </transition>

    <!-- Sidebar -->
    <aside :class="[
      'flex flex-col bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 z-30',
      'lg:relative lg:translate-x-0',
      store.sidebarOpen ? 'lg:w-64' : 'lg:w-16',
      'fixed inset-y-0 left-0 w-64',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
      <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div class="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        </div>
        <div class="overflow-hidden" :class="store.sidebarOpen ? 'lg:block' : 'lg:hidden'">
          <p class="font-bold text-gray-900 text-sm leading-tight">Parent Portal</p>
          <p class="text-xs text-gray-500">Citybride Academy</p>
        </div>
        <button @click="mobileOpen = false" class="ml-auto p-1 rounded hover:bg-gray-100 lg:hidden">
          <IconClose class="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
          @click="mobileOpen = false"
          :class="['sidebar-link', $route.path.startsWith(item.to) ? 'sidebar-link-active' : 'sidebar-link-inactive']">
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span class="truncate" :class="store.sidebarOpen ? 'lg:inline' : 'lg:hidden'">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="border-t border-gray-100 p-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold text-rose-700">{{ auth.user?.avatar }}</span>
          </div>
          <div class="flex-1 min-w-0" :class="store.sidebarOpen ? 'lg:block' : 'lg:hidden'">
            <p class="text-sm font-medium text-gray-900 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500">Parent of Alice Johnson</p>
          </div>
          <button @click="handleLogout" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors" :class="store.sidebarOpen ? 'lg:block' : 'lg:hidden'">
            <IconLogout class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <button @click="mobileOpen = true" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden">
            <IconMenu class="w-5 h-5 text-gray-600" />
          </button>
          <button @click="store.toggleSidebar()" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block">
            <IconMenu class="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 class="font-semibold text-gray-900 text-sm sm:text-base">{{ currentTitle }}</h1>
            <p class="text-xs text-gray-500 hidden sm:block">{{ currentDate }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
            <span class="text-xs font-bold text-rose-700">{{ auth.user?.avatar }}</span>
          </div>
          <button @click="handleLogout" class="btn-secondary text-sm py-1.5 hidden sm:block">Logout</button>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-4 sm:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { IconDashboard, IconAttendance, IconFees, IconCommunication, IconLogout, IconMenu, IconProgress, IconReceipt } from '@/components/icons'

const IconClose = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
}

const auth = useAuthStore()
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const navItems = [
  { to: '/parent/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/parent/progress', label: 'Academic Progress', icon: IconProgress },
  { to: '/parent/attendance', label: 'Attendance', icon: IconAttendance },
  { to: '/parent/fees', label: 'Fee Payments', icon: IconFees },
  { to: '/parent/all-receipts', label: 'All Receipts', icon: IconReceipt },
  { to: '/parent/communication', label: 'Messages', icon: IconCommunication },
]

const titleMap = {
  '/parent/dashboard': 'Parent Dashboard',
  '/parent/progress': 'Academic Progress',
  '/parent/attendance': 'Attendance Record',
  '/parent/fees': 'Fee Payments',
  '/parent/all-receipts': 'All Receipts',
  '/parent/communication': 'Messages',
}

const currentTitle = computed(() => {
  for (const [path, title] of Object.entries(titleMap)) {
    if (route.path.startsWith(path)) return title
  }
  return 'Dashboard'
})
const currentDate = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
function handleLogout() { auth.logout(); router.push('/login') }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
