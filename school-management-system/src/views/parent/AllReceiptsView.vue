<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">All Receipts</h2>
        <p class="text-sm text-gray-500 mt-1">{{ myReceipts.length }} receipt{{ myReceipts.length !== 1 ? 's' : '' }} for {{ auth.user?.childName || 'your child' }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
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

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-indigo-600">{{ myReceipts.length }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Total</p><p class="font-semibold text-gray-900">Receipts</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-green-600">${{ totalPaid }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Total</p><p class="font-semibold text-gray-900">Receipted</p></div>
      </div>
      <div class="stat-card">
        <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-amber-600">{{ missingCount }}</span>
        </div>
        <div><p class="text-xs text-gray-500">Paid Fees</p><p class="font-semibold text-gray-900">No Receipt</p></div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <SearchInput v-model="search" placeholder="Search by receipt no or fee type…" class="flex-1" />
        <select v-model="filterMethod" class="input-field w-full sm:w-40">
          <option value="">All Methods</option>
          <option>Card</option><option>Bank Transfer</option><option>Mobile Money</option><option>Cash</option>
        </select>
        <button v-if="search || filterMethod" @click="clearFilters"
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
        {{ myReceipts.length === 0 ? 'Make a payment or use Generate Receipt to create one.' : 'Try adjusting your filters.' }}
      </p>
      <button v-if="missingCount > 0" @click="bulkGenerate" class="btn-primary text-sm mt-4 mx-auto">
        Generate {{ missingCount }} Missing Receipt{{ missingCount !== 1 ? 's' : '' }}
      </button>
    </div>

    <!-- Receipt cards -->
    <div v-else class="space-y-3">
      <!-- Toolbar -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input type="checkbox" :checked="allSelected" @change="toggleSelectAll"
            class="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
          <span class="text-xs text-gray-500">
            {{ selected.size > 0 ? `${selected.size} selected` : `${filtered.length} receipts` }}
          </span>
        </div>
        <div v-if="selected.size > 0" class="flex items-center gap-2">
          <button @click="printSelected"
            class="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Print Selected
          </button>
        </div>
      </div>

      <!-- Cards -->
      <div v-for="r in filtered" :key="r.id"
        :class="['card p-4 flex items-center gap-4 transition-all', selected.has(r.id) ? 'ring-2 ring-indigo-400 bg-indigo-50/30' : 'hover:shadow-md']">
        <input type="checkbox" :checked="selected.has(r.id)" @change="toggleSelect(r.id)"
          class="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer flex-shrink-0" />

        <!-- Icon -->
        <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="font-mono text-xs font-bold text-indigo-700">{{ r.receiptNo }}</p>
            <span class="text-gray-300">·</span>
            <p class="text-sm font-medium text-gray-900">{{ r.feeType }}</p>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ new Date(r.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
            · {{ r.method }} · {{ r.templateName }}
          </p>
        </div>

        <!-- Amount -->
        <div class="text-right flex-shrink-0">
          <p class="font-bold text-green-600">${{ r.amountPaid.toLocaleString() }}</p>
          <p class="text-xs" :class="r.balanceAfter > 0 ? 'text-red-500' : 'text-gray-400'">
            Bal: ${{ r.balanceAfter.toLocaleString() }}
          </p>
        </div>

        <!-- Actions -->
        <button @click="viewReceipt(r)"
          class="flex-shrink-0 p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors" title="View Receipt">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        </button>
      </div>

      <!-- Footer total -->
      <div class="card p-4 flex items-center justify-between bg-gray-50">
        <p class="text-sm font-medium text-gray-600">Total shown</p>
        <p class="text-base font-bold text-green-700">${{ filteredTotal.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Generate Receipt Modal -->
    <AppModal v-model="showGenModal" title="Generate Receipt">
      <form @submit.prevent="submitGen" class="space-y-4">
        <p class="text-sm text-gray-500">Create a receipt for a fee that has already been paid.</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fee Record</label>
          <select v-model="genForm.feeId" required class="input-field" @change="onFeeChange">
            <option value="" disabled>Select a fee record…</option>
            <option v-for="f in myFees.filter(f => f.paid > 0)" :key="f.id" :value="f.id">
              {{ f.feeType }} (Paid: ${{ f.paid.toLocaleString() }})
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
          <div class="grid grid-cols-2 gap-2">
            <button v-for="m in methods" :key="m.label" type="button" @click="genForm.method = m.label"
              :class="['p-3 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-2',
                genForm.method === m.label ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
              <span>{{ m.icon }}</span> {{ m.label }}
            </button>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="button" @click="showGenModal = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">Generate & View</button>
        </div>
      </form>
    </AppModal>

    <!-- Toast -->
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
import { useAuthStore } from '@/stores/auth'
import AppModal from '@/components/AppModal.vue'
import AppBadge from '@/components/AppBadge.vue'
import SearchInput from '@/components/SearchInput.vue'
import ReceiptViewer from '@/components/ReceiptViewer.vue'

const store = useAppStore()
const receiptStore = useReceiptStore()
const auth = useAuthStore()

const childId = computed(() => auth.user?.childId || 'STU001')
const myFees = computed(() => store.feeRecords.filter(f => f.studentId === childId.value))
const myReceipts = computed(() => receiptStore.getReceiptsByStudent(childId.value))

// ── Filters ───────────────────────────────────────────────────────────────────
const search = ref('')
const filterMethod = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return myReceipts.value.filter(r => {
    const matchQ = !q || r.receiptNo.toLowerCase().includes(q) || r.feeType.toLowerCase().includes(q)
    const matchMethod = !filterMethod.value || r.method === filterMethod.value
    return matchQ && matchMethod
  })
})

const filteredTotal = computed(() => filtered.value.reduce((s, r) => s + r.amountPaid, 0))

function clearFilters() {
  search.value = ''
  filterMethod.value = ''
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const totalPaid = computed(() =>
  (myReceipts.value.reduce((s, r) => s + r.amountPaid, 0) / 1000).toFixed(1) + 'k'
)

const missingCount = computed(() => {
  const receiptedFeeIds = new Set(myReceipts.value.map(r => r.feeId))
  return myFees.value.filter(f => f.paid > 0 && !receiptedFeeIds.has(f.id)).length
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

// ── Print selected ────────────────────────────────────────────────────────────
function printSelected() {
  const ids = [...selected]
  const toPrint = myReceipts.value.filter(r => ids.includes(r.id))
  if (!toPrint.length) return

  const styleSheets = Array.from(document.styleSheets)
  let cssText = ''
  for (const sheet of styleSheets) {
    try { cssText += Array.from(sheet.cssRules || []).map(r => r.cssText).join('\n') } catch { /* skip */ }
  }

  const pages = toPrint.map(r => {
    const el = document.querySelector(`[data-receipt-id="${r.id}"]`)
    return el ? el.outerHTML : `<p style="padding:2rem">Receipt ${r.receiptNo} not rendered.</p>`
  }).join('<div style="page-break-after:always"></div>')

  const win = window.open('', '_blank', 'width=860,height=960')
  win.document.write(`<!DOCTYPE html><html><head>
    <title>Receipts</title><meta charset="utf-8"/>
    <style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;background:white;padding:24px}
    @media print{body{padding:0}@page{margin:12mm}}${cssText}</style>
  </head><body>${pages}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 500)
}

// ── Bulk generate ─────────────────────────────────────────────────────────────
const toastMsg = ref('')
let toastTimer = null

function showToast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 3500)
}

function bulkGenerate() {
  const receiptedFeeIds = new Set(myReceipts.value.map(r => r.feeId))
  const missing = myFees.value.filter(f => f.paid > 0 && !receiptedFeeIds.has(f.id))
  if (!missing.length) { showToast('All paid fees already have receipts.'); return }
  missing.forEach(fee => {
    receiptStore.generateReceipt({
      feeRecord: fee,
      amountPaid: fee.paid,
      method: fee.method || 'Cash',
      templateId: receiptStore.defaultTemplate?.id,
      issuedBy: auth.user?.name || 'Parent Portal',
    })
  })
  showToast(`Generated ${missing.length} receipt${missing.length !== 1 ? 's' : ''} successfully.`)
}

// ── Generate single ───────────────────────────────────────────────────────────
const showGenModal = ref(false)
const genForm = ref({ feeId: '', amountPaid: 0, method: 'Card' })
const genSelectedFee = computed(() => myFees.value.find(f => f.id === genForm.value.feeId) || null)

const methods = [
  { label: 'Card', icon: '💳' },
  { label: 'Bank Transfer', icon: '🏦' },
  { label: 'Mobile Money', icon: '📱' },
  { label: 'Cash', icon: '💵' },
]

function openGenModal() {
  genForm.value = { feeId: '', amountPaid: 0, method: 'Card' }
  showGenModal.value = true
}

function onFeeChange() {
  const fee = genSelectedFee.value
  if (fee) { genForm.value.amountPaid = fee.paid; genForm.value.method = fee.method || 'Card' }
}

function submitGen() {
  const fee = genSelectedFee.value
  if (!fee) return
  const receipt = receiptStore.generateReceipt({
    feeRecord: fee,
    amountPaid: genForm.value.amountPaid,
    method: genForm.value.method,
    templateId: receiptStore.defaultTemplate?.id,
    issuedBy: auth.user?.name || 'Parent Portal',
  })
  showGenModal.value = false
  viewingReceipt.value = receipt
  showViewer.value = true
}

// ── View ──────────────────────────────────────────────────────────────────────
const showViewer = ref(false)
const viewingReceipt = ref(null)

function viewReceipt(r) {
  viewingReceipt.value = r
  showViewer.value = true
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
