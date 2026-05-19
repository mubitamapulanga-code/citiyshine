<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">All Receipts</h2>
        <p class="text-sm text-gray-500 mt-1">{{ receiptStore.receipts.length }} receipt{{ receiptStore.receipts.length !== 1 ? 's' : '' }} generated</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <!-- Bulk generate for ALL paid fees that have no receipt yet -->
        <button @click="bulkGenerate" class="btn-secondary text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Generate All Missing
          <span v-if="missingCount > 0" class="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full font-semibold">{{ missingCount }}</span>
        </button>
        <button @click="openGenModal" class="btn-primary text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Generate Receipt
        </button>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-indigo-600">{{ receiptStore.receipts.length }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Total</p><p class="font-semibold text-gray-900">Receipts</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-green-600">${{ totalReceiptAmount }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Total</p><p class="font-semibold text-gray-900">Receipted</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-amber-600">{{ missingCount }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Paid Fees</p><p class="font-semibold text-gray-900">No Receipt</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-purple-600">{{ uniqueStudents }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Students</p><p class="font-semibold text-gray-900">With Receipts</p></div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <SearchInput v-model="search" placeholder="Search by student, receipt no, fee type…" class="flex-1" />
        <select v-model="filterMethod" class="input-field w-full sm:w-40">
          <option value="">All Methods</option>
          <option>Card</option><option>Bank Transfer</option><option>Mobile Money</option><option>Cash</option>
        </select>
        <select v-model="filterTemplate" class="input-field w-full sm:w-44">
          <option value="">All Templates</option>
          <option v-for="t in receiptStore.templates" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
        <button v-if="search || filterMethod || filterTemplate" @click="clearFilters"
          class="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap px-2">Clear</button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="card p-16 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <p class="text-gray-500 font-medium">No receipts found</p>
      <p class="text-sm text-gray-400 mt-1">
        {{ receiptStore.receipts.length === 0 ? 'Record a payment or use Generate Receipt to create one.' : 'Try adjusting your filters.' }}
      </p>
      <button v-if="missingCount > 0" @click="bulkGenerate" class="btn-primary text-sm mt-4 mx-auto">
        Generate {{ missingCount }} Missing Receipt{{ missingCount !== 1 ? 's' : '' }}
      </button>
    </div>

    <!-- Receipts table -->
    <div v-else class="card p-0 overflow-hidden">
      <!-- Table toolbar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div class="flex items-center gap-3">
          <input type="checkbox" :checked="allSelected" @change="toggleSelectAll"
            class="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
          <span class="text-xs text-gray-500">
            {{ selected.size > 0 ? `${selected.size} selected` : `${filtered.length} receipts` }}
          </span>
        </div>
        <div v-if="selected.size > 0" class="flex items-center gap-2">
          <button @click="printSelected" class="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Print Selected
          </button>
          <button @click="deleteSelected" class="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Delete Selected
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="w-10 px-4 py-3"></th>
              <th class="table-header">Receipt No.</th>
              <th class="table-header">Student</th>
              <th class="table-header">Grade</th>
              <th class="table-header">Fee Type</th>
              <th class="table-header">Amount Paid</th>
              <th class="table-header">Balance After</th>
              <th class="table-header">Method</th>
              <th class="table-header">Template</th>
              <th class="table-header">Issued</th>
              <th class="table-header">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="r in filtered" :key="r.id"
              :class="['hover:bg-gray-50 transition-colors', selected.has(r.id) ? 'bg-indigo-50/40' : '']">
              <td class="px-4 py-3">
                <input type="checkbox" :checked="selected.has(r.id)" @change="toggleSelect(r.id)"
                  class="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
              </td>
              <td class="table-cell">
                <span class="font-mono text-xs font-semibold text-indigo-700">{{ r.receiptNo }}</span>
              </td>
              <td class="table-cell font-medium text-gray-900">{{ r.studentName }}</td>
              <td class="table-cell"><span class="badge-blue">{{ r.grade }}</span></td>
              <td class="table-cell text-gray-600">{{ r.feeType }}</td>
              <td class="table-cell font-semibold text-green-600">${{ r.amountPaid.toLocaleString() }}</td>
              <td class="table-cell text-sm" :class="r.balanceAfter > 0 ? 'text-red-500 font-medium' : 'text-gray-400'">
                ${{ r.balanceAfter.toLocaleString() }}
              </td>
              <td class="table-cell text-gray-600 text-xs">
                <span class="flex items-center gap-1">
                  <span>{{ methodIcon(r.method) }}</span> {{ r.method }}
                </span>
              </td>
              <td class="table-cell text-xs text-gray-500">{{ r.templateName }}</td>
              <td class="table-cell text-xs text-gray-500 whitespace-nowrap">
                {{ new Date(r.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <button @click="viewReceipt(r)"
                    class="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline">View</button>
                  <span class="text-gray-200">|</span>
                  <button @click="receiptStore.deleteReceipt(r.id)"
                    class="text-xs text-red-400 hover:text-red-600 font-medium hover:underline">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
          <!-- Footer totals -->
          <tfoot class="bg-gray-50 border-t-2 border-gray-200">
            <tr>
              <td colspan="5" class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Showing {{ filtered.length }} of {{ receiptStore.receipts.length }}
              </td>
              <td class="px-4 py-3 text-sm font-bold text-green-700">
                ${{ filteredTotal.toLocaleString() }}
              </td>
              <td colspan="5"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Hidden receipt render area for multi-print -->
    <div class="hidden" aria-hidden="true">
      <div v-for="r in receiptStore.receipts" :key="r.id" :data-receipt-id="r.id">
        <ReceiptDocument
          :receipt="r"
          :template="receiptStore.templates.find(t => t.id === r.templateId) || receiptStore.defaultTemplate"
          :print-id="`receipt-hidden-${r.id}`"
        />
      </div>
    </div>

    <!-- ── Generate Receipt Modal ── -->
    <AppModal v-model="showGenModal" title="Generate Receipt">
      <form @submit.prevent="submitGen" class="space-y-4">
        <p class="text-sm text-gray-500">Create a receipt for any fee record that has been paid (fully or partially).</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Student & Fee</label>
          <select v-model="genForm.feeId" required class="input-field" @change="onFeeChange">
            <option value="" disabled>Select a fee record…</option>
            <option v-for="f in store.feeRecords.filter(f => f.paid > 0)" :key="f.id" :value="f.id">
              {{ f.studentName }} — {{ f.feeType }} (Paid: ${{ f.paid.toLocaleString() }})
            </option>
          </select>
        </div>
        <div v-if="genSelectedFee" class="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
          <div><p class="text-xs text-gray-500">Total Fee</p><p class="font-semibold">${{ genSelectedFee.amount.toLocaleString() }}</p></div>
          <div><p class="text-xs text-gray-500">Amount Paid</p><p class="font-semibold text-green-600">${{ genSelectedFee.paid.toLocaleString() }}</p></div>
          <div><p class="text-xs text-gray-500">Balance</p>
            <p class="font-semibold" :class="genSelectedFee.balance > 0 ? 'text-red-600' : 'text-gray-400'">
              ${{ genSelectedFee.balance.toLocaleString() }}
            </p>
          </div>
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
          <button type="button" @click="showGenModal = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Generate & View</button>
        </div>
      </form>
    </AppModal>

    <!-- Bulk generate result toast -->
    <Transition name="toast">
      <div v-if="toastMsg" class="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
        <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        {{ toastMsg }}
      </div>
    </Transition>

    <!-- Receipt Viewer -->
    <ReceiptViewer v-model="showViewer" :receipt="viewingReceipt" />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { useReceiptStore } from '@/stores/receipts'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import SearchInput from '@/components/SearchInput.vue'
import ReceiptViewer from '@/components/ReceiptViewer.vue'
import ReceiptDocument from '@/components/ReceiptDocument.vue'

const store = useAppStore()
const receiptStore = useReceiptStore()

// ── Filters ───────────────────────────────────────────────────────────────────
const search = ref('')
const filterMethod = ref('')
const filterTemplate = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return receiptStore.receipts.filter(r => {
    const matchQ = !q || r.studentName.toLowerCase().includes(q) ||
      r.receiptNo.toLowerCase().includes(q) ||
      r.feeType.toLowerCase().includes(q)
    const matchMethod = !filterMethod.value || r.method === filterMethod.value
    const matchTpl = !filterTemplate.value || r.templateId === filterTemplate.value
    return matchQ && matchMethod && matchTpl
  })
})

const filteredTotal = computed(() => filtered.value.reduce((s, r) => s + r.amountPaid, 0))

function clearFilters() {
  search.value = ''
  filterMethod.value = ''
  filterTemplate.value = ''
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const totalReceiptAmount = computed(() =>
  (receiptStore.receipts.reduce((s, r) => s + r.amountPaid, 0) / 1000).toFixed(1) + 'k'
)

const uniqueStudents = computed(() =>
  new Set(receiptStore.receipts.map(r => r.studentId)).size
)

// Fee records that have been paid but have no receipt yet
const missingCount = computed(() => {
  const receiptedFeeIds = new Set(receiptStore.receipts.map(r => r.feeId))
  return store.feeRecords.filter(f => f.paid > 0 && !receiptedFeeIds.has(f.id)).length
})

// ── Selection ─────────────────────────────────────────────────────────────────
const selected = reactive(new Set())

const allSelected = computed(() =>
  filtered.value.length > 0 && filtered.value.every(r => selected.has(r.id))
)

function toggleSelect(id) {
  selected.has(id) ? selected.delete(id) : selected.add(id)
}

function toggleSelectAll() {
  if (allSelected.value) {
    filtered.value.forEach(r => selected.delete(r.id))
  } else {
    filtered.value.forEach(r => selected.add(r.id))
  }
}

function deleteSelected() {
  selected.forEach(id => receiptStore.deleteReceipt(id))
  selected.clear()
}

// ── Print selected ────────────────────────────────────────────────────────────
function printSelected() {
  const ids = [...selected]
  const toPrint = receiptStore.receipts.filter(r => ids.includes(r.id))
  if (!toPrint.length) return

  // Collect all stylesheet rules
  const styleSheets = Array.from(document.styleSheets)
  let cssText = ''
  for (const sheet of styleSheets) {
    try {
      cssText += Array.from(sheet.cssRules || []).map(r => r.cssText).join('\n')
    } catch { /* cross-origin */ }
  }

  // Build one page per receipt using the rendered DOM nodes
  const pages = toPrint.map(r => {
    const el = document.querySelector(`[data-receipt-id="${r.id}"]`)
    return el ? el.outerHTML : `<p style="padding:2rem">Receipt ${r.receiptNo} could not be rendered.</p>`
  }).join('<div style="page-break-after:always"></div>')

  const win = window.open('', '_blank', 'width=860,height=960')
  win.document.write(`<!DOCTYPE html>
<html><head>
  <title>Receipts</title>
  <meta charset="utf-8"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;background:white;padding:24px}
    @media print{body{padding:0}@page{margin:12mm}}
    ${cssText}
  </style>
</head><body>${pages}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 500)
}

// ── Bulk generate missing receipts ────────────────────────────────────────────
const toastMsg = ref('')
let toastTimer = null

function showToast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3500)
}

function bulkGenerate() {
  const receiptedFeeIds = new Set(receiptStore.receipts.map(r => r.feeId))
  const missing = store.feeRecords.filter(f => f.paid > 0 && !receiptedFeeIds.has(f.id))
  if (!missing.length) {
    showToast('All paid fees already have receipts.')
    return
  }
  missing.forEach(fee => {
    receiptStore.generateReceipt({
      feeRecord: fee,
      amountPaid: fee.paid,
      method: fee.method || 'Cash',
      templateId: receiptStore.defaultTemplate?.id,
      issuedBy: 'Admin',
    })
  })
  showToast(`Generated ${missing.length} receipt${missing.length !== 1 ? 's' : ''} successfully.`)
}

// ── Generate single receipt modal ─────────────────────────────────────────────
const showGenModal = ref(false)
const genForm = ref({ feeId: '', amountPaid: 0, method: 'Card', templateId: receiptStore.defaultTemplate?.id })
const genSelectedFee = computed(() => store.feeRecords.find(f => f.id === genForm.value.feeId) || null)

function openGenModal() {
  genForm.value = { feeId: '', amountPaid: 0, method: 'Card', templateId: receiptStore.defaultTemplate?.id }
  showGenModal.value = true
}

function onFeeChange() {
  const fee = genSelectedFee.value
  if (fee) {
    genForm.value.amountPaid = fee.paid
    genForm.value.method = fee.method || 'Card'
  }
}

function submitGen() {
  const fee = genSelectedFee.value
  if (!fee) return
  const receipt = receiptStore.generateReceipt({
    feeRecord: fee,
    amountPaid: genForm.value.amountPaid,
    method: genForm.value.method,
    templateId: genForm.value.templateId,
    issuedBy: 'Admin',
  })
  showGenModal.value = false
  viewingReceipt.value = receipt
  showViewer.value = true
}

// ── View receipt ──────────────────────────────────────────────────────────────
const showViewer = ref(false)
const viewingReceipt = ref(null)

function viewReceipt(r) {
  viewingReceipt.value = r
  showViewer.value = true
}

function methodIcon(m) {
  return { Card: '💳', 'Bank Transfer': '🏦', 'Mobile Money': '📱', Cash: '💵' }[m] || '💰'
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
