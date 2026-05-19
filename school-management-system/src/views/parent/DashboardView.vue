<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
      <h2 class="text-2xl font-bold">Welcome, Robert!</h2>
      <p class="text-rose-100 mt-1">Monitoring: Alice Johnson · Grade 10A</p>
      <div class="flex gap-4 mt-4">
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">3.8</p>
          <p class="text-xs text-rose-100">GPA</p>
        </div>
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">96%</p>
          <p class="text-xs text-rose-100">Attendance</p>
        </div>
        <div class="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p class="text-2xl font-bold">$0</p>
          <p class="text-xs text-rose-100">Balance Due</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent grades -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">Alice's Recent Grades</h3>
          <RouterLink to="/parent/progress" class="text-xs text-rose-600 hover:underline">View all</RouterLink>
        </div>
        <div class="space-y-2">
          <div v-for="g in aliceGrades" :key="g.id" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ g.subject }}</p>
              <p class="text-xs text-gray-500">{{ g.assignment }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="g.score >= 80 ? 'text-green-600' : 'text-amber-600'">{{ g.grade }}</p>
              <p class="text-xs text-gray-400">{{ g.score }}/{{ g.maxScore }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">Messages from Teachers</h3>
          <RouterLink to="/parent/communication" class="text-xs text-rose-600 hover:underline">View all</RouterLink>
        </div>
        <div class="space-y-3">
          <div v-for="msg in teacherMessages" :key="msg.id" :class="['p-3 rounded-xl', !msg.read ? 'bg-rose-50 border border-rose-200' : 'bg-gray-50']">
            <p class="text-sm font-semibold text-gray-900">{{ msg.subject }}</p>
            <p class="text-xs text-gray-500 mt-0.5">From: {{ msg.from }} · {{ msg.date }}</p>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ msg.body }}</p>
          </div>
          <div v-if="teacherMessages.length === 0" class="text-center py-4 text-gray-400 text-sm">No messages</div>
        </div>
      </div>
    </div>

    <!-- Announcements -->
    <div class="card">
      <h3 class="section-title mb-4">School Announcements</h3>
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
const aliceGrades = computed(() => store.grades.filter(g => g.studentId === 'STU001').slice(0, 4))
const teacherMessages = computed(() => store.messages.filter(m => m.to === 'Robert Johnson' || m.toRole === 'Parent').slice(0, 3))
</script>
