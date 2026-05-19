<template>
  <div class="space-y-6">
    <h2 class="page-title">Alice's Attendance Record</h2>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-green-600">{{ presentCount }}</span></div>
        <div><p class="text-xs text-gray-500">Days Present</p><p class="font-semibold text-gray-900">This Term</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-red-600">{{ absentCount }}</span></div>
        <div><p class="text-xs text-gray-500">Days Absent</p><p class="font-semibold text-gray-900">This Term</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-amber-600">{{ lateCount }}</span></div>
        <div><p class="text-xs text-gray-500">Days Late</p><p class="font-semibold text-gray-900">This Term</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-indigo-600">96%</span></div>
        <div><p class="text-xs text-gray-500">Rate</p><p class="font-semibold text-gray-900">Attendance</p></div>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="table-header">Date</th>
            <th class="table-header">Period</th>
            <th class="table-header">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="rec in aliceAttendance" :key="rec.id" class="hover:bg-gray-50">
            <td class="table-cell font-medium">{{ rec.date }}</td>
            <td class="table-cell text-gray-600">{{ rec.period }}</td>
            <td class="table-cell"><AppBadge :text="rec.status" /></td>
          </tr>
          <tr v-if="aliceAttendance.length === 0">
            <td colspan="3" class="text-center py-12 text-gray-400">No records found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppBadge from '@/components/AppBadge.vue'

const store = useAppStore()
const aliceAttendance = computed(() => store.attendance.filter(a => a.studentId === 'STU001'))
const presentCount = computed(() => aliceAttendance.value.filter(a => a.status === 'Present').length)
const absentCount = computed(() => aliceAttendance.value.filter(a => a.status === 'Absent').length)
const lateCount = computed(() => aliceAttendance.value.filter(a => a.status === 'Late').length)
</script>
