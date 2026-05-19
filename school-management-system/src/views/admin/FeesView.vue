<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">Fee Management</h2>
        <p class="text-sm text-gray-500 mt-1">Track invoices, payments, and receipts</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button class="btn-secondary text-sm flex items-center gap-2"><IconDownload class="w-4 h-4" /> Export</button>
        <button @click="openGenerateReceipt" class="btn-secondary text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Generate Receipt
        </button>
        <button @click="openNewPayment" class="btn-primary text-sm flex items-center gap-2"><IconPlus class="w-4 h-4" /> Record Payment</button>
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

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
        {{ tab.label }}
        <span v-if="tab.id === 'receipts'" class="ml-1.5 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">{{ receiptStore.receipts.length }}</span>
      </button>
    </div>

    <!-- ── INVOICES TAB ── -->
    <template v-if="activeTab === 'invoices'">
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
    </template>

    <!-- ── RECEIPTS TAB ── -->
    <template v-if="activeTab === 'receipts'">
      <div class="card p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <SearchInput v-model="receiptSearch" placeholder="Search receipts..." class="flex-1" />
        </div>
      </div>

      <div v-if="filteredReceipts.length === 0" class="card p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-gray-500 text-sm">No receipts yet. Record a payment to generate one.</p>
      </div>

      <div v-else class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="table-header">Receipt No.</th>
                <th class="table-header">Student</th>
                <th class="table-header">Fee Type</th>
                <th class="table-header">Amount Paid</th>
                <th class="table-header">Method</th>
                <th class="table-header">Template</th>
                <th class="table-header">Date</th>
                <th class="table-header">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="r in filteredReceipts" :key="r.id" class="hover:bg-gray-50 transition-colors">
                <td class="table-cell font-mono text-xs font-semibold text-indigo-700">{{ r.receiptNo }}</td>
                <td class="table-cell font-medium">{{ r.studentName }}</td>
                <td class="table-cell text-gray-600">{{ r.feeType }}</td>
                <td class="table-cell text-green-600 font-semibold">${{ r.amountPaid.toLocaleString() }}</td>
                <td class="table-cell text-gray-600">{{ r.method }}</td>
                <td class="table-cell text-xs text-gray-500">{{ r.templateName }}</td>
                <td class="table-cell text-gray-500 text-xs">{{ new Date(r.issuedAt).toLocaleDateString() }}</td>
                <td class="table-cell">
                  <div class="flex items-center gap-2">
                    <button @click="viewReceipt(r)" class="text-xs text-indigo-600 hover:underline font-medium">View</button>
                    <button @click="receiptStore.deleteReceipt(r.id)" class="text-xs text-red-500 hover:underline font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Generate Receipt Modal (standalone — no new payment) -->
    <AppModal v-model="showGenReceiptModal" title="Generate Receipt">
      <form @submit.prevent="submitGenerateReceipt" class="space-y-4">
        <p class="text-sm text-gray-500">Generate a receipt for an existing payment without recording a new transaction.</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Student & Fee</label>
          <select v-model="genForm.feeId" required class="input-field" @change="onGenFeeChange">
            <option value="" disabled>Select a fee record…</option>
            <option v-for="f in store.feeRecords.filter(f => f.paid > 0)" :key="f.id" :value="f.id">
              {{ f.studentName }} — {{ f.feeType }} (Paid: ${{ f.paid.toLocaleString() }})
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
          <select v-model="genForm.method" required class="input-field">
            <option>Card</option><option>Bank Transfer</option><option>Mobile Money</option><option>Cash</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Receipt Template</label>
          <select v-model="genForm.templateId" class="input-field">
            <option v-for="t in receiptStore.templates" :key="t.id" :value="t.id">
              {{ t.name }}{{ t.isDefault ? ' (Default)' : '' }}
            </option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showGenReceiptModal = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Generate & View Receipt</button>
        </div>
      </form>
    </AppModal>

    <!-- Payment Modal -->
    <AppModal v-model="showPayModal" title="Record Payment">
      <form @submit.prevent="submitPayment" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Student & Fee</label>
          <select v-model="payForm.feeId" required class="input-field">
            <option value="" disabled>Select a fee record…</option>
            <option v-for="f in store.feeRecords.filter(f => f.balance > 0)" :key="f.id" :value="f.id">
              {{ f.studentName }} — {{ f.feeType }} (Balance: ${{ f.balance.toLocaleString() }})
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Receipt Template</label>
          <select v-model="payForm.templateId" class="input-field">
            <option v-for="t in receiptStore.templates" :key="t.id" :value="t.id">
              {{ t.name }}{{ t.isDefault ? ' (Default)' : '' }}
            </option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showPayModal = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-success flex-1">Confirm & Generate Receipt</button>
        </div>
      </form>
    </AppModal>

    <!-- Receipt Viewer -->
    <ReceiptViewer v-model="showReceiptViewer" :receipt="selectedReceipt" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useReceiptStore } from '@/stores/receipts'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import SearchInput from '@/components/SearchInput.vue'
