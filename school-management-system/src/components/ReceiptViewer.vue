<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

        <div class="relative bg-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
          <!-- Toolbar -->
          <div class="flex items-center justify-between px-5 py-3 bg-white rounded-t-2xl border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ receipt?.receiptNo }}</p>
                <p class="text-xs text-gray-500">{{ receipt?.studentName }} · {{ receipt?.feeType }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <!-- Template switcher -->
              <select v-model="activeTemplateId"
                class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option v-for="t in receiptStore.templates" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
              <button @click="handlePrint"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                Print
              </button>
              <button @click="$emit('update:modelValue', false)"
                class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Receipt preview -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="shadow-xl rounded-xl overflow-hidden">
              <ReceiptDocument
                v-if="receipt && activeTemplate"
                :receipt="receipt"
                :template="activeTemplate"
                print-id="receipt-print-area"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useReceiptStore } from '@/stores/receipts'
import ReceiptDocument from './ReceiptDocument.vue'

const props = defineProps({
  modelValue: Boolean,
  receipt: Object,
  /** Optionally force a specific template (e.g. from template preview) */
  initialTemplateId: { type: String, default: null },
})
defineEmits(['update:modelValue'])

const receiptStore = useReceiptStore()

// Resolve starting template: explicit prop > receipt's own template > store default
const activeTemplateId = ref(
  props.initialTemplateId ||
  props.receipt?.templateId ||
  receiptStore.defaultTemplate?.id
)

watch(
  () => [props.receipt, props.initialTemplateId, props.modelValue],
  ([r, forcedId, open]) => {
    if (open) {
      activeTemplateId.value = forcedId || r?.templateId || receiptStore.defaultTemplate?.id
    }
  }
)

const activeTemplate = computed(() =>
  receiptStore.templates.find(t => t.id === activeTemplateId.value) || receiptStore.defaultTemplate
)

// ── Print ─────────────────────────────────────────────────────────────────────
function handlePrint() {
  const el = document.getElementById('receipt-print-area')
  if (!el) return

  // Collect all stylesheet text from the current document so scoped styles are included
  const styleSheets = Array.from(document.styleSheets)
  let cssText = ''
  for (const sheet of styleSheets) {
    try {
      const rules = Array.from(sheet.cssRules || [])
      cssText += rules.map(r => r.cssText).join('\n')
    } catch {
      // Cross-origin sheets — skip
    }
  }

  const win = window.open('', '_blank', 'width=820,height=960')
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${props.receipt?.receiptNo || 'Receipt'}</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: white; padding: 24px; }
    @media print { body { padding: 0; } @page { margin: 12mm; } }
    ${cssText}
  </style>
</head>
<body>${el.outerHTML}</body>
</html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 500)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.97); }
</style>
