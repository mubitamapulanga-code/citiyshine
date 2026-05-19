import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },

  // Admin routes
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/DashboardView.vue') },
      { path: 'students', name: 'Students', component: () => import('@/views/admin/StudentsView.vue') },
      { path: 'students/:id', name: 'StudentDetail', component: () => import('@/views/admin/StudentDetailView.vue') },
      { path: 'staff', name: 'Staff', component: () => import('@/views/admin/StaffView.vue') },
      { path: 'attendance', name: 'AdminAttendance', component: () => import('@/views/admin/AttendanceView.vue') },
      { path: 'academics', name: 'AdminAcademics', component: () => import('@/views/admin/AcademicsView.vue') },
      { path: 'timetable', name: 'AdminTimetable', component: () => import('@/views/admin/TimetableView.vue') },
      { path: 'fees', name: 'Fees', component: () => import('@/views/admin/FeesView.vue') },
      { path: 'communication', name: 'AdminCommunication', component: () => import('@/views/admin/CommunicationView.vue') },
      { path: 'library', name: 'Library', component: () => import('@/views/admin/LibraryView.vue') },
      { path: 'analytics', name: 'Analytics', component: () => import('@/views/admin/AnalyticsView.vue') },
    ]
  },

  // Teacher routes
  {
    path: '/teacher',
    component: () => import('@/layouts/TeacherLayout.vue'),
    meta: { role: 'teacher' },
    children: [
      { path: '', redirect: '/teacher/dashboard' },
      { path: 'dashboard', name: 'TeacherDashboard', component: () => import('@/views/teacher/DashboardView.vue') },
      { path: 'attendance', name: 'TeacherAttendance', component: () => import('@/views/teacher/AttendanceView.vue') },
      { path: 'grades', name: 'TeacherGrades', component: () => import('@/views/teacher/GradesView.vue') },
      { path: 'assignments', name: 'TeacherAssignments', component: () => import('@/views/teacher/AssignmentsView.vue') },
      { path: 'timetable', name: 'TeacherTimetable', component: () => import('@/views/teacher/TimetableView.vue') },
      { path: 'communication', name: 'TeacherCommunication', component: () => import('@/views/teacher/CommunicationView.vue') },
    ]
  },

  // Student routes
  {
    path: '/student',
    component: () => import('@/layouts/StudentLayout.vue'),
    meta: { role: 'student' },
    children: [
      { path: '', redirect: '/student/dashboard' },
      { path: 'dashboard', name: 'StudentDashboard', component: () => import('@/views/student/DashboardView.vue') },
      { path: 'timetable', name: 'StudentTimetable', component: () => import('@/views/student/TimetableView.vue') },
      { path: 'grades', name: 'StudentGrades', component: () => import('@/views/student/GradesView.vue') },
      { path: 'assignments', name: 'StudentAssignments', component: () => import('@/views/student/AssignmentsView.vue') },
      { path: 'fees', name: 'StudentFees', component: () => import('@/views/student/FeesView.vue') },
      { path: 'communication', name: 'StudentCommunication', component: () => import('@/views/student/CommunicationView.vue') },
    ]
  },

  // Parent routes
  {
    path: '/parent',
    component: () => import('@/layouts/ParentLayout.vue'),
    meta: { role: 'parent' },
    children: [
      { path: '', redirect: '/parent/dashboard' },
      { path: 'dashboard', name: 'ParentDashboard', component: () => import('@/views/parent/DashboardView.vue') },
      { path: 'progress', name: 'ParentProgress', component: () => import('@/views/parent/ProgressView.vue') },
      { path: 'attendance', name: 'ParentAttendance', component: () => import('@/views/parent/AttendanceView.vue') },
      { path: 'fees', name: 'ParentFees', component: () => import('@/views/parent/FeesView.vue') },
      { path: 'communication', name: 'ParentCommunication', component: () => import('@/views/parent/CommunicationView.vue') },
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.public) return next()
  if (!auth.isAuthenticated) return next('/login')
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next(`/${auth.user?.role}`)
  }
  next()
})

export default router