import ReceiptViewer from '@/components/ReceiptViewer.vue'
import { IconPlus, IconDownload } from '@/components/icons'

const store = useAppStore()
const receiptStore = useReceiptStore()

const activeTab = ref('invoices')
const tabs = [
  { id: 'invoices', label: 'Invoices' },
  { id: 'receipts', label: 'Receipts' },
]

// Invoices tab state
const search = ref('')
const filterStatus = ref('')
const filterType = ref('')
const showPayModal = ref(false)
const payForm = ref({ feeId: '', amount: 0, method: 'Card', templateId: receiptStore.defaultTemplate?.id })

// Receipts tab state
const receiptSearch = ref('')
const showReceiptViewer = ref(false)
const selectedReceipt = ref(null)

const filtered = computed(() => store.feeRecords.filter(f => {
  const q = search.value.toLowerCase()
  return (!q || f.studentName.toLowerCase().includes(q)) &&
    (!filterStatus.value || f.status === filterStatus.value) &&
    (!filterType.value || f.feeType === filterType.value)
}))

const filteredReceipts = computed(() => {
  const q = receiptSearch.value.toLowerCase()
  if (!q) return receiptStore.receipts
  return receiptStore.receipts.filter(r =>
    r.studentName.toLowerCase().includes(q) ||
    r.receiptNo.toLowerCase().includes(q) ||
    r.feeType.toLowerCase().includes(q)
  )
})

const totalPaid = computed(() => store.feeRecords.reduce((s, f) => s + f.paid, 0))
const totalBalance = computed(() => store.feeRecords.reduce((s, f) => s + f.balance, 0))
const overdueCount = computed(() => store.feeRecords.filter(f => f.status === 'Overdue').length)
const collectionRate = computed(() => {
  const total = store.feeRecords.reduce((s, f) => s + f.amount, 0)
  return total ? Math.round((totalPaid.value / total) * 100) : 0
})

// Generate Receipt (standalone) state
const showGenReceiptModal = ref(false)
const genForm = ref({ feeId: '', amountPaid: 0, method: 'Card', templateId: receiptStore.defaultTemplate?.id })
const genSelectedFee = computed(() => store.feeRecords.find(f => f.id === genForm.value.feeId) || null)

function openGenerateReceipt() {
  genForm.value = { feeId: '', amountPaid: 0, method: 'Card', templateId: receiptStore.defaultTemplate?.id }
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
    templateId: genForm.value.templateId,
    issuedBy: 'Admin',
  })
  showGenReceiptModal.value = false
  selectedReceipt.value = receipt
  showReceiptViewer.value = true
  activeTab.value = 'receipts'
}

function openNewPayment() {
  payForm.value = { feeId: '', amount: 0, method: 'Card', templateId: receiptStore.defaultTemplate?.id }
  showPayModal.value = true
}

function openPayment(f) {
  payForm.value = { feeId: f.id, amount: f.balance, method: 'Card', templateId: receiptStore.defaultTemplate?.id }
  showPayModal.value = true
}

function submitPayment() {
  const feeRecord = store.feeRecords.find(f => f.id === payForm.value.feeId)
  if (!feeRecord) return

  // Update fee record
  store.addFeePayment(payForm.value.feeId, payForm.value.amount, payForm.value.method)

  // Generate receipt with updated fee snapshot
  const updatedFee = store.feeRecords.find(f => f.id === payForm.value.feeId)
  const receipt = receiptStore.generateReceipt({
    feeRecord: updatedFee,
    amountPaid: payForm.value.amount,
    method: payForm.value.method,
    templateId: payForm.value.templateId,
    issuedBy: 'Admin',
  })

  showPayModal.value = false
  payForm.value = { feeId: '', amount: 0, method: 'Card', templateId: receiptStore.defaultTemplate?.id }

  // Show the generated receipt
  selectedReceipt.value = receipt
  showReceiptViewer.value = true
  activeTab.value = 'receipts'
}

function viewReceipt(r) {
  selectedReceipt.value = r
  showReceiptViewer.value = true
}
</script>
