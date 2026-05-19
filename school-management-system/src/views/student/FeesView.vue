<template>
  <div class="space-y-6">
    <h2 class="page-title">Fee Statement</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><span class="text-sm font-bold text-green-600">${{ totalPaid }}</span></div>
        <div><p class="text-xs text-gray-500">Total Paid</p><p class="font-semibold text-gray-900">This Term</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><span class="text-sm font-bold text-red-600">${{ totalBalance }}</span></div>
        <div><p class="text-xs text-gray-500">Outstanding</p><p class="font-semibold text-gray-900">Balance</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><span class="text-sm font-bold text-indigo-600">{{ myReceipts.length }}</span></div>
        <div><p class="text-xs text-gray-500">Receipts</p><p class="font-semibold text-gray-900">Available</p></div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        {{ tab.label }}
      </button>
    </div>

    <!-- Invoices Tab -->
    <template v-if="activeTab === 'invoices'">
      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="table-header">Fee Type</th>
                <th class="table-header">Amount</th>
                <th class="table-header">Paid</th>
                <th class="table-header">Balance</th>
                <th class="table-header">Due Date</th>
                <th class="table-header">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="f in myFees" :key="f.id" class="hover:bg-gray-50">
                <td class="table-cell font-medium">{{ f.feeType }}</td>
                <td class="table-cell">${{ f.amount.toLocaleString() }}</td>
                <td class="table-cell text-green-600 font-medium">${{ f.paid.toLocaleString() }}</td>
                <td class="table-cell" :class="f.balance > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'">${{ f.balance.toLocaleString() }}</td>
                <td class="table-cell text-gray-500">{{ f.dueDate }}</td>
                <td class="table-cell"><AppBadge :text="f.status" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Receipts Tab -->
    <template v-if="activeTab === 'receipts'">
      <div v-if="myReceipts.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-gray-500 text-sm">No receipts available yet.</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="r in myReceipts" :key="r.id"
          class="card p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer"
          @click="viewReceipt(r)">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-900 text-sm">{{ r.receiptNo }}</p>
              <p class="text-xs text-gray-500">{{ r.feeType }} · {{ new Date(r.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-green-600">${{ r.amountPaid.toLocaleString() }}</p>
            <p class="text-xs text-gray-400">{{ r.method }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Receipt Viewer -->
    <ReceiptViewer v-model="showReceiptViewer" :receipt="viewingReceipt" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useReceiptStore } from '@/stores/receipts'
import { useAuthStore } from '@/stores/auth'
import AppBadge from '@/components/AppBadge.vue'
import ReceiptViewer from '@/components/ReceiptViewer.vue'

const store = useAppStore()
const receiptStore = useReceiptStore()
const auth = useAuthStore()

const activeTab = ref('invoices')
const tabs = [
  { id: 'invoices', label: 'Invoices' },
  { id: 'receipts', label: 'My Receipts' },
]

const showReceiptViewer = ref(false)
const viewingReceipt = ref(null)

// Use the logged-in student's ID, fall back to STU001
const studentId = computed(() => auth.user?.studentId || 'STU001')

const myFees = computed(() => store.feeRecords.filter(f => f.studentId === studentId.value))
const myReceipts = computed(() => receiptStore.getReceiptsByStudent(studentId.value))
const totalPaid = computed(() => myFees.value.reduce((s, f) => s + f.paid, 0).toLocaleString())
const totalBalance = computed(() => myFees.value.reduce((s, f) => s + f.balance, 0).toLocaleString())

function viewReceipt(r) {
  viewingReceipt.value = r
  showReceiptViewer.value = true
}
</script>
