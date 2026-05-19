<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="page-title">Messages</h2>
      <button @click="showCompose = true" class="btn-primary text-sm flex items-center gap-2">
        <IconPlus class="w-4 h-4" /> New Message
      </button>
    </div>

    <div class="space-y-3">
      <div v-for="msg in myMessages" :key="msg.id"
        :class="['card hover:shadow-md transition-shadow cursor-pointer', !msg.read ? 'border-l-4 border-l-emerald-500' : '']">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-medium text-emerald-600">{{ msg.from }}</span>
              <span class="text-xs text-gray-400">→ {{ msg.to }}</span>
              <span v-if="!msg.read" class="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <h3 class="font-semibold text-gray-900">{{ msg.subject }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ msg.body }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ msg.date }}</p>
          </div>
        </div>
      </div>
      <div v-if="myMessages.length === 0" class="text-center py-12 text-gray-400">No messages</div>
    </div>

    <AppModal v-model="showCompose" title="New Message">
      <form @submit.prevent="send" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">To (Parent/Guardian)</label>
          <select v-model="form.to" required class="input-field">
            <option v-for="s in store.students" :key="s.id" :value="s.parentName">{{ s.parentName }} (Parent of {{ s.name }})</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input v-model="form.subject" required class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea v-model="form.body" required rows="4" class="input-field resize-none" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showCompose = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Send</button>
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
const myMessages = computed(() => store.messages.filter(m => m.from === 'Dr. Sarah Connor' || m.to === 'Dr. Sarah Connor'))
const form = ref({ to: '', subject: '', body: '' })

function send() {
  store.sendMessage({ from: 'Dr. Sarah Connor', fromRole: 'Teacher', to: form.value.to, toRole: 'Parent', subject: form.value.subject, body: form.value.body, type: 'direct' })
  showCompose.value = false
  form.value = { to: '', subject: '', body: '' }
}
</script>
