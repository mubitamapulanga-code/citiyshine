<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">Fee Management</h2>
        <p class="text-sm text-gray-500 mt-1">Track invoices, payments, and balances</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-secondary text-sm flex items-center gap-2"><IconDownload class="w-4 h-4" /> Export</button>
        <button @click="showPayModal = true" class="btn-primary text-sm flex items-center gap-2"><IconPlus class="w-4 h-4" /> Record Payment</button>
      </div>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
          <span class="text-sm font-bold text-green-600">${{ (totalPaid/1000).toFixed(0) }}k</span>
        </div>
        <div><p class="text-xs text-gray-500">Total Collected</p><p class="font-semibold text-gray-900">This Month</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <span class="text-sm font-bold text-red-600">${{ (totalBalance/1000).toFixed(0) }}k</span>
        </div>
        <div><p class="text-xs text-gray-500">Outstanding</p><p class="font-semibold text-gray-900">Balance</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <span class="text-sm font-bold text-amber-600">{{ overdueCount }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Overdue</p><p class="font-semibold text-gray-900">Accounts</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <span class="text-sm font-bold text-indigo-600">{{ collectionRate }}%</span>
        </div>
        <div><p class="text-xs text-gray-500">Collection Rate</p><p class="font-semibold text-gray-900">This Term</p></div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <SearchInput v-model="search" placeholder="Search student..." class="flex-1" />
        <select v-model="filterStatus" class="input-field w-full sm:w-36">
          <option value="">All Status</option>
          <option>Paid</option><option>Partial</option><option>Overdue</option>
        </select>
        <select v-model="filterType" class="input-field w-full sm:w-36">
          <option value="">All Types</option>
          <option>Tuition</option><option>Transport</option><option>Library</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="table-header">Student</th>
              <th class="table-header">Grade</th>
              <th class="table-header">Fee Type</th>
              <th class="table-header">Amount</th>
              <th class="table-header">Paid</th>
              <th class="table-header">Balance</th>
              <th class="table-header">Due Date</th>
              <th class="table-header">Status</th>
              <th class="table-header">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="f in filtered" :key="f.id" class="hover:bg-gray-50 transition-colors">
              <td class="table-cell font-medium">{{ f.studentName }}</td>
              <td class="table-cell"><span class="badge-blue">{{ f.grade }}</span></td>
              <td class="table-cell text-gray-600">{{ f.feeType }}</td>
              <td class="table-cell font-medium">${{ f.amount.toLocaleString() }}</td>
              <td class="table-cell text-green-600 font-medium">${{ f.paid.toLocaleString() }}</td>
              <td class="table-cell" :class="f.balance > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'">${{ f.balance.toLocaleString() }}</td>
              <td class="table-cell text-gray-500">{{ f.dueDate }}</td>
              <td class="table-cell"><AppBadge :text="f.status" /></td>
              <td class="table-cell">
                <button v-if="f.balance > 0" @click="openPayment(f)" class="text-xs text-indigo-600 hover:underline font-medium">Pay Now</button>
                <span v-else class="text-xs text-gray-400">Settled</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payment Modal -->
    <AppModal v-model="showPayModal" title="Record Payment">
      <form @submit.prevent="submitPayment" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Student</label>
          <select v-model="payForm.feeId" required class="input-field">
            <option v-for="f in store.feeRecords.filter(f => f.balance > 0)" :key="f.id" :value="f.id">
              {{ f.studentName }} — {{ f.feeType }} (Balance: ${{ f.balance }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input v-model.number="payForm.amount" type="number" min="1" required class="input-field" placeholder="0.00" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select v-model="payForm.method" required class="input-field">
            <option>Card</option><option>Bank Transfer</option><option>Mobile Money</option><option>Cash</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showPayModal = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-success flex-1">Confirm Payment</button>
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
import { IconPlus, IconDownload } from '@/components/icons'

const store = useAppStore()
const search = ref('')
const filterStatus = ref('')
const filterType = ref('')
const showPayModal = ref(false)
const payForm = ref({ feeId: '', amount: 0, method: 'Card' })

const filtered = computed(() => store.feeRecords.filter(f => {
  const q = search.value.toLowerCase()
  return (!q || f.studentName.toLowerCase().includes(q)) &&
    (!filterStatus.value || f.status === filterStatus.value) &&
    (!filterType.value || f.feeType === filterType.value)
}))

const totalPaid = computed(() => store.feeRecords.reduce((s, f) => s + f.paid, 0))
const totalBalance = computed(() => store.feeRecords.reduce((s, f) => s + f.balance, 0))
const overdueCount = computed(() => store.feeRecords.filter(f => f.status === 'Overdue').length)
const collectionRate = computed(() => {
  const total = store.feeRecords.reduce((s, f) => s + f.amount, 0)
  return total ? Math.round((totalPaid.value / total) * 100) : 0
})

function openPayment(f) {
  payForm.value.feeId = f.id
  payForm.value.amount = f.balance
  showPayModal.value = true
}

function submitPayment() {
  store.addFeePayment(payForm.value.feeId, payForm.value.amount, payForm.value.method)
  showPayModal.value = false
  payForm.value = { feeId: '', amount: 0, method: 'Card' }
}
</script>
