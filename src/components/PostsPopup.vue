<template>
  <div 
    v-if="show" 
    class="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
  >
    <div
      class="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl
             max-h-[90vh] sm:max-h-[80vh] shadow-2xl ring-1 ring-gray-200/60
             overflow-hidden"
      @click.stop
    >
      <div class="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/95 border-b border-gray-200">
        <div class="px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img 
              :src="getUserAvatar(userId)" 
              alt="User Avatar" 
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
            >
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
              Posts from {{ userName }}
            </h2>
          </div>
          <button 
            @click="close"
            class="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-gray-100"
            aria-label="Close posts popup"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading posts...</p>
        </div>
        
        <div v-else-if="posts.length > 0" class="space-y-4 sm:space-y-5">
          <div 
            v-for="post in paginatedPosts" 
            :key="post.id"
            class="border border-gray-200 rounded-xl p-4 sm:p-5 hover:bg-gray-50 transition-colors duration-200"
          >
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
            <p class="text-gray-600 mb-3">{{ post.body }}</p>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <button 
                @click="showUser(post.userId, post.id)"
                class="mt-1 sm:mt-0 text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer inline-flex items-center gap-2"
              >
                <i class="fas fa-user"></i>
                View Author
              </button>
            </div>
          </div>

          <Pagination
            v-if="totalPages > 1"
            :current="currentPage"
            :totalPages="totalPages"
            :showPageNumbers="showPageNumbers"
            @change="handlePageChange"
            class="mt-6 sm:mt-8 border-t border-gray-100 pt-6 sm:pt-8"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Pagination from './Pagination.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  userId: { type: Number, default: null },
  posts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  userName: { type: String, default: '' }
})

const emit = defineEmits(['close', 'showUser'])

// Responsive page size: 1 for mobile, 2 for larger screens
const pageSize = ref(2)

// Function to update page size based on screen width
const updatePageSize = () => {
  if (window.innerWidth < 640) { // sm breakpoint
    pageSize.value = 1
  } else {
    pageSize.value = 2
  }
}

// Initialize page size and add resize listener
onMounted(() => {
  updatePageSize()
  window.addEventListener('resize', updatePageSize)
})

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', updatePageSize)
})

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.posts.length / pageSize.value)))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return props.posts.slice(start, start + pageSize.value)
})

// Computed property to determine if page numbers should be shown
const showPageNumbers = computed(() => window.innerWidth >= 640)

watch(
  () => [props.userId, props.show, props.posts.length, pageSize.value],
  () => { currentPage.value = 1 }
)

function handlePageChange(page) {
  currentPage.value = page
}

const close = () => emit('close')
const showUser = (userId, postId) => emit('showUser', userId, postId)

// Avatar images array
const avatarImages = [
  '/image 8.png',
  '/image 17.png',
  '/image 66.png',
  '/image 87.png',
  '/image 174.png',
  '/image 178.png',
  '/image 206.png',
  '/image 373.png',
  '/image 477.png',
  '/image 490.png'
]

// Function to get avatar image for a user
const getUserAvatar = (userId) => {
  // Use modulo to ensure we always get a valid index
  const index = (userId - 1) % avatarImages.length
  return avatarImages[index]
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .line-clamp-3 { -webkit-line-clamp: 2; }
  .line-clamp-4 { -webkit-line-clamp: 3; }
}
</style>
