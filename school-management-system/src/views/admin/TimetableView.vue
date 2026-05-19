<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="page-title">Timetable</h2>
      <div class="flex gap-2">
        <select v-model="selectedClass" class="input-field w-36">
          <option v-for="c in classes" :key="c">{{ c }}</option>
        </select>
        <button @click="exportPDF" class="btn-secondary text-sm flex items-center gap-2"><IconDownload class="w-4 h-4" /> Export PDF</button>
      </div>
    </div>

    <div v-if="schedule" class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px]">
          <thead class="bg-indigo-600 text-white">
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

    <!-- Legend -->
    <div class="card">
      <h3 class="section-title mb-3">Subject Color Legend</h3>
      <div class="flex flex-wrap gap-3">
        <div v-for="item in legend" :key="item.subject" class="flex items-center gap-2">
          <div :class="`w-3 h-3 rounded ${item.dot}`" />
          <span class="text-sm text-gray-600">{{ item.subject }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { IconDownload } from '@/components/icons'

const store = useAppStore()
const selectedClass = ref('10A')
const classes = ['8A', '8B', '9A', '9B', '9C', '10A', '10B', '11A', '11B', '12A']
const timeSlots = ['08:00-09:00', '09:00-10:00', '10:15-11:15', '11:15-12:15', '13:00-14:00']

const schedule = computed(() => store.timetable[selectedClass.value] || null)

function getPeriod(day, time) {
  return day.periods.find(p => p.time === time) || null
}

const colorMap = {
  Mathematics: 'bg-indigo-100 text-indigo-800',
  Science: 'bg-emerald-100 text-emerald-800',
  English: 'bg-amber-100 text-amber-800',
  History: 'bg-rose-100 text-rose-800',
  Art: 'bg-purple-100 text-purple-800',
  Music: 'bg-pink-100 text-pink-800',
  PE: 'bg-cyan-100 text-cyan-800',
  Assembly: 'bg-gray-100 text-gray-800',
}

function subjectColor(subject) {
  return colorMap[subject] || 'bg-gray-100 text-gray-700'
}

function exportPDF() {
  const styleSheets = Array.from(document.styleSheets)
  let cssText = ''
  for (const sheet of styleSheets) {
    try { cssText += Array.from(sheet.cssRules || []).map(r => r.cssText).join('\n') } catch { /* skip */ }
  }
  const table = document.querySelector('table')
  if (!table) return
  const win = window.open('', '_blank', 'width=900,height=700')
  win.document.write(`<!DOCTYPE html><html><head>
    <title>Timetable — ${selectedClass.value}</title><meta charset="utf-8"/>
    <style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;padding:24px}
    @media print{body{padding:0}@page{margin:10mm;size:landscape}}
    ${cssText}</style>
  </head><body>${table.outerHTML}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 400)
}

const legend = [
  { subject: 'Mathematics', dot: 'bg-indigo-400' },
  { subject: 'Science', dot: 'bg-emerald-400' },
  { subject: 'English', dot: 'bg-amber-400' },
  { subject: 'History', dot: 'bg-rose-400' },
  { subject: 'Art', dot: 'bg-purple-400' },
  { subject: 'Music', dot: 'bg-pink-400' },
  { subject: 'PE', dot: 'bg-cyan-400' },
]
</script>
