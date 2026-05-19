<template>
  <div class="space-y-6">
    <h2 class="page-title">Alice's Academic Progress</h2>

    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-green-600">3.8</span></div>
        <div><p class="text-xs text-gray-500">GPA</p><p class="font-semibold text-gray-900">Term 2</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-indigo-600">{{ avgScore }}%</span></div>
        <div><p class="text-xs text-gray-500">Avg Score</p><p class="font-semibold text-gray-900">All Subjects</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-amber-600">Top 5%</span></div>
        <div><p class="text-xs text-gray-500">Class Rank</p><p class="font-semibold text-gray-900">Grade 10A</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-purple-600">{{ grades.length }}</span></div>
        <div><p class="text-xs text-gray-500">Assessments</p><p class="font-semibold text-gray-900">Completed</p></div>
      </div>
    </div>

    <!-- Subject breakdown -->
    <div class="card">
      <h3 class="section-title mb-4">Performance by Subject</h3>
      <div class="space-y-4">
        <div v-for="sub in subjectBreakdown" :key="sub.subject" class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-700 w-28 flex-shrink-0">{{ sub.subject }}</span>
          <div class="flex-1 bg-gray-100 rounded-full h-3">
            <div class="h-3 rounded-full transition-all duration-500"
              :class="sub.avg >= 80 ? 'bg-green-500' : sub.avg >= 60 ? 'bg-amber-400' : 'bg-red-400'"
              :style="`width: ${sub.avg}%`" />
          </div>
          <span class="text-sm font-semibold text-gray-700 w-12 text-right">{{ sub.avg }}%</span>
          <span class="text-xs font-bold w-8" :class="sub.avg >= 80 ? 'text-green-600' : 'text-amber-600'">{{ sub.grade }}</span>
        </div>
      </div>
    </div>

    <!-- Grade table -->
    <div class="card p-0 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="section-title">All Grades</h3>
      </div>
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="table-header">Subject</th>
            <th class="table-header">Assignment</th>
            <th class="table-header">Score</th>
            <th class="table-header">Grade</th>
            <th class="table-header">Class Avg</th>
            <th class="table-header">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="g in grades" :key="g.id" class="hover:bg-gray-50">
            <td class="table-cell font-medium">{{ g.subject }}</td>
            <td class="table-cell text-gray-600">{{ g.assignment }}</td>
            <td class="table-cell font-medium">{{ g.score }}/{{ g.maxScore }}</td>
            <td class="table-cell"><span :class="g.score >= 80 ? 'text-green-600' : g.score >= 60 ? 'text-amber-600' : 'text-red-600'" class="font-bold">{{ g.grade }}</span></td>
            <td class="table-cell text-gray-500">78%</td>
            <td class="table-cell text-gray-500">{{ g.date }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const grades = computed(() => store.grades.filter(g => g.studentId === 'STU001'))
const avgScore = computed(() => {
  if (!grades.value.length) return 0
  return Math.round(grades.value.reduce((s, g) => s + g.score, 0) / grades.value.length)
})

const subjectBreakdown = computed(() => {
  const map = {}
  grades.value.forEach(g => {
    if (!map[g.subject]) map[g.subject] = { scores: [], grade: g.grade }
    map[g.subject].scores.push(g.score)
  })
  return Object.entries(map).map(([subject, data]) => ({
    subject,
    avg: Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length),
    grade: data.grade
  }))
})
</script>
