<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Students" :value="analytics.totalStudents" sub="+12 this term" subColor="text-green-600" :icon="IconStudents" iconBg="bg-indigo-50" iconColor="text-indigo-600" />
      <StatCard label="Total Staff" :value="analytics.totalStaff" sub="8 departments" :icon="IconStaff" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      <StatCard label="Attendance Rate" :value="`${analytics.attendanceRate}%`" sub="Today's average" subColor="text-green-600" :icon="IconAttendance" iconBg="bg-amber-50" iconColor="text-amber-600" />
      <StatCard label="Fee Collection" :value="`${analytics.feeCollectionRate}%`" sub="This month" subColor="text-orange-500" :icon="IconFees" iconBg="bg-rose-50" iconColor="text-rose-600" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Attendance by class -->
      <div class="card lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">Attendance by Class</h3>
          <span class="text-xs text-gray-500">Today · May 19, 2026</span>
        </div>
        <div class="space-y-3">
          <div v-for="item in analytics.attendanceByClass" :key="item.class" class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-700 w-10">{{ item.class }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-2.5">
              <div class="h-2.5 rounded-full transition-all duration-500"
                :class="item.rate >= 95 ? 'bg-green-500' : item.rate >= 90 ? 'bg-amber-400' : 'bg-red-400'"
                :style="`width: ${item.rate}%`" />
            </div>
            <span class="text-sm font-semibold text-gray-700 w-10 text-right">{{ item.rate }}%</span>
          </div>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="card">
        <h3 class="section-title mb-4">Quick Overview</h3>
        <div class="space-y-3">
          <div v-for="item in quickStats" :key="item.label" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div class="flex items-center gap-2">
              <div :class="`w-2 h-2 rounded-full ${item.dot}`" />
              <span class="text-sm text-gray-600">{{ item.label }}</span>
            </div>
            <span class="text-sm font-semibold text-gray-900">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Grade distribution -->
      <div class="card">
        <h3 class="section-title mb-4">Grade Distribution · Term 2</h3>
        <div class="flex items-end gap-3 h-32">
          <div v-for="item in analytics.gradeDistribution" :key="item.grade" class="flex-1 flex flex-col items-center gap-1">
            <span class="text-xs font-semibold text-gray-600">{{ item.count }}</span>
            <div class="w-full rounded-t-md transition-all duration-500"
              :class="gradeColor(item.grade)"
              :style="`height: ${(item.count / 130) * 100}%`" />
            <span class="text-xs font-bold text-gray-700">{{ item.grade }}</span>
          </div>
        </div>
      </div>

      <!-- Recent announcements -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">Recent Announcements</h3>
          <RouterLink to="/admin/communication" class="text-xs text-indigo-600 hover:underline">View all</RouterLink>
        </div>
        <div class="space-y-3">
          <div v-for="ann in store.announcements.slice(0, 3)" :key="ann.id" class="flex gap-3">
            <div :class="`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ann.priority === 'High' ? 'bg-red-400' : ann.priority === 'Normal' ? 'bg-blue-400' : 'bg-gray-300'}`" />
            <div>
              <p class="text-sm font-medium text-gray-900">{{ ann.title }}</p>
              <p class="text-xs text-gray-500">{{ ann.date }} · {{ ann.author }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="section-title">Today's Attendance Snapshot</h3>
        <RouterLink to="/admin/attendance" class="text-xs text-indigo-600 hover:underline">Full report</RouterLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 rounded-lg">
            <tr>
              <th class="table-header rounded-l-lg">Student</th>
              <th class="table-header">Class</th>
              <th class="table-header">Status</th>
              <th class="table-header rounded-r-lg">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="rec in todayAttendance" :key="rec.id" class="hover:bg-gray-50 transition-colors">
              <td class="table-cell font-medium">{{ rec.studentName }}</td>
              <td class="table-cell text-gray-500">{{ rec.class }}</td>
              <td class="table-cell"><AppBadge :text="rec.status" /></td>
              <td class="table-cell text-gray-500">{{ rec.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app'
import StatCard from '@/components/StatCard.vue'
import AppBadge from '@/components/AppBadge.vue'
import { IconStudents, IconStaff, IconAttendance, IconFees } from '@/components/icons'

const store = useAppStore()
const analytics = computed(() => store.analytics)

const todayAttendance = computed(() => store.attendance.filter(a => a.date === '2026-05-19'))

const quickStats = [
  { label: 'Active Classes', value: '24', dot: 'bg-indigo-400' },
  { label: 'Upcoming Exams', value: '5', dot: 'bg-amber-400' },
  { label: 'Overdue Library Books', value: '8', dot: 'bg-red-400' },
  { label: 'Pending Fee Payments', value: '12', dot: 'bg-orange-400' },
  { label: 'New Enrollments', value: '3', dot: 'bg-green-400' },
  { label: 'Staff on Leave', value: '2', dot: 'bg-gray-400' },
]

function gradeColor(g) {
  return { A: 'bg-green-400', B: 'bg-blue-400', C: 'bg-amber-400', D: 'bg-orange-400', F: 'bg-red-400' }[g] || 'bg-gray-300'
}
</script>
