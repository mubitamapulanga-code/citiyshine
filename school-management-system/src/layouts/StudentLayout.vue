<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <aside :class="['flex flex-col bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0', store.sidebarOpen ? 'w-64' : 'w-16']">
      <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        </div>
        <div v-if="store.sidebarOpen" class="overflow-hidden">
          <p class="font-bold text-gray-900 text-sm leading-tight">Student Portal</p>
          <p class="text-xs text-gray-500">Citybride Academy</p>
        </div>
      </div>
      <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
          :class="['sidebar-link', $route.path.startsWith(item.to) ? 'sidebar-link-active' : 'sidebar-link-inactive']">
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="store.sidebarOpen" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="border-t border-gray-100 p-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold text-amber-700">{{ auth.user?.avatar }}</span>
          </div>
          <div v-if="store.sidebarOpen" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500">Student · STU001</p>
          </div>
          <button v-if="store.sidebarOpen" @click="handleLogout" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
            <IconLogout class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-4">
          <button @click="store.toggleSidebar()" class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <IconMenu class="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 class="font-semibold text-gray-900">{{ currentTitle }}</h1>
            <p class="text-xs text-gray-500">{{ currentDate }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <span class="text-xs font-bold text-amber-700">{{ auth.user?.avatar }}</span>
          </div>
          <button @click="handleLogout" class="btn-secondary text-sm py-1.5">Logout</button>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { IconDashboard, IconTimetable, IconFees, IconCommunication, IconLogout, IconMenu, IconGrades, IconAcademics } from '@/components/icons'

const auth = useAuthStore()
const store = useAppStore()
const route = useRoute()
const router = useRouter()

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/student/timetable', label: 'Timetable', icon: IconTimetable },
  { to: '/student/grades', label: 'My Grades', icon: IconGrades },
  { to: '/student/assignments', label: 'Assignments', icon: IconAcademics },
  { to: '/student/fees', label: 'Fees', icon: IconFees },
  { to: '/student/communication', label: 'Messages', icon: IconCommunication },
]

const titleMap = {
  '/student/dashboard': 'My Dashboard',
  '/student/timetable': 'My Timetable',
  '/student/grades': 'My Grades',
  '/student/assignments': 'Assignments',
  '/student/fees': 'Fee Statement',
  '/student/communication': 'Messages',
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
