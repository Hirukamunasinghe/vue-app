<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-users text-white text-sm"></i>
            </div>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">UserHub</h1>
            <p class="text-xs text-gray-500">Connect & Discover</p>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-lg mx-8">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              v-model="searchQuery"
              @input="onSearch"
              type="text"
              placeholder="Search users by name, email, or company..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Filter and Sort Options -->
        <div class="flex items-center space-x-4">
          <!-- Filter Dropdown -->
          <div class="relative">
            <button
              @click="toggleFilterDropdown"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <i class="fas fa-filter mr-2"></i>
              Filter
              <i class="fas fa-chevron-down ml-2 text-xs"></i>
            </button>
            
            <!-- Filter Dropdown Menu -->
            <div
              v-if="showFilterDropdown"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              <div class="py-2">
                <div class="px-4 py-2 border-b border-gray-100">
                  <h3 class="text-sm font-medium text-gray-900">Filter by Company</h3>
                </div>
                <div class="max-h-48 overflow-y-auto">
                  <label
                    v-for="company in availableCompanies"
                    :key="company"
                    class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      v-model="selectedCompanies"
                      :value="company"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-3 text-sm text-gray-700">{{ company }}</span>
                  </label>
                </div>
                
                <div class="px-4 py-2 border-b border-gray-100">
                  <h3 class="text-sm font-medium text-gray-900">Sort by</h3>
                </div>
                <div class="px-4 py-2">
                  <label
                    v-for="option in sortOptions"
                    :key="option.value"
                    class="flex items-center py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      v-model="selectedSort"
                      :value="option.value"
                      type="radio"
                      name="sort"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-3 text-sm text-gray-700">{{ option.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              @click="setViewMode('grid')"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer',
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <i class="fas fa-th-large"></i>
            </button>
            <button
              @click="setViewMode('list')"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer',
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-sm rounded-full  cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <img
                class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
                alt="Profile"
              />
              <span class="text-gray-700 font-medium">Admin</span>
              <i class="fas fa-chevron-down text-xs text-gray-500"></i>
            </button>
            
            <!-- User Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <i class="fas fa-user mr-2"></i>Profile
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <i class="fas fa-cog mr-2"></i>Settings
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <i class="fas fa-question-circle mr-2"></i>Help
                </a>
                <div class="border-t border-gray-100"></div>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <i class="fas fa-sign-out-alt mr-2"></i>Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['search', 'filter', 'sort', 'viewMode'])

// Search
const searchQuery = ref('')

// Filter
const showFilterDropdown = ref(false)
const selectedCompanies = ref([])
const availableCompanies = ref([
  'Romaguera-Crona',
  'Deckow-Crist',
  'Romaguera-Jacobson',
  'Robel-Corkery',
  'Keebler LLC',
  'Considine-Lockman',
  'Johns Group',
  'Abernathy Group',
  'Yost and Sons',
  'Hoeger LLC'
])

// Sort
const selectedSort = ref('name-asc')
const sortOptions = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'company-asc', label: 'Company A-Z' },
  { value: 'company-desc', label: 'Company Z-A' },
  { value: 'posts-asc', label: 'Posts Low-High' },
  { value: 'posts-desc', label: 'Posts High-Low' }
]

// View mode
const viewMode = ref('grid')

// User menu
const showUserMenu = ref(false)

// Methods
const onSearch = () => {
  emit('search', searchQuery.value)
}

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
  if (showFilterDropdown.value) {
    showUserMenu.value = false
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showFilterDropdown.value = false
  }
}

const setViewMode = (mode) => {
  viewMode.value = mode
  emit('viewMode', mode)
}

// Watch for changes and emit events
watch(selectedCompanies, (newValue) => {
  emit('filter', newValue)
})

watch(selectedSort, (newValue) => {
  emit('sort', newValue)
})

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showFilterDropdown.value = false
  showUserMenu.value = false
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      closeDropdowns()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>

<style scoped>
/* Custom scrollbar for filter dropdown */
.max-h-48::-webkit-scrollbar {
  width: 6px;
}

.max-h-48::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 