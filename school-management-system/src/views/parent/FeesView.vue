<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 class="page-title">Fee Payments</h2>
      <button @click="openGenerateReceipt" class="btn-secondary text-sm flex items-center gap-2 w-fit">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Generate Receipt
      </button>
    </div>

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
        <div><p class="text-xs text-gray-500">Receipts</p><p class="font-semibold text-gray-900">Generated</p></div>
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
    </template>

    <!-- Receipts Tab -->
    <template v-if="activeTab === 'receipts'">
      <div v-if="myReceipts.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-gray-500 text-sm">No receipts yet. Make a payment to generate one.</p>
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

    <!-- Generate Receipt Modal (standalone) -->
    <AppModal v-model="showGenReceiptModal" title="Generate Receipt">
      <form @submit.prevent="submitGenerateReceipt" class="space-y-4">
        <p class="text-sm text-gray-500">Generate a receipt for an existing payment on your child's account.</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fee Record</label>
          <select v-model="genForm.feeId" required class="input-field" @change="onGenFeeChange">
            <option value="" disabled>Select a fee record…</option>
            <option v-for="f in myFees.filter(f => f.paid > 0)" :key="f.id" :value="f.id">
              {{ f.feeType }} (Paid: ${{ f.paid.toLocaleString() }})
            </option>
          </select>
        </div>
        <div v-if="genSelectedFee" class="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
          <div><p class="text-xs text-gray-500">Total Fee</p><p class="font-semibold">${{ genSelectedFee.amount.toLocaleString() }}</p></div>
          <div><p class="text-xs text-gray-500">Amount Paid</p><p class="font-semibold text-green-600">${{ genSelectedFee.paid.toLocaleString() }}</p></div>
          <div><p class="text-xs text-gray-500">Balance</p><p class="font-semibold" :class="genSelectedFee.balance > 0 ? 'text-red-600' : 'text-gray-400'">${{ genSelectedFee.balance.toLocaleString() }}</p></div>
          <div><p class="text-xs text-gray-500">Status</p><AppBadge :text="genSelectedFee.status" /></div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Amount to Show on Receipt</label>
          <input v-model.number="genForm.amountPaid" type="number" min="1" required class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="m in methods" :key="m.label" type="button" @click="genForm.method = m.label"
              :class="['p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2', genForm.method === m.label ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
              <span>{{ m.icon }}</span> {{ m.label }}
            </button>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showGenReceiptModal = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Generate & View Receipt</button>
        </div>
      </form>
    </AppModal>

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

    <!-- Receipt Viewer -->
    <ReceiptViewer v-model="showReceiptViewer" :receipt="viewingReceipt" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useReceiptStore } from '@/stores/receipts'
import { useAuthStore } from '@/stores/auth'
import AppModal from '@/components/AppModal.vue'
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

const showPay = ref(false)
const selectedFee = ref(null)
const payAmount = ref(0)
const payMethod = ref('Card')
const showReceiptViewer = ref(false)
const viewingReceipt = ref(null)

// Use the logged-in parent's child ID, fall back to STU001
const childId = computed(() => auth.user?.childId || 'STU001')

const myFees = computed(() => store.feeRecords.filter(f => f.studentId === childId.value))
const myReceipts = computed(() => receiptStore.getReceiptsByStudent(childId.value))
const totalPaid = computed(() => myFees.value.reduce((s, f) => s + f.paid, 0).toLocaleString())
const totalBalance = computed(() => myFees.value.reduce((s, f) => s + f.balance, 0).toLocaleString())

const methods = [
  { label: 'Card', icon: '💳' },
  { label: 'Bank Transfer', icon: '🏦' },
  { label: 'Mobile Money', icon: '📱' },
  { label: 'Cash', icon: '💵' },
]

// Generate Receipt (standalone) state
const showGenReceiptModal = ref(false)
const genForm = ref({ feeId: '', amountPaid: 0, method: 'Card' })
const genSelectedFee = computed(() => myFees.value.find(f => f.id === genForm.value.feeId) || null)

function openGenerateReceipt() {
  genForm.value = { feeId: '', amountPaid: 0, method: 'Card' }
  showGenReceiptModal.value = true
}

function onGenFeeChange() {
  const fee = genSelectedFee.value
  if (fee) {
    genForm.value.amountPaid = fee.paid
    genForm.value.method = fee.method || 'Card'
  }
}

function submitGenerateReceipt() {
  const fee = genSelectedFee.value
  if (!fee) return
  const receipt = receiptStore.generateReceipt({
    feeRecord: fee,
    amountPaid: genForm.value.amountPaid,
    method: genForm.value.method,
    templateId: receiptStore.defaultTemplate?.id,
    issuedBy: auth.user?.name || 'Parent Portal',
  })
  showGenReceiptModal.value = false
  viewingReceipt.value = receipt
  showReceiptViewer.value = true
  activeTab.value = 'receipts'
}

function openPay(f) {
  selectedFee.value = f
  payAmount.value = f.balance
  showPay.value = true
}

function submitPay() {
  const feeId = selectedFee.value.id
  const amount = payAmount.value
  const method = payMethod.value

  store.addFeePayment(feeId, amount, method)

  const updatedFee = store.feeRecords.find(f => f.id === feeId)
  const receipt = receiptStore.generateReceipt({
    feeRecord: updatedFee,
    amountPaid: amount,
    method,
    templateId: receiptStore.defaultTemplate?.id,
    issuedBy: auth.user?.name || 'Parent Portal',
  })

  showPay.value = false

  // Show the receipt immediately
  viewingReceipt.value = receipt
  showReceiptViewer.value = true
  activeTab.value = 'receipts'
}

function viewReceipt(r) {
  viewingReceipt.value = r
  showReceiptViewer.value = true
}
</script>
