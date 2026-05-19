<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="page-title">Messages</h2>
      <button @click="showCompose = true" class="btn-primary text-sm flex items-center gap-2">
        <IconPlus class="w-4 h-4" /> Message Teacher
      </button>
    </div>

    <div class="space-y-3">
      <div v-for="msg in relevantMessages" :key="msg.id"
        :class="['card hover:shadow-md transition-shadow', !msg.read ? 'border-l-4 border-l-rose-500' : '']">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold text-rose-700">{{ msg.from.split(' ').map(n=>n[0]).join('').slice(0,2) }}</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-semibold text-gray-900">{{ msg.from }}</span>
              <span class="text-xs text-gray-400">{{ msg.fromRole }}</span>
              <span v-if="!msg.read" class="w-2 h-2 bg-rose-500 rounded-full" />
            </div>
            <p class="font-medium text-gray-900">{{ msg.subject }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ msg.body }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ msg.date }}</p>
          </div>
        </div>
      </div>
      <div v-if="relevantMessages.length === 0" class="text-center py-12 text-gray-400">No messages yet</div>
    </div>

    <AppModal v-model="showCompose" title="Message a Teacher">
      <form @submit.prevent="send" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
          <select v-model="form.to" required class="input-field">
            <option v-for="s in store.staff.filter(s => s.role === 'Teacher')" :key="s.id" :value="s.name">{{ s.name }} ({{ s.department }})</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input v-model="form.subject" required class="input-field" placeholder="Regarding Alice's progress..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea v-model="form.body" required rows="4" class="input-field resize-none" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showCompose = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Send Message</button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import { IconPlus } from '@/components/icons'

const store = useAppStore()
const showCompose = ref(false)
const form = ref({ to: '', subject: '', body: '' })

const relevantMessages = computed(() => store.messages.filter(m =>
  m.to === 'Robert Johnson' || m.from === 'Robert Johnson' || m.type === 'announcement'
))

function send() {
  store.sendMessage({ from: 'Robert Johnson', fromRole: 'Parent', to: form.value.to, toRole: 'Teacher', subject: form.value.subject, body: form.value.body, type: 'direct' })
  showCompose.value = false
  form.value = { to: '', subject: '', body: '' }
}
</script>
