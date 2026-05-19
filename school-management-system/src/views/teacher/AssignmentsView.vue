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
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Due: {{ a.dueDate }}
          </span>
        </div>
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-500">Submissions</span>
            <span class="font-semibold" :class="a.submissions === a.total ? 'text-green-600' : 'text-gray-700'">{{ a.submissions }}/{{ a.total }}</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="h-2 rounded-full transition-all" :class="a.submissions === a.total ? 'bg-green-500' : 'bg-emerald-500'" :style="`width:${(a.submissions/a.total)*100}%`" />
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="btn-secondary text-xs py-1.5 flex-1">View Submissions</button>
          <button class="btn-secondary text-xs py-1.5 flex-1">Grade All</button>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import { IconPlus } from '@/components/icons'

const store = useAppStore()
const showAdd = ref(false)
const myAssignments = computed(() => store.assignments.filter(a => a.teacher === 'Dr. Sarah Connor'))
const form = ref({ title: '', subject: 'Mathematics', class: '10A', dueDate: '', total: 25, submissions: 0, description: '', teacher: 'Dr. Sarah Connor', status: 'Active' })

function save() {
  store.assignments.push({ id: store.assignments.length + 1, ...form.value })
  showAdd.value = false
  form.value = { title: '', subject: 'Mathematics', class: '10A', dueDate: '', total: 25, submissions: 0, description: '', teacher: 'Dr. Sarah Connor', status: 'Active' }
}
</script>
