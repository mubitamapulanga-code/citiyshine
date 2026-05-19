<template>
  <div class="stat-card">
    <div :class="`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`">
      <component :is="icon" class="w-6 h-6" :class="iconColor" />
    </div>
    <div>
      <p class="text-sm text-gray-500">{{ label }}</p>
      <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
      <p v-if="sub" class="text-xs mt-0.5" :class="subColor || 'text-gray-400'">{{ sub }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  sub: String,
  subColor: String,
  icon: Object,
  iconBg: { type: String, default: 'bg-indigo-50' },
  iconColor: { type: String, default: 'text-indigo-600' }
})
</script>
