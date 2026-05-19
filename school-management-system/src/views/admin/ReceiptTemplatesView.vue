<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="page-title">Receipt Templates</h2>
        <p class="text-sm text-gray-500 mt-1">Manage how receipts look when printed or viewed</p>
      </div>
      <button @click="openCreate" class="btn-primary text-sm flex items-center gap-2 w-fit">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Template
      </button>
    </div>

    <!-- Template Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="tpl in receiptStore.templates" :key="tpl.id"
        :class="['card p-5 flex flex-col gap-4 transition-shadow hover:shadow-md', tpl.isDefault ? 'ring-2 ring-indigo-500' : '']">

        <!-- Header -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <!-- Accent swatch -->
            <div class="w-10 h-10 rounded-xl flex-shrink-0" :style="`background: ${tpl.accentColor}`" />
            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-900 text-sm">{{ tpl.name }}</p>
                <span v-if="tpl.isDefault" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Default</span>
                <span v-if="tpl.isBuiltIn" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Built-in</span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">{{ tpl.description }}</p>
            </div>
          </div>
        </div>

        <!-- Feature flags -->
        <div class="flex flex-wrap gap-2">
          <span v-if="tpl.showLogo" class="feature-chip">Logo</span>
          <span v-if="tpl.showSignatureLine" class="feature-chip">Signature</span>
          <span v-if="tpl.showWatermark" class="feature-chip">Watermark</span>
          <span v-if="tpl.headerNote" class="feature-chip">Header Note</span>
        </div>

        <!-- Footer text preview -->
        <p class="text-xs text-gray-400 italic line-clamp-2">"{{ tpl.footerText }}"</p>

        <!-- Actions -->
        <div class="flex items-center gap-2 pt-1 border-t border-gray-100">
          <button @click="previewTemplate(tpl)"
            class="flex-1 text-xs text-center py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium">
            Preview
          </button>
          <button v-if="!tpl.isDefault" @click="receiptStore.setDefaultTemplate(tpl.id)"
            class="flex-1 text-xs text-center py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
            Set Default
          </button>
          <button @click="receiptStore.duplicateTemplate(tpl.id)"
            class="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors" title="Duplicate">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
          <button v-if="!tpl.isBuiltIn" @click="openEdit(tpl)"
            class="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors" title="Edit">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
          <button v-if="!tpl.isBuiltIn" @click="confirmDelete(tpl)"
            class="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors" title="Delete">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <AppModal v-model="showFormModal" :title="editingId ? 'Edit Template' : 'New Template'">
      <form @submit.prevent="saveTemplate" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
            <input v-model="form.name" required class="input-field" placeholder="e.g. Official Receipt" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input v-model="form.description" class="input-field" placeholder="Short description of this template" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
            <div class="flex items-center gap-3">
              <input v-model="form.accentColor" type="color" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.accentColor" class="input-field font-mono text-sm" placeholder="#4f46e5" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Header Note</label>
            <input v-model="form.headerNote" class="input-field" placeholder="e.g. OFFICIAL PAYMENT RECEIPT" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
            <textarea v-model="form.footerText" rows="2" class="input-field resize-none" placeholder="Thank you for your payment…" />
          </div>
        </div>

        <!-- Toggle options -->
        <div class="space-y-3 pt-1">
          <p class="text-sm font-medium text-gray-700">Display Options</p>
          <label v-for="opt in toggleOptions" :key="opt.key" class="flex items-center justify-between p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ opt.label }}</p>
              <p class="text-xs text-gray-500">{{ opt.desc }}</p>
            </div>
            <div @click="form[opt.key] = !form[opt.key]"
              :class="['relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0', form[opt.key] ? 'bg-indigo-600' : 'bg-gray-200']">
              <div :class="['absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form[opt.key] ? 'translate-x-5' : 'translate-x-0.5']" />
            </div>
          </label>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" @click="showFormModal = false" class="btn-secondary flex-1">Cancel</button>
          <button type="submit" class="btn-primary flex-1">{{ editingId ? 'Save Changes' : 'Create Template' }}</button>
        </div>
      </form>
    </AppModal>

    <!-- Delete Confirm Modal -->
    <AppModal v-model="showDeleteModal" title="Delete Template">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Are you sure you want to delete <span class="font-semibold text-gray-900">{{ deletingTemplate?.name }}</span>?
          This cannot be undone.
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="btn-secondary flex-1">Cancel</button>
          <button @click="doDelete" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">Delete</button>
        </div>
      </div>
    </AppModal>

    <!-- Preview Modal -->
    <ReceiptViewer v-model="showPreview" :receipt="previewReceipt" :initial-template-id="previewTemplateId" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useReceiptStore } from '@/stores/receipts'
