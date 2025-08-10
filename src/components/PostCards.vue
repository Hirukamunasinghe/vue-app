<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Navigation
      @search="handleSearch"
      @filter="handleFilter"
      @sort="handleSort"
      @viewMode="handleViewMode"
    />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Stats -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">User Directory</h1>
            <p class="mt-2 text-gray-600">Discover and connect with users from around the world</p>
          </div>
          <div class="mt-4 sm:mt-0 flex items-center space-x-4">
            <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div class="text-sm text-gray-500">Total Users</div>
              <div class="text-2xl font-bold text-blue-600">{{ filteredUsers.length }}</div>
            </div>
            <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div class="text-sm text-gray-500">Total Posts</div>
              <div class="text-2xl font-bold text-green-600">{{ posts.length }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="activeFilters.length > 0" class="mb-6">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Active filters:</span>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="filter in activeFilters"
              :key="filter"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {{ filter }}
              <button
                @click="removeFilter(filter)"
                class="ml-2 text-blue-600 hover:text-blue-800"
              >
                <i class="fas fa-times text-xs"></i>
              </button>
            </span>
          </div>
          <button
            @click="clearAllFilters"
            class="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      </div>

      <!-- Cards Grid View -->
      <div v-if="!usersLoading && viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="user in paginatedUsers" 
          :key="user.id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <!-- User Avatar Header -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
              <img :src="getUserAvatar(user.id)" alt="User Avatar" class="w-full h-full object-cover rounded-full">
            </div>
            <h3 class="text-xl font-semibold">{{ user.name }}</h3>
            <p class="text-blue-100 text-sm">{{ user.company.name }}</p>
          </div>
          
          <!-- User Info -->
          <div class="p-6">
            <div class="space-y-3 mb-6">
              <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-envelope w-4 mr-3 text-gray-500"></i>
                <span class="truncate">{{ user.email }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-map-marker-alt w-4 mr-3 text-gray-500"></i>
                <span class="truncate">{{ user.address.city }}, {{ user.address.country }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-building w-4 mr-3 text-gray-500"></i>
                <span class="truncate">{{ user.company.catchPhrase }}</span>
              </div>
            </div>
            
            <!-- Stats -->
            <div class="flex items-center justify-between mb-6">
              <div class="text-center">
                <div class="text-lg font-bold text-gray-900">{{ getUserPostCount(user.id) }}</div>
                <div class="text-xs text-gray-500">Posts</div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button 
                @click="showPostsPopup(user.id)"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
              >
                <i class="fas fa-eye mr-2"></i>
                View Posts
              </button>
              <button 
                @click="showUserPopup(user.id, null)"
                class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="View Profile"
              >
                <i class="fas fa-user"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="!usersLoading && viewMode === 'list'" class="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      <img :src="getUserAvatar(user.id)" alt="User Avatar" class="w-full h-full object-cover rounded-full">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.company.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.company.catchPhrase }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.address.city }}</div>
                  <div class="text-sm text-gray-500">{{ user.address.country }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ getUserPostCount(user.id) }} posts
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="showPostsPopup(user.id)"
                    class="text-blue-600 hover:text-blue-900 mr-6 cursor-pointer"
                  >
                    <i class="fas fa-eye mr-1"></i>Posts
                  </button>
                  <button 
                    @click="showUserPopup(user.id, null)"
                    class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  >
                    <i class="fas fa-user mr-1"></i>Profile
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Loading state for cards -->
      <div v-if="usersLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div 
          v-for="i in 6" 
          :key="i"
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse"
        >
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20"></div>
            <div class="h-6 bg-white/20 rounded mb-2"></div>
            <div class="h-4 bg-white/20 rounded"></div>
          </div>
          <div class="p-6">
            <div class="space-y-3 mb-6">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
            </div>
            <div class="flex space-x-4 mb-6">
              <div class="h-8 bg-gray-200 rounded"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </div>
            <div class="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!usersLoading && totalPages > 1" class="flex justify-center">
        <Pagination
          :current="currentPage"
          :totalPages="totalPages"
          @change="onPageChange"
        />
      </div>
    </div>

    <!-- Posts Popup Component -->
    <PostsPopup
      v-if="showPosts"
      :show="showPosts"
      :userId="selectedUserId"
      :posts="userPosts"
      :loading="loading"
      :userName="users.find(user => user.id === selectedUserId)?.name || `User ${selectedUserId}`"
      @close="closePostsPopup"
      @showUser="showUserPopup"
    />

    <!-- User Popup Component -->
    <UserPopup
      v-if="selectedUser"
      :show="showUser"
      :userId="selectedUserId"
      :postId="selectedPostId"
      :user="selectedUser"
      :loading="userLoading"
      @close="closeUserPopup"
      @goBack="goBackToPosts"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import Navigation from './Navigation.vue'
import PostsPopup from './PostsPopup.vue'
import UserPopup from './UserPopup.vue'
import Pagination from './Pagination.vue'

// Reactive data
const posts = ref([])
const users = ref([])
const selectedUser = ref(null)
const selectedUserId = ref(null)
const selectedPostId = ref(null)
const showPosts = ref(false)
const showUser = ref(false)
const loading = ref(false)
const userLoading = ref(false)
const usersLoading = ref(true)

// Search and filter
const searchQuery = ref('')
const selectedCompanies = ref([])
const selectedSort = ref('name-asc')
const viewMode = ref('grid')

// Pagination
const currentPage = ref(1)
const pageSize = 6

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.company.name.toLowerCase().includes(query)
    )
  }

  // Apply company filter
  if (selectedCompanies.value.length > 0) {
    filtered = filtered.filter(user => 
      selectedCompanies.value.includes(user.company.name)
    )
  }

  // Apply sorting
  filtered = [...filtered].sort((a, b) => {
    switch (selectedSort.value) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'company-asc':
        return a.company.name.localeCompare(b.company.name)
      case 'company-desc':
        return b.company.name.localeCompare(a.company.name)
      case 'posts-asc':
        return getUserPostCount(a.id) - getUserPostCount(b.id)
      case 'posts-desc':
        return getUserPostCount(b.id) - getUserPostCount(a.id)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const activeFilters = computed(() => {
  const filters = []
  if (searchQuery.value) filters.push(`Search: "${searchQuery.value}"`)
  if (selectedCompanies.value.length > 0) {
    filters.push(`Company: ${selectedCompanies.value.join(', ')}`)
  }
  return filters
})

// Methods
const getUserPostCount = (userId) => {
  return posts.value.filter(post => post.userId === userId).length
}

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

const handleFilter = (companies) => {
  selectedCompanies.value = companies
  currentPage.value = 1
}

const handleSort = (sort) => {
  selectedSort.value = sort
  currentPage.value = 1
}

const handleViewMode = (mode) => {
  viewMode.value = mode
}

const removeFilter = (filter) => {
  if (filter.startsWith('Search:')) {
    searchQuery.value = ''
  } else if (filter.startsWith('Company:')) {
    selectedCompanies.value = []
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCompanies.value = []
  selectedSort.value = 'name-asc'
}

const onPageChange = (page) => {
  currentPage.value = page
}

// Get posts for the selected user
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

// Fetch users from API
const fetchUsers = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    usersLoading.value = false
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
  showPosts.value = false
  fetchUser(userId)
}

// Close popups
const closePostsPopup = () => {
  showPosts.value = false
}

const closeUserPopup = () => {
  showUser.value = false
  selectedUser.value = null
  selectedPostId.value = null
}

const goBackToPosts = () => {
  showUser.value = false
  showPosts.value = true
  selectedUser.value = null
}

// Watch for filter changes to reset pagination
watch([searchQuery, selectedCompanies, selectedSort], () => {
  currentPage.value = 1
})

// Fetch data on component mount
onMounted(() => {
  fetchUsers()
  fetchPosts()
})

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
/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 