<template>
  <div class="space-y-6">
    <h2 class="page-title">Fee Payments</h2>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><span class="text-sm font-bold text-green-600">${{ totalPaid }}</span></div>
        <div><p class="text-xs text-gray-500">Total Paid</p><p class="font-semibold text-gray-900">This Term</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><span class="text-sm font-bold text-red-600">${{ totalBalance }}</span></div>
        <div><p class="text-xs text-gray-500">Outstanding</p><p class="font-semibold text-gray-900">Balance</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><span class="text-sm font-bold text-indigo-600">{{ myFees.length }}</span></div>
        <div><p class="text-xs text-gray-500">Invoices</p><p class="font-semibold text-gray-900">This Term</p></div>
      </div>
    </div>

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
            <th class="table-header">Action</th>
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
            <td class="table-cell">
              <button v-if="f.balance > 0" @click="openPay(f)" class="btn-primary text-xs py-1.5 px-3">Pay Now</button>
              <span v-else class="text-xs text-gray-400">Settled</span>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Payment Modal -->
    <AppModal v-model="showPay" title="Make Payment">
      <div v-if="selectedFee" class="space-y-4">
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">Fee Type</p>
          <p class="font-semibold text-gray-900">{{ selectedFee.feeType }}</p>
          <p class="text-sm text-gray-500 mt-2">Outstanding Balance</p>
          <p class="text-2xl font-bold text-red-600">${{ selectedFee.balance.toLocaleString() }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
          <input v-model.number="payAmount" type="number" :max="selectedFee.balance" min="1" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="m in methods" :key="m.label" @click="payMethod = m.label"
              :class="['p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2', payMethod === m.label ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
              <span>{{ m.icon }}</span> {{ m.label }}
            </button>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button @click="showPay = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="submitPay" class="btn-primary flex-1 bg-rose-600 hover:bg-rose-700">Confirm Payment</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'

const store = useAppStore()
const showPay = ref(false)
const selectedFee = ref(null)
const payAmount = ref(0)
const payMethod = ref('Card')

const myFees = computed(() => store.feeRecords.filter(f => f.studentId === 'STU001'))
const totalPaid = computed(() => myFees.value.reduce((s, f) => s + f.paid, 0).toLocaleString())
const totalBalance = computed(() => myFees.value.reduce((s, f) => s + f.balance, 0).toLocaleString())

const methods = [
  { label: 'Card', icon: '💳' },
  { label: 'Bank Transfer', icon: '🏦' },
  { label: 'Mobile Money', icon: '📱' },
  { label: 'Cash', icon: '💵' },
]

function openPay(f) {
  selectedFee.value = f
  payAmount.value = f.balance
  showPay.value = true
}

function submitPay() {
  store.addFeePayment(selectedFee.value.id, payAmount.value, payMethod.value)
  showPay.value = false
}
</script>
