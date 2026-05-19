<template>
  <div class="space-y-6">
    <h2 class="page-title">My Assignments</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="a in store.assignments" :key="a.id" class="card hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-semibold text-gray-900">{{ a.title }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ a.subject }} · {{ a.class }}</p>
          </div>
          <AppBadge :text="submitted.has(a.id) ? 'Submitted' : a.status"
            :color="submitted.has(a.id) ? 'green' : a.status === 'Due Soon' ? 'yellow' : 'blue'" />
        </div>
        <p class="text-xs text-gray-500 mb-4">{{ a.description }}</p>
        <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Due: <strong class="text-gray-700">{{ a.dueDate }}</strong></span>
          <span>{{ a.teacher }}</span>
        </div>
        <button v-if="!submitted.has(a.id)" @click="openSubmit(a)"
          class="btn-primary w-full text-sm">
          Submit Assignment
        </button>
        <div v-else class="flex items-center justify-center gap-2 py-2 text-sm text-green-600 font-medium bg-green-50 rounded-xl">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          Submitted
        </div>
      </div>
    </div>

    <!-- Submit Modal -->
    <AppModal v-model="showSubmit" :title="`Submit — ${activeAssignment?.title || ''}`">
      <div v-if="activeAssignment" class="space-y-4">
        <div class="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
          <p class="font-semibold text-gray-900">{{ activeAssignment.title }}</p>
          <p class="text-gray-500">{{ activeAssignment.subject }} · {{ activeAssignment.class }}</p>
          <p class="text-gray-500">Due: <span class="font-medium text-gray-700">{{ activeAssignment.dueDate }}</span></p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Your Answer / Notes</label>
          <textarea v-model="submitText" rows="4" class="input-field resize-none"
            placeholder="Write your answer or paste a link to your work..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
          <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer"
            @click="triggerFileInput">
            <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
            {{ attachmentName || 'Click to attach a file' }}
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="onFileChange" />
        </div>
        <div class="flex gap-3 pt-2">
          <button @click="showSubmit = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="confirmSubmit" class="btn-primary flex-1">Submit</button>
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
import { ref, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'

const store = useAppStore()

const showSubmit = ref(false)
const activeAssignment = ref(null)
const submitText = ref('')
const attachmentName = ref('')
const fileInput = ref(null)
const submitted = reactive(new Set())
const toast = ref('')
let toastTimer = null

function openSubmit(a) {
  activeAssignment.value = a
  submitText.value = ''
  attachmentName.value = ''
  showSubmit.value = true
}

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) attachmentName.value = file.name
}

function confirmSubmit() {
  if (!activeAssignment.value) return
  submitted.add(activeAssignment.value.id)
  // Increment submission count on the assignment
  const a = store.assignments.find(a => a.id === activeAssignment.value.id)
  if (a && a.submissions < a.total) a.submissions++
  showSubmit.value = false
  showToast(`"${activeAssignment.value.title}" submitted successfully!`)
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
