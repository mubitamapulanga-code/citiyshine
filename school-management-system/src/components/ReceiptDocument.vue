<template>
  <!-- This component renders a receipt using the chosen template.
       It is used both for on-screen preview and for print/PDF. -->
  <div :id="printId" class="receipt-root bg-white" :style="`--accent: ${template.accentColor}`">

    <!-- ── WATERMARK ─────────────────────────────────────────────────────── -->
    <div v-if="template.showWatermark" class="watermark">PAID</div>

    <!-- ── HEADER ────────────────────────────────────────────────────────── -->
    <div class="receipt-header" :style="`border-top: 4px solid ${template.accentColor}`">
      <div class="flex items-start justify-between gap-4">
        <!-- School branding -->
        <div class="flex items-center gap-3">
          <div v-if="template.showLogo"
            class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl"
            :style="`background: ${template.accentColor}`">
            GA
          </div>
          <div>
            <p class="text-lg font-bold text-gray-900 leading-tight">{{ receipt.schoolName }}</p>
            <p class="text-xs text-gray-500">{{ receipt.schoolAddress }}</p>
            <p class="text-xs text-gray-500">{{ receipt.schoolPhone }} · {{ receipt.schoolEmail }}</p>
          </div>
        </div>
        <!-- Receipt label -->
        <div class="text-right flex-shrink-0">
          <p v-if="template.headerNote" class="text-xs font-bold tracking-widest uppercase mb-1"
            :style="`color: ${template.accentColor}`">{{ template.headerNote }}</p>
          <p class="text-2xl font-extrabold text-gray-900">RECEIPT</p>
          <p class="text-sm font-mono font-semibold mt-1" :style="`color: ${template.accentColor}`">
            {{ receipt.receiptNo }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── META ROW ───────────────────────────────────────────────────────── -->
    <div class="receipt-meta-row" :style="`background: ${template.accentColor}12`">
      <div v-for="m in metaFields" :key="m.label" class="meta-cell">
        <p class="meta-label">{{ m.label }}</p>
        <p class="meta-value">{{ m.value }}</p>
      </div>
    </div>

    <!-- ── STUDENT SECTION ────────────────────────────────────────────────── -->
    <div class="receipt-section">
      <p class="section-heading" :style="`color: ${template.accentColor}`">Billed To</p>
      <div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
        <div class="detail-row"><span class="detail-label">Student Name</span><span class="detail-value">{{ receipt.studentName }}</span></div>
        <div class="detail-row"><span class="detail-label">Student ID</span><span class="detail-value font-mono">{{ receipt.studentId }}</span></div>
        <div class="detail-row"><span class="detail-label">Grade / Class</span><span class="detail-value">{{ receipt.grade }}</span></div>
        <div class="detail-row"><span class="detail-label">Fee Category</span><span class="detail-value">{{ receipt.feeType }}</span></div>
      </div>
    </div>

    <!-- ── PAYMENT BREAKDOWN ──────────────────────────────────────────────── -->
    <div class="receipt-section">
      <p class="section-heading" :style="`color: ${template.accentColor}`">Payment Details</p>
      <table class="breakdown-table mt-2">
        <thead>
          <tr :style="`background: ${template.accentColor}`">
            <th class="breakdown-th text-left">Description</th>
            <th class="breakdown-th text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr class="breakdown-row">
            <td class="breakdown-td">{{ receipt.feeType }} Fee — {{ academicYear }}</td>
            <td class="breakdown-td text-right">${{ receipt.totalFee.toLocaleString() }}</td>
          </tr>
          <tr v-if="receipt.previouslyPaid > 0" class="breakdown-row text-gray-500">
            <td class="breakdown-td">Previously Paid</td>
            <td class="breakdown-td text-right">−${{ receipt.previouslyPaid.toLocaleString() }}</td>
          </tr>
          <tr class="breakdown-row font-semibold">
            <td class="breakdown-td">Amount Due Before This Payment</td>
            <td class="breakdown-td text-right">${{ (receipt.totalFee - receipt.previouslyPaid).toLocaleString() }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr :style="`background: ${template.accentColor}18`">
            <td class="breakdown-td font-bold text-base">Amount Paid</td>
            <td class="breakdown-td text-right font-extrabold text-base" :style="`color: ${template.accentColor}`">
              ${{ receipt.amountPaid.toLocaleString() }}
            </td>
          </tr>
          <tr>
            <td class="breakdown-td text-gray-500">Remaining Balance</td>
            <td class="breakdown-td text-right font-semibold" :class="receipt.balanceAfter > 0 ? 'text-red-600' : 'text-green-600'">
              ${{ receipt.balanceAfter.toLocaleString() }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- ── PAYMENT METHOD + STATUS ────────────────────────────────────────── -->
    <div class="receipt-section flex items-center justify-between gap-4">
      <div>
        <p class="section-heading" :style="`color: ${template.accentColor}`">Payment Method</p>
        <div class="flex items-center gap-2 mt-1">
          <span class="method-icon">{{ methodIcon }}</span>
          <span class="text-sm font-semibold text-gray-800">{{ receipt.method }}</span>
        </div>
      </div>
      <div class="text-right">
        <div v-if="receipt.balanceAfter === 0"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
          :style="`background: ${template.accentColor}`">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          FULLY PAID
        </div>
        <div v-else class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-amber-100 text-amber-800">
          PARTIAL PAYMENT
        </div>
      </div>
    </div>

    <!-- ── SIGNATURE LINE ─────────────────────────────────────────────────── -->
    <div v-if="template.showSignatureLine" class="receipt-section">
      <div class="grid grid-cols-2 gap-8 mt-2">
        <div>
          <div class="border-b-2 border-gray-300 mb-1 h-8" />
          <p class="text-xs text-gray-500">Received By / Cashier</p>
          <p class="text-xs font-medium text-gray-700 mt-0.5">{{ receipt.issuedBy }}</p>
        </div>
        <div>
          <div class="border-b-2 border-gray-300 mb-1 h-8" />
          <p class="text-xs text-gray-500">Parent / Guardian Signature</p>
        </div>
      </div>
    </div>

    <!-- ── FOOTER ─────────────────────────────────────────────────────────── -->
    <div class="receipt-footer" :style="`border-top: 2px solid ${template.accentColor}30`">
      <p class="text-xs text-gray-500 text-center">{{ template.footerText }}</p>
      <p class="text-xs text-gray-400 text-center mt-1">
        Generated {{ formattedDate }} · Template: {{ template.name }}
      </p>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  receipt: { type: Object, required: true },
  template: { type: Object, required: true },
  printId: { type: String, default: 'receipt-print-area' },
})

const academicYear = '2025–2026'

const metaFields = computed(() => [
  { label: 'Receipt No.', value: props.receipt.receiptNo },
  { label: 'Date Issued', value: new Date(props.receipt.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
  { label: 'Time', value: new Date(props.receipt.issuedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
  { label: 'Issued By', value: props.receipt.issuedBy },
])

const methodIcon = computed(() => ({
  'Card': '💳', 'Bank Transfer': '🏦', 'Mobile Money': '📱', 'Cash': '💵',
}[props.receipt.method] || '💰'))

const formattedDate = computed(() =>
  new Date(props.receipt.issuedAt).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
)
</script>

<style scoped>
.receipt-root {
  position: relative;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-35deg);
  font-size: 7rem;
  font-weight: 900;
  color: rgba(0,0,0,0.04);
  pointer-events: none;
  user-select: none;
  letter-spacing: 0.1em;
  z-index: 0;
}

.receipt-header {
  padding: 1.5rem 1.75rem 1.25rem;
  position: relative;
  z-index: 1;
}

.receipt-meta-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.75rem 1.75rem;
  gap: 0.5rem;
}

.meta-cell { display: flex; flex-direction: column; }
.meta-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; font-weight: 600; }
.meta-value { font-size: 0.8rem; font-weight: 700; color: #111827; margin-top: 0.1rem; }

.receipt-section {
  padding: 1rem 1.75rem;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
  z-index: 1;
}

.section-heading {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.detail-row { display: flex; flex-direction: column; margin-bottom: 0.35rem; }
.detail-label { font-size: 0.65rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
.detail-value { font-size: 0.82rem; font-weight: 600; color: #1f2937; }

.breakdown-table { width: 100%; border-collapse: collapse; }
.breakdown-th { padding: 0.5rem 0.75rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: white; }
.breakdown-row { border-bottom: 1px solid #f3f4f6; }
.breakdown-td { padding: 0.55rem 0.75rem; font-size: 0.82rem; color: #374151; }

.method-icon { font-size: 1.25rem; }

.receipt-footer {
  padding: 1rem 1.75rem;
  position: relative;
  z-index: 1;
}

/* ── Print styles ─────────────────────────────────────────────────────────── */
@media print {
  .receipt-root {
    max-width: 100%;
    box-shadow: none !important;
  }
}
</style>
