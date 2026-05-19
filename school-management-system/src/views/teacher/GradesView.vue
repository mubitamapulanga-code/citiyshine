<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="page-title">Gradebook</h2>
      <button @click="showAdd = true" class="btn-primary text-sm flex items-center gap-2 self-start sm:self-auto">
        <IconPlus class="w-4 h-4" /> Add Grade
      </button>
    </div>

    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <SearchInput v-model="search" placeholder="Search student..." class="flex-1" />
        <select v-model="filterClass" class="input-field w-full sm:w-36">
          <option value="">All Classes</option>
          <option v-for="c in myClasses" :key="c">{{ c }}</option>
        </select>
      </div>
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
            <th class="table-header">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="g in filtered" :key="g.id" class="hover:bg-gray-50">
            <td class="table-cell font-medium">{{ g.studentName }}</td>
            <td class="table-cell text-gray-600">{{ g.subject }}</td>
            <td class="table-cell text-gray-600">{{ g.assignment }}</td>
            <td class="table-cell">
              <div class="flex items-center gap-2">
                <div class="w-16 bg-gray-100 rounded-full h-1.5">
                  <div class="h-1.5 rounded-full" :class="g.score >= 80 ? 'bg-green-500' : g.score >= 60 ? 'bg-amber-400' : 'bg-red-400'" :style="`width:${g.score}%`" />
                </div>
                <span class="text-sm font-medium">{{ g.score }}/{{ g.maxScore }}</span>
              </div>
            </td>
            <td class="table-cell"><span :class="gradeClass(g.grade)" class="font-bold">{{ g.grade }}</span></td>
            <td class="table-cell text-gray-500">{{ g.date }}</td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="text-center py-12 text-gray-400">No grades found</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <AppModal v-model="showAdd" title="Add Grade">
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select v-model="form.studentId" required class="input-field" @change="onStudentChange">
              <option v-for="s in store.students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select v-model="form.subject" required class="input-field">
              <option>Mathematics</option><option>Calculus</option><option>Algebra</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Assignment</label>
            <input v-model="form.assignment" required class="input-field" placeholder="Quiz 3" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Score</label>
            <input v-model.number="form.score" type="number" min="0" max="100" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
            <input v-model.number="form.maxScore" type="number" min="1" required class="input-field" />
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showAdd = false" class="btn-secondary flex-1">Cancel</button>
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
import SearchInput from '@/components/SearchInput.vue'
import { IconPlus } from '@/components/icons'

const store = useAppStore()
const search = ref('')
const filterClass = ref('')
const showAdd = ref(false)
const myClasses = ['10A', '12A', '8B']

const filtered = computed(() => store.grades.filter(g => {
  const q = search.value.toLowerCase()
  return g.teacher === 'Dr. Sarah Connor' &&
    (!q || g.studentName.toLowerCase().includes(q)) &&
    (!filterClass.value || store.students.find(s => s.name === g.studentName)?.grade === filterClass.value)
}))

const form = ref({ studentId: '', studentName: '', subject: 'Mathematics', assignment: '', score: 0, maxScore: 100, teacher: 'Dr. Sarah Connor', term: 'Term 2', date: '2026-05-19' })

function onStudentChange() {
  const s = store.students.find(s => s.id === form.value.studentId)
  if (s) form.value.studentName = s.name
}

function computeGrade(score, max) {
  const p = (score / max) * 100
  if (p >= 90) return 'A'; if (p >= 80) return 'B+'; if (p >= 70) return 'B'
  if (p >= 60) return 'C+'; if (p >= 50) return 'C'; if (p >= 40) return 'D'; return 'F'
}

function save() {
  store.addGrade({ ...form.value, grade: computeGrade(form.value.score, form.value.maxScore) })
  showAdd.value = false
}

function gradeClass(g) {
  if (g.startsWith('A')) return 'text-green-600'
  if (g.startsWith('B')) return 'text-blue-600'
  if (g.startsWith('C')) return 'text-amber-600'
  return 'text-red-600'
}
</script>
