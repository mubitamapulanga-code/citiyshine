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
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div class="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-rose-600">{{ leaveRequests.length }}</span></div>
        <div><p class="text-xs text-gray-500">Leave Requests</p><p class="font-semibold text-gray-900">Pending</p></div>
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
          <div v-if="s.subjects && s.subjects.length"><p class="text-gray-400">Subjects</p><p class="font-medium text-gray-700">{{ s.subjects.join(', ') }}</p></div>
          <div><p class="text-gray-400">Salary</p><p class="font-medium text-gray-700">${{ s.salary.toLocaleString() }}/yr</p></div>
        </div>
        <div class="mt-3 flex gap-2">
          <button @click="viewProfile(s)" class="btn-secondary text-xs py-1.5 flex-1">View Profile</button>
          <button @click="openLeave(s)" class="btn-secondary text-xs py-1.5 flex-1">Leave Request</button>
        </div>
      </div>
    </div>

    <!-- Add Staff Modal -->
    <AppModal v-model="showAdd" title="Add Staff Member">
      <form @submit.prevent="saveStaff" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="col-span-1 sm:col-span-2">
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

    <!-- View Profile Modal -->
    <AppModal v-model="showProfile" :title="profileStaff?.name || 'Staff Profile'">
      <div v-if="profileStaff" class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span class="text-xl font-bold text-indigo-700">{{ profileStaff.name.split(' ').filter(n=>n!=='Dr.'&&n!=='Mr.'&&n!=='Ms.').map(n=>n[0]).slice(0,2).join('') }}</span>
          </div>
          <div>
            <p class="font-bold text-gray-900 text-lg">{{ profileStaff.name }}</p>
            <p class="text-sm text-gray-500">{{ profileStaff.role }} · {{ profileStaff.department }}</p>
            <AppBadge :text="profileStaff.status" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-xl p-4">
          <div><p class="text-xs text-gray-500">Staff ID</p><p class="font-semibold font-mono">{{ profileStaff.id }}</p></div>
          <div><p class="text-xs text-gray-500">Email</p><p class="font-medium truncate">{{ profileStaff.email }}</p></div>
          <div><p class="text-xs text-gray-500">Phone</p><p class="font-medium">{{ profileStaff.phone }}</p></div>
          <div><p class="text-xs text-gray-500">Joined</p><p class="font-medium">{{ profileStaff.joinDate }}</p></div>
          <div><p class="text-xs text-gray-500">Qualification</p><p class="font-medium">{{ profileStaff.qualification }}</p></div>
          <div><p class="text-xs text-gray-500">Salary</p><p class="font-medium">${{ profileStaff.salary.toLocaleString() }}/yr</p></div>
          <div v-if="profileStaff.subjects && profileStaff.subjects.length" class="col-span-2">
            <p class="text-xs text-gray-500">Subjects</p>
            <p class="font-medium">{{ profileStaff.subjects.join(', ') }}</p>
          </div>
        </div>
        <button @click="showProfile = false" class="btn-secondary w-full">Close</button>
      </div>
    </AppModal>

    <!-- Leave Request Modal -->
    <AppModal v-model="showLeave" title="Submit Leave Request">
      <form @submit.prevent="submitLeave" class="space-y-4">
        <div class="bg-gray-50 rounded-xl p-3 text-sm">
          <p class="text-gray-500">Staff Member</p>
          <p class="font-semibold text-gray-900">{{ leaveStaff?.name }}</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input v-model="leaveForm.from" type="date" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input v-model="leaveForm.to" type="date" required class="input-field" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
          <select v-model="leaveForm.type" class="input-field">
            <option>Annual Leave</option><option>Sick Leave</option><option>Emergency Leave</option><option>Maternity/Paternity</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea v-model="leaveForm.reason" rows="3" class="input-field resize-none" placeholder="Brief reason for leave..." />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showLeave = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Submit Request</button>
        </div>
      </form>
    </AppModal>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
        <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        {{ toast }}
      </div>
    </Transition>
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
const showProfile = ref(false)
const showLeave = ref(false)
const profileStaff = ref(null)
const leaveStaff = ref(null)
const leaveRequests = ref([])
const toast = ref('')
let toastTimer = null

const teacherCount = computed(() => store.staff.filter(s => s.role === 'Teacher').length)
const adminCount = computed(() => store.staff.filter(s => s.role === 'Administrator').length)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return store.staff.filter(s => !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.department.toLowerCase().includes(q))
})

const form = ref({ name: '', role: 'Teacher', department: 'Mathematics', email: '', phone: '', qualification: '', salary: 0, subjects: [] })
const leaveForm = ref({ from: '', to: '', type: 'Annual Leave', reason: '' })

function saveStaff() {
  store.addStaff({ ...form.value, joinDate: new Date().toISOString().split('T')[0] })
  showAdd.value = false
  form.value = { name: '', role: 'Teacher', department: 'Mathematics', email: '', phone: '', qualification: '', salary: 0, subjects: [] }
}

function viewProfile(s) {
  profileStaff.value = s
  showProfile.value = true
}

function openLeave(s) {
  leaveStaff.value = s
  leaveForm.value = { from: '', to: '', type: 'Annual Leave', reason: '' }
  showLeave.value = true
}

function submitLeave() {
  leaveRequests.value.push({ ...leaveForm.value, staffId: leaveStaff.value.id, staffName: leaveStaff.value.name, submittedAt: new Date().toISOString() })
  showLeave.value = false
  showToast(`Leave request submitted for ${leaveStaff.value.name}`)
}

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
