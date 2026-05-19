<template>
  <div class="space-y-6">
    <h2 class="page-title">My Assignments</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="a in store.assignments" :key="a.id" class="card hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-semibold text-gray-900">{{ a.title }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ a.subject }} · {{ a.class }}</p>
          </div>
          <AppBadge :text="a.status" :color="a.status === 'Due Soon' ? 'yellow' : 'blue'" />
        </div>
        <p class="text-xs text-gray-500 mb-4">{{ a.description }}</p>
        <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Due: <strong class="text-gray-700">{{ a.dueDate }}</strong></span>
          <span>{{ a.teacher }}</span>
        </div>
        <button class="btn-primary w-full text-sm">Submit Assignment</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import AppBadge from '@/components/AppBadge.vue'
const store = useAppStore()
</script>
