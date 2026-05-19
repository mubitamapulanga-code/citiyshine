<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <aside :class="['flex flex-col bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0', store.sidebarOpen ? 'w-64' : 'w-16']">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        </div>
        <div v-if="store.sidebarOpen" class="overflow-hidden">
          <p class="font-bold text-gray-900 text-sm leading-tight">Citybride</p>
          <p class="text-xs text-gray-500">Academy SMS</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
          :class="['sidebar-link', $route.path.startsWith(item.to) ? 'sidebar-link-active' : 'sidebar-link-inactive']"
          :title="!store.sidebarOpen ? item.label : ''">
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="store.sidebarOpen" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- User -->
      <div class="border-t border-gray-100 p-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold text-indigo-700">{{ auth.user?.avatar }}</span>
          </div>
          <div v-if="store.sidebarOpen" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ auth.user?.role }}</p>
          </div>
          <button v-if="store.sidebarOpen" @click="handleLogout" class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
            <IconLogout class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
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
          <!-- Notifications -->
          <div class="relative">
            <button @click="showNotifs = !showNotifs" class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <IconBell class="w-5 h-5 text-gray-600" />
              <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{{ unreadCount }}</span>
            </button>
            <div v-if="showNotifs" class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                <p class="font-semibold text-sm">Notifications</p>
                <span class="badge-blue">{{ unreadCount }} new</span>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div v-for="n in store.notifications" :key="n.id" @click="store.markNotificationRead(n.id)"
                  :class="['p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors', !n.read ? 'bg-indigo-50/50' : '']">
                  <p class="text-sm text-gray-800">{{ n.text }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ n.time }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span class="text-xs font-bold text-indigo-700">{{ auth.user?.avatar }}</span>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
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
import { IconDashboard, IconStudents, IconStaff, IconAttendance, IconAcademics, IconTimetable, IconFees, IconCommunication, IconLibrary, IconAnalytics, IconLogout, IconMenu, IconBell } from '@/components/icons'

const auth = useAuthStore()
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const showNotifs = ref(false)

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/admin/students', label: 'Students', icon: IconStudents },
  { to: '/admin/staff', label: 'HR & Staff', icon: IconStaff },
  { to: '/admin/attendance', label: 'Attendance', icon: IconAttendance },
  { to: '/admin/academics', label: 'Academics', icon: IconAcademics },
  { to: '/admin/timetable', label: 'Timetable', icon: IconTimetable },
  { to: '/admin/fees', label: 'Fee Management', icon: IconFees },
  { to: '/admin/communication', label: 'Communication', icon: IconCommunication },
  { to: '/admin/library', label: 'Library', icon: IconLibrary },
  { to: '/admin/analytics', label: 'Analytics', icon: IconAnalytics },
]

const titleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/students': 'Student Information',
  '/admin/staff': 'HR & Staff',
  '/admin/attendance': 'Attendance',
  '/admin/academics': 'Academics & Gradebook',
  '/admin/timetable': 'Timetable',
  '/admin/fees': 'Fee Management',
  '/admin/communication': 'Communication',
  '/admin/library': 'Library',
  '/admin/analytics': 'Analytics & Reports',
}

const currentTitle = computed(() => {
  for (const [path, title] of Object.entries(titleMap)) {
    if (route.path.startsWith(path)) return title
  }
  return 'Dashboard'
})

const currentDate = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
const unreadCount = computed(() => store.notifications.filter(n => !n.read).length)

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
