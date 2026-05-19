<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="page-title">Communication</h2>
      <button @click="showCompose = true" class="btn-primary text-sm flex items-center gap-2 self-start sm:self-auto">
        <IconPlus class="w-4 h-4" /> Compose
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Announcements -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex gap-2">
          <button @click="tab = 'announcements'" :class="['px-4 py-2 text-sm rounded-lg font-medium transition-colors', tab === 'announcements' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600']">Announcements</button>
          <button @click="tab = 'messages'" :class="['px-4 py-2 text-sm rounded-lg font-medium transition-colors', tab === 'messages' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600']">Messages</button>
        </div>

        <div v-if="tab === 'announcements'" class="space-y-3">
          <div v-for="ann in store.announcements" :key="ann.id" class="card hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <AppBadge :text="ann.priority" />
                  <span class="text-xs text-gray-400">{{ ann.audience }}</span>
                </div>
                <h3 class="font-semibold text-gray-900">{{ ann.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ ann.body }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ ann.date }} · {{ ann.author }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tab === 'messages'" class="space-y-3">
          <div v-for="msg in store.messages" :key="msg.id" :class="['card hover:shadow-md transition-shadow cursor-pointer', !msg.read ? 'border-l-4 border-l-indigo-500' : '']">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium text-indigo-600">{{ msg.from }}</span>
                  <span class="text-xs text-gray-400">→ {{ msg.to }}</span>
                  <span v-if="!msg.read" class="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <h3 class="font-semibold text-gray-900">{{ msg.subject }}</h3>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ msg.body }}</p>
                <p class="text-xs text-gray-400 mt-2">{{ msg.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: Quick stats -->
      <div class="space-y-4">
        <div class="card">
          <h3 class="section-title mb-4">Message Stats</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Total Messages</span>
              <span class="font-semibold">{{ store.messages.length }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Unread</span>
              <span class="font-semibold text-indigo-600">{{ store.messages.filter(m=>!m.read).length }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Announcements</span>
              <span class="font-semibold">{{ store.announcements.length }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title mb-4">Quick Broadcast</h3>
          <div class="space-y-3">
            <button v-for="b in broadcasts" :key="b.label" @click="quickBroadcast(b)"
            class="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm">
              <p class="font-medium text-gray-900">{{ b.label }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ b.desc }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compose Modal -->
    <AppModal v-model="showCompose" title="Compose Message">
      <form @submit.prevent="sendMsg" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select v-model="msgForm.type" class="input-field">
            <option value="announcement">Announcement (All)</option>
            <option value="direct">Direct Message</option>
          </select>
        </div>
        <div v-if="msgForm.type === 'direct'">
          <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input v-model="msgForm.to" class="input-field" placeholder="Recipient name" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input v-model="msgForm.subject" required class="input-field" placeholder="Message subject" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea v-model="msgForm.body" required rows="4" class="input-field resize-none" placeholder="Write your message..." />
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
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import { IconPlus } from '@/components/icons'

const store = useAppStore()
const auth = useAuthStore()
const tab = ref('announcements')
const showCompose = ref(false)
const msgForm = ref({ type: 'announcement', to: 'All', subject: '', body: '' })

const broadcasts = [
  { label: 'Fee Reminder', desc: 'Send to parents with overdue fees', subject: 'Fee Payment Reminder', body: 'This is a reminder that your child has an outstanding fee balance. Please make payment at your earliest convenience.' },
  { label: 'Exam Alert', desc: 'Notify students of upcoming exams', subject: 'Upcoming Exam Notification', body: 'Please be advised that Term 2 examinations begin on June 10, 2026. Ensure you review the exam schedule in the Academics section.' },
  { label: 'Attendance Alert', desc: 'Alert parents of absent students', subject: 'Attendance Notice', body: 'Your child was marked absent today. Please contact the school office if this was unplanned.' },
]

function quickBroadcast(b) {
  msgForm.value = { type: 'announcement', to: 'All', subject: b.subject, body: b.body }
  showCompose.value = true
}

function sendMsg() {
  store.sendMessage({ from: auth.user?.name, fromRole: auth.user?.role, to: msgForm.value.to, toRole: 'All', subject: msgForm.value.subject, body: msgForm.value.body, type: msgForm.value.type })
  showCompose.value = false
  msgForm.value = { type: 'announcement', to: 'All', subject: '', body: '' }
}
</script>