import AppModal from '@/components/AppModal.vue'
import ReceiptViewer from '@/components/ReceiptViewer.vue'

const receiptStore = useReceiptStore()

// ── Form state ────────────────────────────────────────────────────────────────
const showFormModal = ref(false)
const editingId = ref(null)
const form = reactive({
  name: '',
  description: '',
  accentColor: '#4f46e5',
  headerNote: '',
  footerText: 'Thank you for your payment. Please retain this receipt for your records.',
  showLogo: true,
  showSignatureLine: true,
  showWatermark: false,
})

const toggleOptions = [
  { key: 'showLogo', label: 'Show School Logo', desc: 'Display the school logo in the receipt header' },
  { key: 'showSignatureLine', label: 'Signature Lines', desc: 'Include cashier and parent signature fields' },
  { key: 'showWatermark', label: 'PAID Watermark', desc: 'Show a diagonal watermark on fully paid receipts' },
]

function resetForm() {
  form.name = ''
  form.description = ''
  form.accentColor = '#4f46e5'
  form.headerNote = ''
  form.footerText = 'Thank you for your payment. Please retain this receipt for your records.'
  form.showLogo = true
  form.showSignatureLine = true
  form.showWatermark = false
}

function openCreate() {
  editingId.value = null
  resetForm()
  showFormModal.value = true
}

function openEdit(tpl) {
  editingId.value = tpl.id
  form.name = tpl.name
  form.description = tpl.description
  form.accentColor = tpl.accentColor
  form.headerNote = tpl.headerNote || ''
  form.footerText = tpl.footerText
  form.showLogo = tpl.showLogo
  form.showSignatureLine = tpl.showSignatureLine
  form.showWatermark = tpl.showWatermark
  showFormModal.value = true
}

function saveTemplate() {
  const data = { ...form }
  if (editingId.value) {
    receiptStore.updateTemplate(editingId.value, data)
  } else {
    receiptStore.addTemplate(data)
  }
  showFormModal.value = false
}

// ── Delete ────────────────────────────────────────────────────────────────────
const showDeleteModal = ref(false)
const deletingTemplate = ref(null)

function confirmDelete(tpl) {
  deletingTemplate.value = tpl
  showDeleteModal.value = true
}

function doDelete() {
  try {
    receiptStore.deleteTemplate(deletingTemplate.value.id)
  } catch (e) {
    alert(e.message)
  }
  showDeleteModal.value = false
}

// ── Preview ───────────────────────────────────────────────────────────────────
const showPreview = ref(false)
const previewTemplateId = ref(null)

// A sample receipt used for previewing templates
const previewReceipt = {
  id: 'preview',
  receiptNo: 'RCP-2026-00001',
  templateId: null,
  templateName: 'Preview',
  studentId: 'STU001',
  studentName: 'Alice Johnson',
  grade: '10A',
  feeType: 'Tuition',
  totalFee: 2500,
  previouslyPaid: 0,
  amountPaid: 2500,
  balanceAfter: 0,
  method: 'Card',
  issuedBy: 'Admin',
  issuedAt: new Date().toISOString(),
  schoolName: 'Citybride Academy',
  schoolAddress: '100 Academy Drive, Springfield, ST 12345',
  schoolPhone: '+1-555-0000',
  schoolEmail: 'admin@school.edu',
}

function previewTemplate(tpl) {
  previewTemplateId.value = tpl.id
  showPreview.value = true
}
</script>

<style scoped>
.feature-chip {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}
</style>
