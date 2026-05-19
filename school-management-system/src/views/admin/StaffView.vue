<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">HR & Staff</h2>
        <p class="text-sm text-gray-500 mt-1">{{ store.staff.length }} staff members</p>
      </div>
      <button @click="showAdd = true" class="btn-primary flex items-center gap-2 text-sm">
        <IconPlus class="w-4 h-4" /> Add Staff
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-indigo-600">{{ store.staff.length }}</span></div>
        <div><p class="text-xs text-gray-500">Total Staff</p><p class="font-semibold text-gray-900">All Roles</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-emerald-600">{{ teacherCount }}</span></div>
        <div><p class="text-xs text-gray-500">Teachers</p><p class="font-semibold text-gray-900">Active</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-amber-600">{{ adminCount }}</span></div>
        <div><p class="text-xs text-gray-500">Admin Staff</p><p class="font-semibold text-gray-900">Active</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-rose-600">2</span></div>
        <div><p class="text-xs text-gray-500">On Leave</p><p class="font-semibold text-gray-900">This Week</p></div>
      </div>
    </div>

    <div class="card p-4">
      <SearchInput v-model="search" placeholder="Search staff by name, role, or department..." />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="s in filtered" :key="s.id" class="card hover:shadow-md transition-shadow">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-bold text-indigo-700">{{ s.name.split(' ').filter(n=>n!=='Dr.'&&n!=='Mr.'&&n!=='Ms.').map(n=>n[0]).slice(0,2).join('') }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 truncate">{{ s.name }}</p>
            <p class="text-sm text-gray-500">{{ s.role }} · {{ s.department }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ s.email }}</p>
          </div>
          <AppBadge :text="s.status" />
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
          <div><p class="text-gray-400">Joined</p><p class="font-medium text-gray-700">{{ s.joinDate }}</p></div>
          <div><p class="text-gray-400">Qualification</p><p class="font-medium text-gray-700 truncate">{{ s.qualification }}</p></div>
          <div v-if="s.subjects.length"><p class="text-gray-400">Subjects</p><p class="font-medium text-gray-700">{{ s.subjects.join(', ') }}</p></div>
          <div><p class="text-gray-400">Salary</p><p class="font-medium text-gray-700">${{ s.salary.toLocaleString() }}/yr</p></div>
        </div>
        <div class="mt-3 flex gap-2">
          <button class="btn-secondary text-xs py-1.5 flex-1">View Profile</button>
          <button class="btn-secondary text-xs py-1.5 flex-1">Leave Request</button>
        </div>
      </div>
    </div>

    <AppModal v-model="showAdd" title="Add Staff Member">
      <form @submit.prevent="saveStaff" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input v-model="form.name" required class="input-field" placeholder="Dr. Jane Smith" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select v-model="form.role" required class="input-field">
              <option>Teacher</option><option>Administrator</option><option>Librarian</option><option>Counselor</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department *</label>
            <select v-model="form.department" required class="input-field">
              <option>Mathematics</option><option>Science</option><option>English</option><option>History</option><option>Administration</option><option>Library</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input v-model="form.phone" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input v-model="form.qualification" class="input-field" placeholder="MSc Mathematics" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Salary (USD/yr)</label>
            <input v-model.number="form.salary" type="number" class="input-field" placeholder="55000" />
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showAdd = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Add Staff</button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import SearchInput from '@/components/SearchInput.vue'
import { IconPlus } from '@/components/icons'

const store = useAppStore()
const search = ref('')
const showAdd = ref(false)

const teacherCount = computed(() => store.staff.filter(s => s.role === 'Teacher').length)
const adminCount = computed(() => store.staff.filter(s => s.role === 'Administrator').length)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return store.staff.filter(s => !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.department.toLowerCase().includes(q))
})

const form = ref({ name: '', role: 'Teacher', department: 'Mathematics', email: '', phone: '', qualification: '', salary: 0, subjects: [] })

function saveStaff() {
  store.addStaff({ ...form.value, joinDate: new Date().toISOString().split('T')[0] })
  showAdd.value = false
  form.value = { name: '', role: 'Teacher', department: 'Mathematics', email: '', phone: '', qualification: '', salary: 0, subjects: [] }
}
</script>
