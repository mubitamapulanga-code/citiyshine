<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">Student Information</h2>
        <p class="text-sm text-gray-500 mt-1">{{ store.students.length }} students enrolled</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary flex items-center gap-2 text-sm" @click="importCSV">
          <IconUpload class="w-4 h-4" /> Import CSV
        </button>
        <button @click="showAdd = true" class="btn-primary flex items-center gap-2 text-sm">
          <IconPlus class="w-4 h-4" /> Add Student
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <SearchInput v-model="search" placeholder="Search by name, ID, or email..." class="flex-1" />
        <select v-model="filterGrade" class="input-field w-full sm:w-40">
          <option value="">All Grades</option>
          <option v-for="g in grades" :key="g">{{ g }}</option>
        </select>
        <select v-model="filterStatus" class="input-field w-full sm:w-36">
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="table-header">Student</th>
              <th class="table-header">ID</th>
              <th class="table-header">Grade</th>
              <th class="table-header">Parent</th>
              <th class="table-header">GPA</th>
              <th class="table-header">Status</th>
              <th class="table-header">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="s in paged" :key="s.id" class="hover:bg-gray-50 transition-colors">
              <td class="table-cell">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-bold text-indigo-700">{{ s.name.split(' ').map(n=>n[0]).join('') }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ s.name }}</p>
                    <p class="text-xs text-gray-500">{{ s.email }}</p>
                  </div>
                </div>
              </td>
              <td class="table-cell text-gray-500 font-mono text-xs">{{ s.id }}</td>
              <td class="table-cell"><span class="badge-blue">{{ s.grade }}</span></td>
              <td class="table-cell text-gray-600">{{ s.parentName }}</td>
              <td class="table-cell">
                <span :class="s.gpa >= 3.5 ? 'text-green-600' : s.gpa >= 2.5 ? 'text-amber-600' : 'text-red-600'" class="font-semibold">{{ s.gpa }}</span>
              </td>
              <td class="table-cell"><AppBadge :text="s.status" /></td>
              <td class="table-cell">
                <div class="flex items-center gap-1">
                  <RouterLink :to="`/admin/students/${s.id}`" class="p-1.5 rounded hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                    <IconEye class="w-4 h-4" />
                  </RouterLink>
                  <button @click="editStudent(s)" class="p-1.5 rounded hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors">
                    <IconEdit class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(s)" class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                    <IconTrash class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="7" class="text-center py-12 text-gray-400">No students found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <p class="text-sm text-gray-500">Showing {{ paged.length }} of {{ filtered.length }} students</p>
        <div class="flex gap-1">
          <button @click="page > 1 && page--" :disabled="page === 1"
            class="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
          <button v-for="p in totalPages" :key="p" @click="page = p"
            :class="['px-3 py-1 text-sm rounded', page === p ? 'bg-indigo-600 text-white' : 'border border-gray-200 hover:bg-gray-50']">{{ p }}</button>
          <button @click="page < totalPages && page++" :disabled="page === totalPages"
            class="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <AppModal v-model="showAdd" :title="editMode ? 'Edit Student' : 'Add New Student'">
      <form @submit.prevent="saveStudent" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input v-model="form.name" required class="input-field" placeholder="Alice Johnson" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
            <select v-model="form.grade" required class="input-field">
              <option v-for="g in grades" :key="g">{{ g }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input v-model="form.dob" type="date" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select v-model="form.gender" class="input-field">
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="student@school.edu" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input v-model="form.phone" class="input-field" placeholder="+1-555-0000" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
            <input v-model="form.parentName" class="input-field" placeholder="Parent / Guardian" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
            <input v-model="form.parentPhone" class="input-field" placeholder="+1-555-0000" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input v-model="form.address" class="input-field" placeholder="123 Main St" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Allergies / Medical Notes</label>
          <input v-model="form.allergies" class="input-field" placeholder="None" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showAdd = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">{{ editMode ? 'Save Changes' : 'Add Student' }}</button>
        </div>
      </form>
    </AppModal>

    <!-- Delete confirm -->
    <AppModal v-model="showDelete" title="Delete Student">
      <div class="text-center space-y-4">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <IconTrash class="w-6 h-6 text-red-600" />
        </div>
        <p class="text-gray-700">Are you sure you want to remove <strong>{{ deleteTarget?.name }}</strong>? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button @click="showDelete = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="doDelete" class="btn-danger flex-1">Delete</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import SearchInput from '@/components/SearchInput.vue'
import { IconPlus, IconEdit, IconTrash, IconEye, IconUpload } from '@/components/icons'

const store = useAppStore()
const search = ref('')
const filterGrade = ref('')
const filterStatus = ref('')
const showAdd = ref(false)
const showDelete = ref(false)
const editMode = ref(false)
const deleteTarget = ref(null)

const grades = ['8A', '8B', '9A', '9B', '9C', '10A', '10B', '11A', '11B', '12A', '12B']

const defaultForm = () => ({ name: '', grade: '10A', dob: '', gender: 'Male', email: '', phone: '', parentName: '', parentPhone: '', address: '', allergies: 'None' })
const form = ref(defaultForm())

const filtered = computed(() => store.students.filter(s => {
  const q = search.value.toLowerCase()
  const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
  const matchG = !filterGrade.value || s.grade === filterGrade.value
  const matchS = !filterStatus.value || s.status === filterStatus.value
  return matchQ && matchG && matchS
}))

const PAGE_SIZE = 10
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paged = computed(() => {
  // reset to page 1 when filter changes
  if (page.value > totalPages.value) page.value = 1
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

function importCSV() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(Boolean)
      const headers = lines[0].split(',').map(h => h.trim())
      lines.slice(1).forEach(line => {
        const vals = line.split(',').map(v => v.trim())
        const obj = {}
        headers.forEach((h, i) => { obj[h] = vals[i] || '' })
        if (obj.name) store.addStudent(obj)
      })
    }
    reader.readAsText(file)
  }
  input.click()
}

function editStudent(s) {
  form.value = { ...s }
  editMode.value = true
  showAdd.value = true
}

function saveStudent() {
  if (editMode.value) {
    store.updateStudent(form.value.id, form.value)
  } else {
    store.addStudent(form.value)
  }
  showAdd.value = false
  editMode.value = false
  form.value = defaultForm()
}

function confirmDelete(s) {
  deleteTarget.value = s
  showDelete.value = true
}

function doDelete() {
  store.deleteStudent(deleteTarget.value.id)
  showDelete.value = false
}
</script>
