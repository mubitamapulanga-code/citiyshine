<template>
  <div class="space-y-6">
    <h2 class="page-title">Fee Statement</h2>

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
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="table-header">Fee Type</th>
            <th class="table-header">Amount</th>
            <th class="table-header">Paid</th>
            <th class="table-header">Balance</th>
            <th class="table-header">Due Date</th>
            <th class="table-header">Status</th>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import AppBadge from '@/components/AppBadge.vue'

const store = useAppStore()
const myFees = computed(() => store.feeRecords.filter(f => f.studentId === 'STU001'))
const totalPaid = computed(() => myFees.value.reduce((s, f) => s + f.paid, 0).toLocaleString())
const totalBalance = computed(() => myFees.value.reduce((s, f) => s + f.balance, 0).toLocaleString())
</script>
