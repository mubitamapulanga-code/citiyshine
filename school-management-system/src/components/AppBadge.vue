<template>
  <span :class="classes">{{ text }}</span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ text: String, color: String })
const classes = computed(() => {
  const map = {
    green: 'badge-green', red: 'badge-red', yellow: 'badge-yellow',
    blue: 'badge-blue', purple: 'badge-purple',
    Active: 'badge-green', Inactive: 'badge-red',
    Present: 'badge-green', Absent: 'badge-red', Late: 'badge-yellow',
    Paid: 'badge-green', Overdue: 'badge-red', Partial: 'badge-yellow',
    Issued: 'badge-blue', Returned: 'badge-green',
    High: 'badge-red', Normal: 'badge-blue', Low: 'badge-green',
  }
  return map[props.color] || map[props.text] || 'badge-blue'
})
</script>
