<template>
  <div class="space-y-6">
    <h2 class="page-title">My Grades</h2>

    <!-- GPA card -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
          <span class="text-xl font-bold text-amber-600">3.8</span>
        </div>
        <div><p class="text-xs text-gray-500">Current GPA</p><p class="font-semibold text-gray-900">Term 2</p></div>
      </div>
      <div class="stat-card">
        <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
          <span class="text-xl font-bold text-green-600">{{ avgScore }}%</span>
        </div>
        <div><p class="text-xs text-gray-500">Average Score</p><p class="font-semibold text-gray-900">All Subjects</p></div>
      </div>
      <div class="stat-card">
        <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
          <span class="text-xl font-bold text-indigo-600">{{ myGrades.length }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Assessments</p><p class="font-semibold text-gray-900">Completed</p></div>
      </div>
      <div class="stat-card">
        <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
          <span class="text-xl font-bold text-purple-600">Top 5%</span>
        </div>
        <div><p class="text-xs text-gray-500">Class Rank</p><p class="font-semibold text-gray-900">Grade 10A</p></div>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
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
          <tr v-for="g in myGrades" :key="g.id" class="hover:bg-gray-50">
            <td class="table-cell font-medium">{{ g.subject }}</td>
            <td class="table-cell text-gray-600">{{ g.assignment }}</td>
            <td class="table-cell">
              <div class="flex items-center gap-2">
                <div class="w-16 bg-gray-100 rounded-full h-1.5">
                  <div class="h-1.5 rounded-full" :class="g.score >= 80 ? 'bg-green-500' : g.score >= 60 ? 'bg-amber-400' : 'bg-red-400'" :style="`width:${g.score}%`" />
                </div>
                <span class="text-sm font-medium">{{ g.score }}/{{ g.maxScore }}</span>
              </div>
            </td>
            <td class="table-cell"><span :class="gradeClass(g.grade)" class="font-bold text-sm">{{ g.grade }}</span></td>
            <td class="table-cell text-gray-500 text-sm">78%</td>
            <td class="table-cell text-gray-500">{{ g.date }}</td>
          </tr>
          <tr v-if="myGrades.length === 0">
            <td colspan="6" class="text-center py-12 text-gray-400">No grades yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const myGrades = computed(() => store.grades.filter(g => g.studentId === 'STU001'))
const avgScore = computed(() => {
  if (!myGrades.value.length) return 0
  return Math.round(myGrades.value.reduce((s, g) => s + g.score, 0) / myGrades.value.length)
})

function gradeClass(g) {
  if (g.startsWith('A')) return 'text-green-600'
  if (g.startsWith('B')) return 'text-blue-600'
  if (g.startsWith('C')) return 'text-amber-600'
  return 'text-red-600'
}
</script>
