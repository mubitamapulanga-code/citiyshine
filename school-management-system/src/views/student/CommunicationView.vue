<template>
  <div class="space-y-6">
    <h2 class="page-title">Messages & Announcements</h2>
    <div class="space-y-3">
      <div v-for="ann in store.announcements" :key="ann.id" class="card">
        <div class="flex items-start gap-3">
          <div :class="`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ann.priority === 'High' ? 'bg-red-400' : 'bg-blue-400'}`" />
          <div>
            <div class="flex items-center gap-2 mb-1">
              <AppBadge :text="ann.priority" />
              <span class="text-xs text-gray-400">{{ ann.audience }}</span>
            </div>
            <h3 class="font-semibold text-gray-900">{{ ann.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ ann.body }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ ann.date }} · {{ ann.author }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import AppBadge from '@/components/AppBadge.vue'
const store = useAppStore()
</script>
