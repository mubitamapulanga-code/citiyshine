<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="page-title">Analytics & Reports</h2>
      <div class="flex gap-2">
        <select v-model="selectedTerm" class="input-field w-36 text-sm">
          <option>Term 2 · 2026</option>
          <option>Term 1 · 2026</option>
          <option>Term 2 · 2025</option>
        </select>
        <button @click="exportReport" class="btn-secondary text-sm flex items-center gap-2"><IconDownload class="w-4 h-4" /> Export Report</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="kpi in kpis" :key="kpi.label" class="card">
        <p class="text-sm text-gray-500">{{ kpi.label }}</p>
        <p class="text-3xl font-bold mt-1" :class="kpi.color">{{ kpi.value }}</p>
        <div class="flex items-center gap-1 mt-2">
          <span :class="kpi.trend > 0 ? 'text-green-500' : 'text-red-500'" class="text-xs font-medium">
            {{ kpi.trend > 0 ? '↑' : '↓' }} {{ Math.abs(kpi.trend) }}%
          </span>
          <span class="text-xs text-gray-400">vs last term</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Monthly Revenue -->
      <div class="card">
        <h3 class="section-title mb-4">Monthly Fee Revenue</h3>
        <div class="flex items-end gap-3 h-40">
          <div v-for="m in analytics.monthlyRevenue" :key="m.month" class="flex-1 flex flex-col items-center gap-1">
            <span class="text-xs font-semibold text-gray-600">${{ (m.amount/1000).toFixed(0) }}k</span>
            <div class="w-full bg-indigo-500 rounded-t-md transition-all duration-700 hover:bg-indigo-600"
              :style="`height: ${(m.amount / 100000) * 100}%`" />
            <span class="text-xs text-gray-500">{{ m.month }}</span>
          </div>
        </div>
      </div>

      <!-- Grade Distribution -->
      <div class="card">
        <h3 class="section-title mb-4">Grade Distribution · Term 2</h3>
        <div class="space-y-3">
          <div v-for="item in analytics.gradeDistribution" :key="item.grade" class="flex items-center gap-3">
            <span class="text-sm font-bold w-6" :class="gradeColor(item.grade)">{{ item.grade }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-3">
              <div class="h-3 rounded-full transition-all duration-500" :class="gradeBarColor(item.grade)"
                :style="`width: ${(item.count / 130) * 100}%`" />
            </div>
            <span class="text-sm font-semibold text-gray-700 w-8 text-right">{{ item.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Attendance by class -->
      <div class="card lg:col-span-2">
        <h3 class="section-title mb-4">Attendance Rate by Class</h3>
        <div class="space-y-3">
          <div v-for="item in analytics.attendanceByClass" :key="item.class" class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-700 w-10">{{ item.class }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-4">
              <div class="h-4 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                :class="item.rate >= 95 ? 'bg-green-500' : item.rate >= 90 ? 'bg-amber-400' : 'bg-red-400'"
                :style="`width: ${item.rate}%`">
                <span class="text-xs text-white font-semibold">{{ item.rate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick reports -->
      <div class="card">
        <h3 class="section-title mb-4">Quick Reports</h3>
        <div class="space-y-2">
          <button v-for="r in reports" :key="r" @click="downloadReport(r)"
            class="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-medium text-gray-700 flex items-center justify-between">
            {{ r }}
            <IconDownload class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>

    <!-- Audit log -->
    <div class="card">
      <h3 class="section-title mb-4">Recent Audit Log</h3>
      <div class="space-y-2">
        <div v-for="log in auditLogs" :key="log.id" class="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
          <div :class="`w-2 h-2 rounded-full flex-shrink-0 ${log.dot}`" />
          <span class="text-sm text-gray-700 flex-1">{{ log.action }}</span>
          <span class="text-xs text-gray-400">{{ log.user }}</span>
          <span class="text-xs text-gray-400">{{ log.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { IconDownload } from '@/components/icons'

const store = useAppStore()
const analytics = computed(() => store.analytics)
const selectedTerm = ref('Term 2 · 2026')

function exportReport() {
  const rows = [
    ['Metric', 'Value'],
    ['Total Students', '342'],
    ['Avg Attendance', '94.2%'],
    ['Avg GPA', '3.4'],
    ['Fee Collection Rate', '78.5%'],
    ['Term', selectedTerm.value],
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-report-${selectedTerm.value.replace(/\s·\s/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadReport(name) {
  const store2 = useAppStore()
  let rows = [['Report', name], ['Term', selectedTerm.value], ['Generated', new Date().toLocaleString()], []]

  if (name === 'Attendance Summary') {
    rows.push(['Student', 'Date', 'Status', 'Class'])
    store2.attendance.forEach(r => rows.push([r.studentName, r.date, r.status, r.class]))
  } else if (name === 'Fee Collection Report') {
    rows.push(['Student', 'Grade', 'Fee Type', 'Amount', 'Paid', 'Balance', 'Status'])
    store2.feeRecords.forEach(f => rows.push([f.studentName, f.grade, f.feeType, f.amount, f.paid, f.balance, f.status]))
  } else if (name === 'Term 2 Report Cards') {
    rows.push(['Student', 'Subject', 'Assignment', 'Score', 'Max', 'Grade'])
    store2.grades.forEach(g => rows.push([g.studentName, g.subject, g.assignment, g.score, g.maxScore, g.grade]))
  } else if (name === 'Staff Payroll Summary') {
    rows.push(['Name', 'Role', 'Department', 'Salary'])
    store2.staff.forEach(s => rows.push([s.name, s.role, s.department, s.salary]))
  } else if (name === 'Library Usage Report') {
    rows.push(['Book', 'Student', 'Issue Date', 'Due Date', 'Status'])
    store2.libraryIssues.forEach(i => rows.push([i.bookTitle, i.studentName, i.issueDate, i.dueDate, i.status]))
  }

  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const kpis = [
  { label: 'Total Students', value: '342', color: 'text-indigo-600', trend: 4.2 },
  { label: 'Avg Attendance', value: '94.2%', color: 'text-green-600', trend: 1.8 },
  { label: 'Avg GPA', value: '3.4', color: 'text-amber-600', trend: -0.2 },
  { label: 'Fee Collection', value: '78.5%', color: 'text-rose-600', trend: 5.1 },
]

const reports = [
  'Term 2 Report Cards',
  'Attendance Summary',
  'Fee Collection Report',
  'Staff Payroll Summary',
  'Library Usage Report',
]

const auditLogs = [
  { id: 1, action: 'Student STU009 enrolled by Admin', user: 'Thomas Harris', time: '10 min ago', dot: 'bg-green-400' },
  { id: 2, action: 'Fee payment recorded for Emma Wilson', user: 'Thomas Harris', time: '1 hr ago', dot: 'bg-blue-400' },
  { id: 3, action: 'Attendance marked for class 10A', user: 'Dr. Sarah Connor', time: '2 hrs ago', dot: 'bg-indigo-400' },
  { id: 4, action: 'Grade added: Alice Johnson — Mathematics 92/100', user: 'Dr. Sarah Connor', time: '3 hrs ago', dot: 'bg-amber-400' },
  { id: 5, action: 'Book issued: 1984 to Emma Wilson', user: 'Nancy White', time: '1 day ago', dot: 'bg-purple-400' },
]

function gradeColor(g) {
  return { A: 'text-green-600', B: 'text-blue-600', C: 'text-amber-600', D: 'text-orange-600', F: 'text-red-600' }[g]
}
function gradeBarColor(g) {
  return { A: 'bg-green-500', B: 'bg-blue-500', C: 'bg-amber-400', D: 'bg-orange-400', F: 'bg-red-400' }[g]
}
</script>
