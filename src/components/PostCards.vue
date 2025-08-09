<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 text-center">Technical Assessment</h1>
    <p class="text-slate-500 text-center mb-10">Browse posts by user and view author details</p>
    
    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7 mb-6">
      <div 
        v-for="cardId in paginatedUserIds" 
        :key="cardId"
        class="relative overflow-hidden rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      >
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500"></div>
        <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-2">
          Card {{ cardId }}
          <span class="inline-flex items-center rounded-full bg-slate-100 text-slate-600 text-xs px-2 py-0.5">User ID {{ cardId }}</span>
        </h3>
        <p class="text-slate-500">Click the button below to view posts from User ID {{ cardId }}</p>
        <div class="mt-6">
          <button 
            @click="showPostsPopup(cardId)"
            class="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2.5 hover:bg-slate-700 active:scale-[.98] transition cursor-pointer"
          >
            <i class="fas fa-eye"></i>
            View Posts
          </button>
        </div>
      </div>
    </div>

    <!-- Cards Pagination -->
    <div class="flex justify-center">
      <Pagination
        :current="cardPage"
        :totalPages="totalCardPages"
        @change="onCardPageChange"
      />
    </div>

    <!-- Posts Popup Component -->
    <PostsPopup
      :show="showPosts"
      :userId="selectedUserId"
      :posts="userPosts"
      :loading="loading"
      @close="closePostsPopup"
      @showUser="showUserPopup"
    />

    <!-- User Popup Component -->
    <UserPopup
      :show="showUser"
      :userId="selectedUserId"
      :postId="selectedPostId"
      :user="selectedUser"
      :loading="userLoading"
      @close="closeUserPopup"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import PostsPopup from './PostsPopup.vue'
import UserPopup from './UserPopup.vue'
import Pagination from './Pagination.vue'

// Reactive data
const posts = ref([])
const selectedUser = ref(null)
const selectedUserId = ref(null)
const selectedPostId = ref(null)
const showPosts = ref(false)
const showUser = ref(false)
const loading = ref(false)
const userLoading = ref(false)

// Cards pagination (5 cards per page)
const totalUsers = 10
const cardPage = ref(1)
const cardPageSize = 5
const totalCardPages = computed(() => Math.ceil(totalUsers / cardPageSize))
const allUserIds = computed(() => Array.from({ length: totalUsers }, (_, i) => i + 1))
const paginatedUserIds = computed(() => {
  const start = (cardPage.value - 1) * cardPageSize
  return allUserIds.value.slice(start, start + cardPageSize)
})
function onCardPageChange(page) {
  cardPage.value = page
}

//get posts for the selected user
const userPosts = computed(() => {
  if (posts.value.length === 0 || !selectedUserId.value) return []
  return posts.value.filter(post => post.userId === selectedUserId.value)
})

// Fetch posts from API
const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
    posts.value = response.data
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

// Fetch user by ID
const fetchUser = async (userId) => {
  userLoading.value = true
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
    selectedUser.value = response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    selectedUser.value = null
  } finally {
    userLoading.value = false
  }
}

// Show posts popup
const showPostsPopup = (cardId) => {
  selectedUserId.value = cardId
  showPosts.value = true
  if (posts.value.length === 0) {
    fetchPosts()
  }
}

// Show user popup
const showUserPopup = (userId, postId) => {
  selectedUserId.value = userId
  selectedPostId.value = postId
  showUser.value = true
  showPosts.value = false // Close posts popup when user popup opens
  fetchUser(userId)
}

// Close popups
const closePostsPopup = () => {
  showPosts.value = false
}

const closeUserPopup = () => {
  showUser.value = false
  showPosts.value = true
  selectedUser.value = null
  selectedPostId.value = null
}

// Fetch posts on component mount
onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
</style> 