<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
      <h2 class="text-2xl font-bold">Good morning, Dr. Connor!</h2>
      <p class="text-emerald-100 mt-1">Tuesday, May 19, 2026 · You have 3 classes today</p>
      <div class="flex flex-wrap gap-3 mt-4">
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">25</p>
          <p class="text-xs text-emerald-100">Students</p>
        </div>
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">3</p>
          <p class="text-xs text-emerald-100">Classes Today</p>
        </div>
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">5</p>
          <p class="text-xs text-emerald-100">Pending Grades</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Today's schedule -->
      <div class="card">
        <h3 class="section-title mb-4">Today's Schedule</h3>
        <div class="space-y-3">
          <div v-for="cls in todayClasses" :key="cls.time" class="flex items-center gap-4 p-3 rounded-xl" :class="cls.current ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'">
            <div class="text-center w-20 flex-shrink-0">
              <p class="text-xs font-semibold" :class="cls.current ? 'text-emerald-700' : 'text-gray-500'">{{ cls.time }}</p>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ cls.subject }}</p>
              <p class="text-xs text-gray-500">{{ cls.class }} · {{ cls.room }}</p>
            </div>
            <span v-if="cls.current" class="badge-green">Now</span>
          </div>
        </div>
      </div>

      <!-- Recent grades -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">Recent Grades</h3>
          <RouterLink to="/teacher/grades" class="text-xs text-emerald-600 hover:underline">View all</RouterLink>
        </div>
        <div class="space-y-2">
          <div v-for="g in recentGrades" :key="g.id" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ g.studentName }}</p>
              <p class="text-xs text-gray-500">{{ g.assignment }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="g.score >= 80 ? 'text-green-600' : g.score >= 60 ? 'text-amber-600' : 'text-red-600'">{{ g.score }}/{{ g.maxScore }}</p>
              <p class="text-xs text-gray-400">{{ g.grade }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending assignments -->
    <div class="card">
      <h3 class="section-title mb-4">Assignments Needing Attention</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="a in pendingAssignments" :key="a.id" class="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p class="font-semibold text-gray-900 text-sm">{{ a.title }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ a.class }} · Due {{ a.dueDate }}</p>
          <div class="mt-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-500">Submissions</span>
              <span :class="a.submissions < a.total * 0.5 ? 'text-red-600' : 'text-green-600'" class="font-medium">{{ a.submissions }}/{{ a.total }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="h-1.5 rounded-full bg-emerald-500" :style="`width:${(a.submissions/a.total)*100}%`" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const todayClasses = [
  { time: '08:00-09:00', subject: 'Mathematics', class: '10A', room: 'R101', current: false },
  { time: '10:15-11:15', subject: 'Calculus', class: '12A', room: 'R101', current: true },
  { time: '13:00-14:00', subject: 'Algebra', class: '8B', room: 'R101', current: false },
]

const recentGrades = computed(() => store.grades.filter(g => g.teacher === 'Dr. Sarah Connor').slice(0, 5))
const pendingAssignments = computed(() => store.assignments.filter(a => a.teacher === 'Dr. Sarah Connor'))
</script>
