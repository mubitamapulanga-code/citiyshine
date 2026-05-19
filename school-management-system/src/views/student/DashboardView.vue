<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
      <h2 class="text-2xl font-bold">Hello, Alice!</h2>
      <p class="text-amber-100 mt-1">Grade 10A · Student ID: STU001</p>
      <div class="flex gap-4 mt-4">
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">3.8</p>
          <p class="text-xs text-amber-100">Current GPA</p>
        </div>
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">96%</p>
          <p class="text-xs text-amber-100">Attendance</p>
        </div>
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">2</p>
          <p class="text-xs text-amber-100">Due Soon</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Today's classes -->
      <div class="card">
        <h3 class="section-title mb-4">Today's Classes</h3>
        <div class="space-y-3">
          <div v-for="cls in todayClasses" :key="cls.time" class="flex items-center gap-4 p-3 rounded-xl" :class="cls.current ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'">
            <div class="text-center w-24 flex-shrink-0">
              <p class="text-xs font-semibold" :class="cls.current ? 'text-amber-700' : 'text-gray-500'">{{ cls.time }}</p>
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ cls.subject }}</p>
              <p class="text-xs text-gray-500">{{ cls.teacher }} · {{ cls.room }}</p>
            </div>
            <span v-if="cls.current" class="badge-yellow">Now</span>
          </div>
        </div>
      </div>

      <!-- Recent grades -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">Recent Grades</h3>
          <RouterLink to="/student/grades" class="text-xs text-amber-600 hover:underline">View all</RouterLink>
        </div>
        <div class="space-y-2">
          <div v-for="g in myGrades" :key="g.id" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ g.subject }}</p>
              <p class="text-xs text-gray-500">{{ g.assignment }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="g.score >= 80 ? 'text-green-600' : g.score >= 60 ? 'text-amber-600' : 'text-red-600'">{{ g.grade }}</p>
              <p class="text-xs text-gray-400">{{ g.score }}/{{ g.maxScore }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Announcements -->
    <div class="card">
      <h3 class="section-title mb-4">Announcements</h3>
      <div class="space-y-3">
        <div v-for="ann in store.announcements.slice(0, 3)" :key="ann.id" class="flex gap-3 p-3 bg-gray-50 rounded-xl">
          <div :class="`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ann.priority === 'High' ? 'bg-red-400' : 'bg-blue-400'}`" />
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ ann.title }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ ann.body }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ ann.date }}</p>
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
const myGrades = computed(() => store.grades.filter(g => g.studentId === 'STU001').slice(0, 4))

const todayClasses = [
  { time: '08:00-09:00', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'R101', current: false },
  { time: '09:00-10:00', subject: 'English', teacher: 'Ms. Emily Rose', room: 'R102', current: false },
  { time: '10:15-11:15', subject: 'Science', teacher: 'Mr. John Doe', room: 'Lab1', current: true },
  { time: '11:15-12:15', subject: 'History', teacher: 'Mr. Kevin Black', room: 'R103', current: false },
  { time: '13:00-14:00', subject: 'PE', teacher: 'Coach Adams', room: 'Gym', current: false },
]
</script>
