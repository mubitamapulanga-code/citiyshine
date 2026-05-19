<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">Attendance Management</h2>
        <p class="text-sm text-gray-500 mt-1">Track and manage daily attendance</p>
      </div>
      <div class="flex gap-2">
        <button @click="showMarkModal = true" class="btn-primary flex items-center gap-2 text-sm">
          <IconCheck class="w-4 h-4" /> Mark Attendance
        </button>
        <button class="btn-secondary flex items-center gap-2 text-sm">
          <IconDownload class="w-4 h-4" /> Export
        </button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in summary" :key="s.label" class="stat-card">
        <div :class="`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`">
          <span class="text-lg font-bold" :class="s.color">{{ s.value }}</span>
        </div>
        <div><p class="text-xs text-gray-500">{{ s.label }}</p><p class="text-sm font-semibold text-gray-700">{{ s.sub }}</p></div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <input v-model="filterDate" type="date" class="input-field w-full sm:w-44" />
        <select v-model="filterClass" class="input-field w-full sm:w-36">
          <option value="">All Classes</option>
          <option v-for="c in classes" :key="c">{{ c }}</option>
        </select>
        <select v-model="filterStatus" class="input-field w-full sm:w-36">
          <option value="">All Status</option>
          <option>Present</option><option>Absent</option><option>Late</option>
        </select>
        <SearchInput v-model="search" placeholder="Search student..." class="flex-1" />
      </div>
    </div>

    <!-- Table -->
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="table-header">Student</th>
              <th class="table-header">Class</th>
              <th class="table-header">Date</th>
              <th class="table-header">Period</th>
              <th class="table-header">Status</th>
              <th class="table-header">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="rec in filtered" :key="rec.id" class="hover:bg-gray-50 transition-colors">
              <td class="table-cell font-medium">{{ rec.studentName }}</td>
              <td class="table-cell"><span class="badge-blue">{{ rec.class }}</span></td>
              <td class="table-cell text-gray-500">{{ rec.date }}</td>
              <td class="table-cell text-gray-500">{{ rec.period }}</td>
              <td class="table-cell"><AppBadge :text="rec.status" /></td>
              <td class="table-cell">
                <select :value="rec.status" @change="updateStatus(rec, $event.target.value)" class="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option>Present</option><option>Absent</option><option>Late</option>
                </select>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="text-center py-12 text-gray-400">No records found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mark Attendance Modal -->
    <AppModal v-model="showMarkModal" title="Mark Attendance">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input v-model="markDate" type="date" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select v-model="markClass" class="input-field">
              <option v-for="c in classes" :key="c">{{ c }}</option>
            </select>
          </div>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div v-for="s in classStudents" :key="s.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-900">{{ s.name }}</span>
            <div class="flex gap-1">
              <button v-for="status in ['Present','Absent','Late']" :key="status"
                @click="markRecord[s.id] = status"
                :class="['px-2 py-1 text-xs rounded font-medium transition-colors', markRecord[s.id] === status ? statusBtnActive(status) : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100']">
                {{ status }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button @click="showMarkModal = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="submitAttendance" class="btn-primary flex-1">Save Attendance</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import SearchInput from '@/components/SearchInput.vue'
import { IconCheck, IconDownload } from '@/components/icons'

const store = useAppStore()
const search = ref('')
const filterDate = ref('2026-05-19')
const filterClass = ref('')
const filterStatus = ref('')
const showMarkModal = ref(false)
const markDate = ref('2026-05-19')
const markClass = ref('10A')
const markRecord = ref({})

const classes = ['8A', '8B', '9A', '9B', '9C', '10A', '10B', '11A', '11B', '12A']

const filtered = computed(() => store.attendance.filter(r => {
  const q = search.value.toLowerCase()
  return (!filterDate.value || r.date === filterDate.value) &&
    (!filterClass.value || r.class === filterClass.value) &&
    (!filterStatus.value || r.status === filterStatus.value) &&
    (!q || r.studentName.toLowerCase().includes(q))
}))

const classStudents = computed(() => store.students.filter(s => s.grade === markClass.value))

const summary = computed(() => {
  const today = store.attendance.filter(a => a.date === '2026-05-19')
  const present = today.filter(a => a.status === 'Present').length
  const absent = today.filter(a => a.status === 'Absent').length
  const late = today.filter(a => a.status === 'Late').length
  return [
    { label: 'Present Today', value: present, sub: 'Students', bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Absent Today', value: absent, sub: 'Students', bg: 'bg-red-50', color: 'text-red-600' },
    { label: 'Late Today', value: late, sub: 'Students', bg: 'bg-amber-50', color: 'text-amber-600' },
    { label: 'Rate', value: `${Math.round((present / (present + absent + late || 1)) * 100)}%`, sub: 'Attendance', bg: 'bg-indigo-50', color: 'text-indigo-600' },
  ]
})

function updateStatus(rec, status) {
  store.markAttendance([{ studentId: rec.studentId, studentName: rec.studentName, date: rec.date, status, period: rec.period, class: rec.class }])
}

function statusBtnActive(s) {
  return { Present: 'bg-green-500 text-white', Absent: 'bg-red-500 text-white', Late: 'bg-amber-500 text-white' }[s]
}

function submitAttendance() {
  const records = classStudents.value.map(s => ({
    studentId: s.id, studentName: s.name, date: markDate.value,
    status: markRecord.value[s.id] || 'Present', period: 'Full Day', class: markClass.value
  }))
  store.markAttendance(records)
  showMarkModal.value = false
  markRecord.value = {}
}
</script>
