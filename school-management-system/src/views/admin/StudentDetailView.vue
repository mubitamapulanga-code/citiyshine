<template>
  <div v-if="student" class="space-y-6">
    <div class="flex items-center gap-4">
      <RouterLink to="/admin/students" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </RouterLink>
      <h2 class="page-title">Student Profile</h2>
      <div class="ml-auto flex gap-2">
        <button @click="showEdit = true" class="btn-secondary text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Edit
        </button>
        <button @click="printProfile" class="btn-secondary text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Print
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile card -->
      <div class="card text-center">
        <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-indigo-700">{{ student.name.split(' ').map(n=>n[0]).join('') }}</span>
        </div>
        <h3 class="text-lg font-bold text-gray-900">{{ student.name }}</h3>
        <p class="text-sm text-gray-500">{{ student.id }}</p>
        <div class="mt-3"><AppBadge :text="student.status" /></div>
        <div class="mt-4 pt-4 border-t border-gray-100 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Grade</span>
            <span class="font-medium">{{ student.grade }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">GPA</span>
            <span class="font-semibold" :class="student.gpa >= 3.5 ? 'text-green-600' : 'text-amber-600'">{{ student.gpa }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Enrolled</span>
            <span class="font-medium">{{ student.enrollDate }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Blood Type</span>
            <span class="font-medium">{{ student.bloodType }}</span>
          </div>
        </div>
        <!-- QR Code placeholder -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-500 mb-2">Access Card QR</p>
          <div class="w-24 h-24 bg-gray-100 rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
            <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm8-2h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 13h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm8 0h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2z"/>
            </svg>
          </div>
          <p class="text-xs text-gray-400 mt-1">{{ student.id }}</p>
        </div>
      </div>

      <!-- Details -->
      <div class="lg:col-span-2 space-y-4">
        <div class="card">
          <h3 class="section-title mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><p class="text-gray-500">Date of Birth</p><p class="font-medium mt-0.5">{{ student.dob }}</p></div>
            <div><p class="text-gray-500">Gender</p><p class="font-medium mt-0.5">{{ student.gender }}</p></div>
            <div><p class="text-gray-500">Email</p><p class="font-medium mt-0.5">{{ student.email }}</p></div>
            <div><p class="text-gray-500">Phone</p><p class="font-medium mt-0.5">{{ student.phone }}</p></div>
            <div class="sm:col-span-2"><p class="text-gray-500">Address</p><p class="font-medium mt-0.5">{{ student.address }}</p></div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title mb-4">Parent / Guardian</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><p class="text-gray-500">Name</p><p class="font-medium mt-0.5">{{ student.parentName }}</p></div>
            <div><p class="text-gray-500">Phone</p><p class="font-medium mt-0.5">{{ student.parentPhone }}</p></div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title mb-4">Health Records</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><p class="text-gray-500">Allergies</p>
              <p class="font-medium mt-0.5" :class="student.allergies !== 'None' ? 'text-red-600' : 'text-gray-900'">{{ student.allergies }}</p>
            </div>
            <div><p class="text-gray-500">Blood Type</p><p class="font-medium mt-0.5">{{ student.bloodType }}</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grades -->
    <div class="card">
      <h3 class="section-title mb-4">Recent Grades</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">Subject</th>
              <th class="table-header">Assignment</th>
              <th class="table-header">Score</th>
              <th class="table-header">Grade</th>
              <th class="table-header">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="g in studentGrades" :key="g.id">
              <td class="table-cell font-medium">{{ g.subject }}</td>
              <td class="table-cell text-gray-600">{{ g.assignment }}</td>
              <td class="table-cell">{{ g.score }}/{{ g.maxScore }}</td>
              <td class="table-cell"><span :class="gradeClass(g.grade)" class="font-bold">{{ g.grade }}</span></td>
              <td class="table-cell text-gray-500">{{ g.date }}</td>
            </tr>
            <tr v-if="studentGrades.length === 0">
              <td colspan="5" class="text-center py-8 text-gray-400">No grades recorded</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-400">Student not found</div>

  <!-- Edit Modal -->
  <AppModal v-model="showEdit" title="Edit Student">
    <form v-if="editForm" @submit.prevent="saveEdit" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input v-model="editForm.name" required class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Grade</label>
          <select v-model="editForm.grade" class="input-field">
            <option v-for="g in grades" :key="g">{{ g }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="editForm.email" type="email" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input v-model="editForm.phone" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
          <input v-model="editForm.parentName" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
          <input v-model="editForm.parentPhone" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="editForm.status" class="input-field">
            <option>Active</option><option>Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
          <input v-model="editForm.allergies" class="input-field" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input v-model="editForm.address" class="input-field" />
        </div>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="button" @click="showEdit = false" class="btn-secondary flex-1">Cancel</button>
        <button type="submit" class="btn-primary flex-1">Save Changes</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AppBadge from '@/components/AppBadge.vue'
import AppModal from '@/components/AppModal.vue'

const route = useRoute()
const store = useAppStore()

const grades = ['8A', '8B', '9A', '9B', '9C', '10A', '10B', '11A', '11B', '12A', '12B']
const showEdit = ref(false)
const editForm = ref(null)

const student = computed(() => store.students.find(s => s.id === route.params.id))
const studentGrades = computed(() => store.grades.filter(g => g.studentId === route.params.id))

watch(showEdit, (v) => { if (v && student.value) editForm.value = { ...student.value } })

function saveEdit() {
  store.updateStudent(editForm.value.id, editForm.value)
  showEdit.value = false
}

function printProfile() {
  const styleSheets = Array.from(document.styleSheets)
  let cssText = ''
  for (const sheet of styleSheets) {
    try { cssText += Array.from(sheet.cssRules || []).map(r => r.cssText).join('\n') } catch { /* skip */ }
  }
  const content = document.querySelector('.space-y-6')
  if (!content) return
  const win = window.open('', '_blank', 'width=860,height=960')
  win.document.write(`<!DOCTYPE html><html><head>
    <title>Student Profile — ${student.value?.name}</title><meta charset="utf-8"/>
    <style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;padding:24px}
    @media print{body{padding:0}@page{margin:12mm}}
    button,a{display:none!important}
    ${cssText}</style>
  </head><body>${content.outerHTML}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 400)
}

function gradeClass(g) {
  if (g.startsWith('A')) return 'text-green-600'
  if (g.startsWith('B')) return 'text-blue-600'
  if (g.startsWith('C')) return 'text-amber-600'
  return 'text-red-600'
}
</script>
