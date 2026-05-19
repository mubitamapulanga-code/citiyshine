import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ─── Default built-in templates ──────────────────────────────────────────────
const DEFAULT_TEMPLATES = [
  {
    id: 'tpl-001',
    name: 'Standard Receipt',
    description: 'Clean single-column layout with school branding',
    isDefault: true,
    isBuiltIn: true,
    accentColor: '#4f46e5',
    showLogo: true,
    showSignatureLine: true,
    showWatermark: false,
    footerText: 'Thank you for your payment. Please retain this receipt for your records.',
    headerNote: '',
    createdAt: '2026-01-01',
  },
  {
    id: 'tpl-002',
    name: 'Compact Receipt',
    description: 'Minimal two-column layout, ideal for thermal printers',
    isDefault: false,
    isBuiltIn: true,
    accentColor: '#059669',
    showLogo: false,
    showSignatureLine: false,
    showWatermark: false,
    footerText: 'Citybride Academy — All fees are non-refundable.',
    headerNote: 'OFFICIAL PAYMENT RECEIPT',
    createdAt: '2026-01-01',
  },
  {
    id: 'tpl-003',
    name: 'Formal Invoice',
    description: 'Full invoice style with itemised breakdown and watermark',
    isDefault: false,
    isBuiltIn: true,
    accentColor: '#b45309',
    showLogo: true,
    showSignatureLine: true,
    showWatermark: true,
    footerText: 'This is a computer-generated receipt and does not require a physical signature.',
    headerNote: 'OFFICIAL TAX RECEIPT',
    createdAt: '2026-01-01',
  },
]

// ─── Receipt number generator ─────────────────────────────────────────────────
function generateReceiptNo(index) {
  const year = new Date().getFullYear()
  return `RCP-${year}-${String(index).padStart(5, '0')}`
}

export const useReceiptStore = defineStore('receipts', () => {
  // Load persisted data from localStorage
  const _savedTemplates = JSON.parse(localStorage.getItem('sms_templates') || 'null')
  const _savedReceipts  = JSON.parse(localStorage.getItem('sms_receipts')  || 'null')

  const templates = ref(_savedTemplates || [...DEFAULT_TEMPLATES])
  const receipts  = ref(_savedReceipts  || [])

  // ── Persist helpers ──────────────────────────────────────────────────────
  function _saveTemplates() {
    localStorage.setItem('sms_templates', JSON.stringify(templates.value))
  }
  function _saveReceipts() {
    localStorage.setItem('sms_receipts', JSON.stringify(receipts.value))
  }

  // ── Computed ─────────────────────────────────────────────────────────────
  const defaultTemplate = computed(
    () => templates.value.find(t => t.isDefault) || templates.value[0]
  )

  // ── Template actions ─────────────────────────────────────────────────────
  function addTemplate(tpl) {
    const id = `tpl-${Date.now()}`
    templates.value.push({
      ...tpl,
      id,
      isBuiltIn: false,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
    })
    _saveTemplates()
    return id
  }

  function updateTemplate(id, data) {
    const idx = templates.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      templates.value[idx] = { ...templates.value[idx], ...data }
      _saveTemplates()
    }
  }

  function deleteTemplate(id) {
    const tpl = templates.value.find(t => t.id === id)
    if (!tpl) return
    if (tpl.isBuiltIn) throw new Error('Built-in templates cannot be deleted.')
    if (tpl.isDefault) {
      // Promote first remaining template to default
      const next = templates.value.find(t => t.id !== id)
      if (next) next.isDefault = true
    }
    templates.value = templates.value.filter(t => t.id !== id)
    _saveTemplates()
  }

  function setDefaultTemplate(id) {
    templates.value.forEach(t => { t.isDefault = t.id === id })
    _saveTemplates()
  }

  function duplicateTemplate(id) {
    const src = templates.value.find(t => t.id === id)
    if (!src) return
    addTemplate({
      ...src,
      name: `${src.name} (Copy)`,
      isDefault: false,
    })
  }

  // ── Receipt actions ───────────────────────────────────────────────────────
  function generateReceipt({ feeRecord, amountPaid, method, templateId, issuedBy }) {
    const tpl = templates.value.find(t => t.id === templateId) || defaultTemplate.value
    const receiptNo = generateReceiptNo(receipts.value.length + 1)
    const receipt = {
      id: `rcpt-${Date.now()}`,
      receiptNo,
      templateId: tpl.id,
      templateName: tpl.name,
      // Fee snapshot
      feeId: feeRecord.id,
      studentId: feeRecord.studentId,
      studentName: feeRecord.studentName,
      grade: feeRecord.grade,
      feeType: feeRecord.feeType,
      totalFee: feeRecord.amount,
      previouslyPaid: feeRecord.paid - amountPaid,
      amountPaid,
      balanceAfter: feeRecord.balance,
      method,
      issuedBy: issuedBy || 'Admin',
      issuedAt: new Date().toISOString(),
      // School info snapshot
      schoolName: 'Citybride Academy',
      schoolAddress: '100 Academy Drive, Springfield, ST 12345',
      schoolPhone: '+1-555-0000',
      schoolEmail: 'admin@school.edu',
    }
    receipts.value.unshift(receipt)
    _saveReceipts()
    return receipt
  }

  function deleteReceipt(id) {
    receipts.value = receipts.value.filter(r => r.id !== id)
    _saveReceipts()
  }

  function getReceiptsByStudent(studentId) {
    return receipts.value.filter(r => r.studentId === studentId)
  }

  return {
    templates,
    receipts,
    defaultTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    duplicateTemplate,
    generateReceipt,
    deleteReceipt,
    getReceiptsByStudent,
  }
})
