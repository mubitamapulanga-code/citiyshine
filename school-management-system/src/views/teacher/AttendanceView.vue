<template>
  <div class="space-y-6">
    <h2 class="page-title">Mark Attendance</h2>

    <div class="card">
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input v-model="date" type="date" class="input-field w-44" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select v-model="selectedClass" class="input-field w-36">
            <option v-for="c in myClasses" :key="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Period</label>
          <select v-model="period" class="input-field w-36">
            <option>Full Day</option>
            <option>Period 1</option>
            <option>Period 2</option>
            <option>Period 3</option>
          </select>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="flex gap-2 mb-4">
        <button @click="markAll('Present')" class="btn-success text-sm">Mark All Present</button>
        <button @click="markAll('Absent')" class="btn-danger text-sm">Mark All Absent</button>
      </div>

      <div class="space-y-2">
        <div v-for="s in classStudents" :key="s.id" class="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-bold text-emerald-700">{{ s.name.split(' ').map(n=>n[0]).join('') }}</span>
            </div>
            <div class="min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ s.name }}</p>
              <p class="text-xs text-gray-500">{{ s.id }}</p>
            </div>
          </div>
          <div class="flex gap-1 flex-shrink-0 ml-2">
            <button v-for="status in ['Present', 'Absent', 'Late']" :key="status"
              @click="records[s.id] = status"
              :class="['px-2 sm:px-3 py-1.5 text-xs rounded-lg font-medium transition-all', records[s.id] === status ? activeClass(status) : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
              <span class="hidden sm:inline">{{ status }}</span>
              <span class="sm:hidden">{{ status[0] }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex flex-wrap gap-3 text-sm">
          <span class="text-green-600 font-medium">Present: {{ countStatus('Present') }}</span>
          <span class="text-red-600 font-medium">Absent: {{ countStatus('Absent') }}</span>
          <span class="text-amber-600 font-medium">Late: {{ countStatus('Late') }}</span>
        </div>
        <button @click="submit" class="btn-primary self-start sm:self-auto">Save Attendance</button>
      </div>
    </div>

    <!-- Saved confirmation -->
    <Transition name="fade">
      <div v-if="saved" class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
        <IconCheck class="w-5 h-5" />
        Attendance saved successfully!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { IconCheck } from '@/components/icons'

const store = useAppStore()
const date = ref('2026-05-19')
const selectedClass = ref('10A')
const period = ref('Full Day')
const records = ref({})
const saved = ref(false)
const myClasses = ['10A', '12A', '8B']

const classStudents = computed(() => store.students.filter(s => s.grade === selectedClass.value))

function markAll(status) {
  classStudents.value.forEach(s => { records.value[s.id] = status })
}

function countStatus(status) {
  return Object.values(records.value).filter(v => v === status).length
}

function activeClass(status) {
  return { Present: 'bg-green-500 text-white', Absent: 'bg-red-500 text-white', Late: 'bg-amber-500 text-white' }[status]
}

function submit() {
  const recs = classStudents.value.map(s => ({
    studentId: s.id, studentName: s.name, date: date.value,
    status: records.value[s.id] || 'Present', period: period.value, class: selectedClass.value
  }))
  store.markAttendance(recs)
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
