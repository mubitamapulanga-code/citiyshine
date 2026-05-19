<template>
  <div class="space-y-6">
    <h2 class="page-title">My Timetable</h2>
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px]">
          <thead class="bg-emerald-600 text-white">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold w-32">Time</th>
              <th v-for="day in schedule" :key="day.day" class="px-4 py-3 text-left text-sm font-semibold">{{ day.day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time, idx) in timeSlots" :key="time" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              <td class="px-4 py-3 text-xs font-semibold text-gray-500 border-r border-gray-100">{{ time }}</td>
              <td v-for="day in schedule" :key="day.day" class="px-3 py-2 border-r border-gray-100 last:border-0">
                <div v-if="getPeriod(day, time)" class="rounded-lg p-2 bg-emerald-50 border border-emerald-200">
                  <p class="text-xs font-semibold text-emerald-800">{{ getPeriod(day, time).subject }}</p>
                  <p class="text-xs text-emerald-600">{{ getPeriod(day, time).class }}</p>
                  <p class="text-xs text-emerald-500">{{ getPeriod(day, time).room }}</p>
                </div>
                <div v-else class="h-12 flex items-center justify-center">
                  <span class="text-xs text-gray-300">Free</span>
                </div>
              </td>
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
const timeSlots = ['08:00-09:00', '09:00-10:00', '10:15-11:15', '11:15-12:15', '13:00-14:00']

const schedule = computed(() => {
  const tt = store.timetable['10A'] || []
  return tt.map(day => ({
    day: day.day,
    periods: day.periods.filter(p => p.teacher === 'Dr. Sarah Connor')
  }))
})

function getPeriod(day, time) {
  return day.periods.find(p => p.time === time) || null
}
</script>
