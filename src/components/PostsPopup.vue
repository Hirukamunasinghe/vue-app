<template>
  <div 
    v-if="show" 
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
  >
    <div 
      class="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl ring-1 ring-gray-200/60"
      @click.stop
    >
      <div class="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/95 border-b border-gray-200 rounded-t-2xl">
        <div class="px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Posts from User ID {{ userId }}</h2>
          <button 
            @click="close"
            class="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-gray-100"
            aria-label="Close posts popup"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="px-6 py-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading posts...</p>
        </div>
        
        <div v-else-if="posts.length > 0" class="space-y-5">
          <div 
            v-for="post in paginatedPosts" 
            :key="post.id"
            class="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
            <p class="text-gray-600 mb-3">{{ post.body }}</p>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span class="text-sm text-gray-400">Post ID: {{ post.id }}</span>
              <button 
                @click="showUser(post.userId, post.id)"
                class="mt-2 sm:mt-0 text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer inline-flex items-center gap-2"
              >
                <i class="fas fa-user"></i>
                View Author (User ID: {{ post.userId }}, Post ID: {{ post.id }})
              </button>
            </div>
          </div>
          <Pagination
            v-if="totalPages > 1"
            :current="currentPage"
            :totalPages="totalPages"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Number,
    default: null
  },
  posts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'showUser'])

const pageSize = 5
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.posts.length / pageSize)))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.posts.slice(start, start + pageSize)
})

watch(
  () => [props.userId, props.show, props.posts.length],
  () => {
    currentPage.value = 1
  }
)

function handlePageChange(page) {
  currentPage.value = page
}

const close = () => emit('close')

const showUser = (userId, postId) => emit('showUser', userId, postId)
</script>

<style scoped>
</style> 