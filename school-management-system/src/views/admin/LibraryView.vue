<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="page-title">Library Management</h2>
      <div class="flex gap-2">
        <button @click="showIssue = true" class="btn-primary text-sm flex items-center gap-2"><IconPlus class="w-4 h-4" /> Issue Book</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-indigo-600">{{ store.libraryBooks.length }}</span></div>
        <div><p class="text-xs text-gray-500">Total Titles</p><p class="font-semibold text-gray-900">In Catalogue</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-green-600">{{ totalAvailable }}</span></div>
        <div><p class="text-xs text-gray-500">Available</p><p class="font-semibold text-gray-900">Copies</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-amber-600">{{ issuedCount }}</span></div>
        <div><p class="text-xs text-gray-500">Currently</p><p class="font-semibold text-gray-900">Issued</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><span class="text-lg font-bold text-red-600">{{ overdueCount }}</span></div>
        <div><p class="text-xs text-gray-500">Overdue</p><p class="font-semibold text-gray-900">Returns</p></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Catalogue -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="section-title">Book Catalogue</h3>
          <SearchInput v-model="bookSearch" placeholder="Search books..." class="w-48" />
        </div>
        <div class="card p-0 overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="table-header">Title</th>
                <th class="table-header">Category</th>
                <th class="table-header">Available</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="b in filteredBooks" :key="b.id" class="hover:bg-gray-50">
                <td class="table-cell">
                  <p class="font-medium text-sm">{{ b.title }}</p>
                  <p class="text-xs text-gray-500">{{ b.author }}</p>
                </td>
                <td class="table-cell"><span class="badge-blue text-xs">{{ b.category }}</span></td>
                <td class="table-cell">
                  <span :class="b.available === 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">{{ b.available }}/{{ b.copies }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Issues -->
      <div class="space-y-4">
        <h3 class="section-title">Active Issues & Returns</h3>
        <div class="card p-0 overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="table-header">Book</th>
                <th class="table-header">Student</th>
                <th class="table-header">Due</th>
                <th class="table-header">Status</th>
                <th class="table-header">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="issue in store.libraryIssues" :key="issue.id" class="hover:bg-gray-50">
                <td class="table-cell">
                  <p class="text-sm font-medium">{{ issue.bookTitle }}</p>
                </td>
                <td class="table-cell text-sm text-gray-600">{{ issue.studentName }}</td>
                <td class="table-cell text-sm" :class="issue.status === 'Overdue' ? 'text-red-600 font-semibold' : 'text-gray-600'">{{ issue.dueDate }}</td>
                <td class="table-cell"><AppBadge :text="issue.status" /></td>
                <td class="table-cell">
                  <button v-if="issue.status !== 'Returned'" @click="store.returnBook(issue.id)" class="text-xs text-indigo-600 hover:underline font-medium">Return</button>
                  <span v-else class="text-xs text-gray-400">Done</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Issue Book Modal -->
    <AppModal v-model="showIssue" title="Issue Book">
      <form @submit.prevent="submitIssue" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Book</label>
          <select v-model="issueForm.bookId" required class="input-field" @change="onBookChange">
            <option v-for="b in store.libraryBooks.filter(b => b.available > 0)" :key="b.id" :value="b.id">
              {{ b.title }} ({{ b.available }} available)
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Student</label>
          <select v-model="issueForm.studentId" required class="input-field" @change="onStudentChange">
            <option v-for="s in store.students" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input v-model="issueForm.issueDate" type="date" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input v-model="issueForm.dueDate" type="date" required class="input-field" />
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showIssue = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Issue Book</button>
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
const bookSearch = ref('')
const showIssue = ref(false)
const issueForm = ref({ bookId: '', bookTitle: '', studentId: '', studentName: '', issueDate: '2026-05-19', dueDate: '2026-06-02' })

const totalAvailable = computed(() => store.libraryBooks.reduce((s, b) => s + b.available, 0))
const issuedCount = computed(() => store.libraryIssues.filter(i => i.status === 'Issued').length)
const overdueCount = computed(() => store.libraryIssues.filter(i => i.status === 'Overdue').length)

const filteredBooks = computed(() => {
  const q = bookSearch.value.toLowerCase()
  return store.libraryBooks.filter(b => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
})

function onBookChange() {
  const b = store.libraryBooks.find(b => b.id === issueForm.value.bookId)
  if (b) issueForm.value.bookTitle = b.title
}

function onStudentChange() {
  const s = store.students.find(s => s.id === issueForm.value.studentId)
  if (s) issueForm.value.studentName = s.name
}

function submitIssue() {
  store.issueBook({ ...issueForm.value })
  showIssue.value = false
}
</script>
