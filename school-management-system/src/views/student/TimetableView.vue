<template>
  <div class="space-y-6">
    <h2 class="page-title">My Timetable · Grade 10A</h2>
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px]">
          <thead class="bg-amber-500 text-white">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold w-32">Time</th>
              <th v-for="day in schedule" :key="day.day" class="px-4 py-3 text-left text-sm font-semibold">{{ day.day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time, idx) in timeSlots" :key="time" :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              <td class="px-4 py-3 text-xs font-semibold text-gray-500 border-r border-gray-100">{{ time }}</td>
              <td v-for="day in schedule" :key="day.day" class="px-3 py-2 border-r border-gray-100 last:border-0">
                <div v-if="getPeriod(day, time)" class="rounded-lg p-2" :class="subjectColor(getPeriod(day, time).subject)">
                  <p class="text-xs font-semibold">{{ getPeriod(day, time).subject }}</p>
                  <p class="text-xs opacity-75">{{ getPeriod(day, time).teacher }}</p>
                  <p class="text-xs opacity-60">{{ getPeriod(day, time).room }}</p>
                </div>
                <div v-else class="h-12 flex items-center justify-center">
                  <span class="text-xs text-gray-300">—</span>
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
const schedule = computed(() => store.timetable['10A'] || [])

function getPeriod(day, time) {
  return day.periods.find(p => p.time === time) || null
}

const colorMap = {
  Mathematics: 'bg-indigo-100 text-indigo-800', Science: 'bg-emerald-100 text-emerald-800',
  English: 'bg-amber-100 text-amber-800', History: 'bg-rose-100 text-rose-800',
  Art: 'bg-purple-100 text-purple-800', Music: 'bg-pink-100 text-pink-800',
  PE: 'bg-cyan-100 text-cyan-800', Assembly: 'bg-gray-100 text-gray-800',
}
function subjectColor(s) { return colorMap[s] || 'bg-gray-100 text-gray-700' }
</script>
