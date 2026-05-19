<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="page-title">Assignments</h2>
      <button @click="showAdd = true" class="btn-primary text-sm flex items-center gap-2 self-start sm:self-auto">
        <IconPlus class="w-4 h-4" /> New Assignment
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="a in myAssignments" :key="a.id" class="card hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-semibold text-gray-900">{{ a.title }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ a.subject }} · {{ a.class }}</p>
          </div>
          <AppBadge :text="a.status" :color="a.status === 'Due Soon' ? 'yellow' : 'blue'" />
        </div>
        <p class="text-xs text-gray-500 mb-4">{{ a.description }}</p>
        <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Due: {{ a.dueDate }}
          </span>
        </div>
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-500">Submissions</span>
            <span class="font-semibold" :class="a.submissions === a.total ? 'text-green-600' : 'text-gray-700'">
              {{ a.submissions }}/{{ a.total }}
            </span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="h-2 rounded-full transition-all"
              :class="a.submissions === a.total ? 'bg-green-500' : 'bg-emerald-500'"
              :style="`width:${(a.submissions/a.total)*100}%`" />
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button @click="viewSubmissions(a)" class="btn-secondary text-xs py-1.5 flex-1">View Submissions</button>
          <button @click="openGradeAll(a)" class="btn-secondary text-xs py-1.5 flex-1">Grade All</button>
        </div>
      </div>
    </div>

    <!-- New Assignment Modal -->
    <AppModal v-model="showAdd" title="New Assignment">
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input v-model="form.title" required class="input-field" placeholder="Assignment title" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select v-model="form.subject" class="input-field">
              <option>Mathematics</option><option>Calculus</option><option>Algebra</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select v-model="form.class" class="input-field">
              <option>10A</option><option>12A</option><option>8B</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input v-model="form.dueDate" type="date" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
            <input v-model.number="form.total" type="number" class="input-field" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="input-field resize-none" placeholder="Assignment instructions..." />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showAdd = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Create Assignment</button>
        </div>
      </form>
    </AppModal>

    <!-- View Submissions Modal -->
    <AppModal v-model="showSubmissions" :title="`Submissions — ${activeAssignment?.title || ''}`">
      <div v-if="activeAssignment" class="space-y-3">
        <div class="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
          <span>{{ activeAssignment.subject }} · {{ activeAssignment.class }}</span>
          <span class="font-semibold text-gray-900">{{ activeAssignment.submissions }}/{{ activeAssignment.total }} submitted</span>
        </div>
        <!-- Simulate student list for the class -->
        <div class="space-y-2 max-h-72 overflow-y-auto">
          <div v-for="s in classStudents" :key="s.id"
            class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-indigo-700">{{ s.name.split(' ').map(n=>n[0]).join('') }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ s.name }}</span>
            </div>
            <span :class="submittedIds.has(s.id) ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'"
              class="text-xs font-semibold px-2 py-0.5 rounded-full">
              {{ submittedIds.has(s.id) ? 'Submitted' : 'Pending' }}
            </span>
          </div>
        </div>
        <button @click="showSubmissions = false" class="btn-secondary w-full">Close</button>
      </div>
    </AppModal>

    <!-- Grade All Modal -->
    <AppModal v-model="showGradeAll" :title="`Grade All — ${activeAssignment?.title || ''}`">
      <div v-if="activeAssignment" class="space-y-3">
        <p class="text-sm text-gray-500">Enter scores for each student in {{ activeAssignment.class }}.</p>
        <div class="space-y-2 max-h-72 overflow-y-auto">
          <div v-for="s in classStudents" :key="s.id"
            class="flex items-center gap-3 p-2 rounded-xl border border-gray-100">
            <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-bold text-indigo-700">{{ s.name.split(' ').map(n=>n[0]).join('') }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900 flex-1">{{ s.name }}</span>
            <input v-model.number="gradeInputs[s.id]" type="number" min="0" :max="activeAssignment.total || 100"
              class="w-20 text-sm border border-gray-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="—" />
            <span class="text-xs text-gray-400">/{{ activeAssignment.total || 100 }}</span>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button @click="showGradeAll = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="saveGrades" class="btn-primary flex-1">Save Grades</button>
        </div>
      </div>
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
import { ref, computed, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import { IconPlus } from '@/components/icons'

const store = useAppStore()
const showAdd = ref(false)
const showSubmissions = ref(false)
const showGradeAll = ref(false)
const activeAssignment = ref(null)
const gradeInputs = reactive({})
const toast = ref('')
let toastTimer = null

const myAssignments = computed(() => store.assignments.filter(a => a.teacher === 'Dr. Sarah Connor'))

const classStudents = computed(() =>
  activeAssignment.value ? store.students.filter(s => s.grade === activeAssignment.value.class) : []
)

// Simulate which students have submitted (first N students based on submissions count)
const submittedIds = computed(() => {
  if (!activeAssignment.value) return new Set()
  const students = classStudents.value
  return new Set(students.slice(0, activeAssignment.value.submissions).map(s => s.id))
})

const form = ref({
  title: '', subject: 'Mathematics', class: '10A', dueDate: '',
  total: 25, submissions: 0, description: '', teacher: 'Dr. Sarah Connor', status: 'Active'
})

function save() {
  store.assignments.push({ id: store.assignments.length + 1, ...form.value })
  showAdd.value = false
  form.value = { title: '', subject: 'Mathematics', class: '10A', dueDate: '', total: 25, submissions: 0, description: '', teacher: 'Dr. Sarah Connor', status: 'Active' }
}

function viewSubmissions(a) {
  activeAssignment.value = a
  showSubmissions.value = true
}

function openGradeAll(a) {
  activeAssignment.value = a
  // Pre-fill existing grades
  classStudents.value.forEach(s => {
    const existing = store.grades.find(g => g.studentId === s.id && g.assignment === a.title)
    gradeInputs[s.id] = existing ? existing.score : null
  })
  showGradeAll.value = true
}

function saveGrades() {
  const a = activeAssignment.value
  classStudents.value.forEach(s => {
    const score = gradeInputs[s.id]
    if (score == null || score === '') return
    const pct = (score / (a.total || 100)) * 100
    const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B+' : pct >= 70 ? 'B' : pct >= 60 ? 'C+' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F'
    store.addGrade({
      studentId: s.id, studentName: s.name,
      subject: a.subject, assignment: a.title,
      score, maxScore: a.total || 100, grade,
      teacher: 'Dr. Sarah Connor', term: 'Term 2',
      date: new Date().toISOString().split('T')[0],
    })
  })
  showGradeAll.value = false
  showToast(`Grades saved for ${a.title}`)
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
