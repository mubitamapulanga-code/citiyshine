import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DEMO_USERS = [
  { id: 1, name: 'Thomas Harris', email: 'admin@school.edu', password: 'admin123', role: 'admin', avatar: 'TH', school: 'Greenfield Academy' },
  { id: 2, name: 'Dr. Sarah Connor', email: 'teacher@school.edu', password: 'teacher123', role: 'teacher', avatar: 'SC', school: 'Greenfield Academy' },
  { id: 3, name: 'Alice Johnson', email: 'student@school.edu', password: 'student123', role: 'student', avatar: 'AJ', school: 'Greenfield Academy', studentId: 'STU001' },
  { id: 4, name: 'Robert Johnson', email: 'parent@school.edu', password: 'parent123', role: 'parent', avatar: 'RJ', school: 'Greenfield Academy', childId: 'STU001', childName: 'Alice Johnson' },
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('sms_user') || 'null'))
  const isAuthenticated = computed(() => !!user.value)

  function login(email, password) {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...safeUser } = found
      user.value = safeUser
      localStorage.setItem('sms_user', JSON.stringify(safeUser))
      return { success: true, user: safeUser }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('sms_user')
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')
  const isStudent = computed(() => user.value?.role === 'student')
  const isParent = computed(() => user.value?.role === 'parent')

  return { user, isAuthenticated, isAdmin, isTeacher, isStudent, isParent, login, logout }
})
