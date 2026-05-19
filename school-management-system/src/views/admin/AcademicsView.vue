<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="page-title">Academics & Gradebook</h2>
      <div class="flex flex-wrap gap-2">
        <button @click="activeTab = 'grades'" :class="['px-3 py-2 text-sm rounded-lg font-medium transition-colors', activeTab === 'grades' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']">Gradebook</button>
        <button @click="activeTab = 'assignments'" :class="['px-3 py-2 text-sm rounded-lg font-medium transition-colors', activeTab === 'assignments' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']">Assignments</button>
        <button @click="activeTab = 'exams'" :class="['px-3 py-2 text-sm rounded-lg font-medium transition-colors', activeTab === 'exams' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50']">Exams</button>
      </div>
    </div>

    <!-- Gradebook -->
    <div v-if="activeTab === 'grades'" class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <SearchInput v-model="search" placeholder="Search student..." class="flex-1" />
        <select v-model="filterSubject" class="input-field w-full sm:w-40">
          <option value="">All Subjects</option>
          <option v-for="s in subjects" :key="s">{{ s }}</option>
        </select>
        <button @click="showAddGrade = true" class="btn-primary flex items-center gap-2 text-sm">
          <IconPlus class="w-4 h-4" /> Add Grade
        </button>
      </div>
      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="table-header">Student</th>
              <th class="table-header">Subject</th>
              <th class="table-header">Assignment</th>
              <th class="table-header">Score</th>
              <th class="table-header">Grade</th>
              <th class="table-header">Teacher</th>
              <th class="table-header">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="g in filteredGrades" :key="g.id" class="hover:bg-gray-50">
              <td class="table-cell font-medium">{{ g.studentName }}</td>
              <td class="table-cell text-gray-600">{{ g.subject }}</td>
              <td class="table-cell text-gray-600">{{ g.assignment }}</td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-gray-100 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full" :class="scoreColor(g.score)" :style="`width:${g.score}%`" />
                  </div>
                  <span class="text-sm font-medium">{{ g.score }}/{{ g.maxScore }}</span>
                </div>
              </td>
              <td class="table-cell"><span :class="gradeClass(g.grade)" class="font-bold text-sm">{{ g.grade }}</span></td>
              <td class="table-cell text-gray-500 text-xs">{{ g.teacher }}</td>
              <td class="table-cell text-gray-500">{{ g.date }}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <!-- Assignments -->
    <div v-if="activeTab === 'assignments'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="a in store.assignments" :key="a.id" class="card hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ a.title }}</p>
              <p class="text-sm text-gray-500 mt-0.5">{{ a.subject }} · {{ a.class }}</p>
            </div>
            <AppBadge :text="a.status" :color="a.status === 'Due Soon' ? 'yellow' : 'blue'" />
          </div>
          <p class="text-xs text-gray-500 mb-3">{{ a.description }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>Due: {{ a.dueDate }}</span>
            <span>{{ a.teacher }}</span>
          </div>
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-500">Submissions</span>
              <span class="font-medium">{{ a.submissions }}/{{ a.total }}</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-1.5">
              <div class="h-1.5 rounded-full bg-indigo-500" :style="`width:${(a.submissions/a.total)*100}%`" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exams -->
    <div v-if="activeTab === 'exams'" class="space-y-4">
      <div class="flex justify-between items-center">
        <p class="text-sm text-gray-500">{{ store.exams.length }} exams scheduled</p>
        <button class="btn-primary text-sm flex items-center gap-2"><IconPlus class="w-4 h-4" /> Schedule Exam</button>
      </div>
      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="table-header">Exam</th>
              <th class="table-header">Class</th>
              <th class="table-header">Date</th>
              <th class="table-header">Time</th>
              <th class="table-header">Room</th>
              <th class="table-header">Invigilator</th>
              <th class="table-header">Marks</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="e in store.exams" :key="e.id" class="hover:bg-gray-50">
              <td class="table-cell font-medium">{{ e.name }}</td>
              <td class="table-cell"><span class="badge-blue">{{ e.class }}</span></td>
              <td class="table-cell text-gray-600">{{ e.date }}</td>
              <td class="table-cell text-gray-600">{{ e.time }}</td>
              <td class="table-cell text-gray-600">{{ e.room }}</td>
              <td class="table-cell text-gray-500 text-xs">{{ e.invigilator }}</td>
              <td class="table-cell font-medium">{{ e.totalMarks }}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <!-- Add Grade Modal -->
    <AppModal v-model="showAddGrade" title="Add Grade">
      <form @submit.prevent="saveGrade" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select v-model="gradeForm.studentId" required class="input-field" @change="onStudentChange">
              <option v-for="s in store.students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select v-model="gradeForm.subject" required class="input-field">
              <option v-for="s in subjects" :key="s">{{ s }}</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Assignment / Exam</label>
            <input v-model="gradeForm.assignment" required class="input-field" placeholder="Midterm Exam" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Score</label>
            <input v-model.number="gradeForm.score" type="number" min="0" max="100" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
            <input v-model.number="gradeForm.maxScore" type="number" min="1" required class="input-field" />
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showAddGrade = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Save Grade</button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import SearchInput from '@/components/SearchInput.vue'
import { IconPlus } from '@/components/icons'

const store = useAppStore()
const activeTab = ref('grades')
const search = ref('')
const filterSubject = ref('')
const showAddGrade = ref(false)

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Music', 'PE']

const filteredGrades = computed(() => store.grades.filter(g => {
  const q = search.value.toLowerCase()
  return (!q || g.studentName.toLowerCase().includes(q)) &&
    (!filterSubject.value || g.subject === filterSubject.value)
}))

const gradeForm = ref({ studentId: '', studentName: '', subject: 'Mathematics', assignment: '', score: 0, maxScore: 100, teacher: 'Dr. Sarah Connor', term: 'Term 2', date: '2026-05-19' })

function onStudentChange() {
  const s = store.students.find(s => s.id === gradeForm.value.studentId)
  if (s) gradeForm.value.studentName = s.name
}

function computeGrade(score, max) {
  const pct = (score / max) * 100
  if (pct >= 90) return 'A'
  if (pct >= 80) return 'B+'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C+'
  if (pct >= 50) return 'C'
  if (pct >= 40) return 'D'
  return 'F'
}

function saveGrade() {
  store.addGrade({ ...gradeForm.value, grade: computeGrade(gradeForm.value.score, gradeForm.value.maxScore) })
  showAddGrade.value = false
}

function scoreColor(s) {
  if (s >= 80) return 'bg-green-500'
  if (s >= 60) return 'bg-amber-400'
  return 'bg-red-400'
}

function gradeClass(g) {
  if (g.startsWith('A')) return 'text-green-600'
  if (g.startsWith('B')) return 'text-blue-600'
  if (g.startsWith('C')) return 'text-amber-600'
  return 'text-red-600'
}
</script>
