<template>
  <div class="flex items-center justify-center select-none mt-4 flex-wrap gap-2 sm:gap-0">
    <!-- Previous Button -->
    <button
      :disabled="current === 1"
      @click="goTo(current - 1)"
      class="px-2 py-1 sm:px-3 sm:py-1 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer mr-3 sm:mr-6"
      aria-label="Previous page"
      title="Previous"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <!-- Page Numbers -->
    <div class="flex items-center gap-[5px] sm:gap-4">
      <button
        v-for="page in pages"
        :key="page"
        @click="goTo(page)"
        :class="[ 
          'w-8 h-8 rounded-md border text-sm flex items-center justify-center cursor-pointer',
          page === current ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-100'
        ]"
        :aria-current="page === current ? 'page' : undefined"
        :title="`Page ${page}`"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next Button -->
    <button
      :disabled="current === totalPages"
      @click="goTo(current + 1)"
      class="px-2 py-1 sm:px-3 sm:py-1 rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer ml-3 sm:ml-6"
      aria-label="Next page"
      title="Next"
    >
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

const emit = defineEmits(['change'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.current
  const maxButtons = 5
  const result = []

  if (total <= maxButtons) {
    for (let i = 1; i <= total; i++) result.push(i)
    return result
  }

  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + maxButtons - 1)
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1)

  for (let i = start; i <= end; i++) result.push(i)
  return result
})

function goTo(page) {
  if (page < 1 || page > props.totalPages) return
  emit('change', page)
}
</script>

<style scoped>
</style>
