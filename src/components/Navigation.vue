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
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900">UserHub</h1>
            <p class="text-xs text-gray-500">Connect & Discover</p>
          </div>
          <div class="sm:hidden">
            <h1 class="text-lg font-bold text-gray-900">UserHub</h1>
          </div>
        </div>

        <!-- Search Bar - Hidden on mobile -->
        <div class="hidden lg:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              v-model="searchQuery"
              @input="onSearch"
              type="text"
              placeholder="Search users by name, email, or company..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center space-x-4">
          <!-- Filter Dropdown -->
          <div class="relative" ref="filterRef">
            <button
              @click="toggleFilterDropdown"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <i class="fas fa-filter mr-2"></i>
              Filter
              <i class="fas fa-chevron-down ml-2 text-xs"></i>
            </button>

            <!-- Dropdown -->
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
              :class="[viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              <i class="fas fa-th-large"></i>
            </button>
            <button
              @click="setViewMode('list')"
              :class="[viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>

          <!-- User Menu (desktop) -->
          <div class="relative" ref="desktopUserMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-sm rounded-full cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <img
                class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
                alt="Profile"
              />
              <span class="text-gray-700 font-medium">Admin</span>
              <i class="fas fa-chevron-down text-xs text-gray-500"></i>
            </button>

            <!-- Dropdown -->
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

        <!-- Mobile Menu Button -->
        <div class="lg:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <i :class="showMobileMenu ? 'fas fa-times' : 'fas fa-bars'" class="text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="lg:hidden border-t border-gray-200 py-4">
        <!-- Search -->
        <div class="mb-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              v-model="searchQuery"
              @input="onSearch"
              type="text"
              placeholder="Search users..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <!-- Mobile Filter -->
        <div class="space-y-3 mb-4">
          <button
            @click="toggleMobileFilter"
            class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <span class="flex items-center">
              <i class="fas fa-filter mr-2"></i>
              Filter & Sort
            </span>
            <i class="fas fa-chevron-down text-xs text-gray-500"></i>
          </button>

          <div v-if="showMobileFilter" class="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Company</h4>
              <div class="space-y-2 max-h-32 overflow-y-auto">
                <label
                  v-for="company in availableCompanies"
                  :key="company"
                  class="flex items-center"
                >
                  <input
                    v-model="selectedCompanies"
                    :value="company"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ company }}</span>
                </label>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Sort by</h4>
              <div class="space-y-2">
                <label
                  v-for="option in sortOptions"
                  :key="option.value"
                  class="flex items-center"
                >
                  <input
                    v-model="selectedSort"
                    :value="option.value"
                    type="radio"
                    name="mobileSort"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              @click="setViewMode('grid')"
              :class="[viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              <i class="fas fa-th-large mr-2"></i>Grid
            </button>
            <button
              @click="setViewMode('list')"
              :class="[viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              <i class="fas fa-list mr-2"></i>List
            </button>
          </div>
        </div>

        <!-- Mobile User Menu -->
        <div class="border-t border-gray-200 pt-4" ref="mobileUserMenuRef">
          <button
            @click="toggleMobileUserMenu"
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <span class="flex items-center space-x-3">
              <img
                class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
                alt="Profile"
              />
              <span class="text-gray-700 font-medium">Admin</span>
            </span>
            <i
              class="fas fa-chevron-down text-xs text-gray-500 transition-transform"
              :class="showMobileUserMenu ? 'rotate-180' : ''"
            ></i>
          </button>

          <div v-if="showMobileUserMenu" class="mt-2 space-y-1">
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              <i class="fas fa-user mr-2"></i>Profile
            </a>
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              <i class="fas fa-cog mr-2"></i>Settings
            </a>
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              <i class="fas fa-question-circle mr-2"></i>Help
            </a>
            <a href="#" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
              <i class="fas fa-sign-out-alt mr-2"></i>Sign out
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['search', 'filter', 'sort', 'viewMode'])

const searchQuery = ref('')
const showFilterDropdown = ref(false)
const selectedCompanies = ref([])
const availableCompanies = ref([
  'Romaguera-Crona', 'Deckow-Crist', 'Romaguera-Jacobson',
  'Robel-Corkery', 'Keebler LLC', 'Considine-Lockman',
  'Johns Group', 'Abernathy Group', 'Yost and Sons', 'Hoeger LLC'
])
const selectedSort = ref('name-asc')
const sortOptions = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'company-asc', label: 'Company A-Z' },
  { value: 'company-desc', label: 'Company Z-A' },
  { value: 'posts-asc', label: 'Posts Low-High' },
  { value: 'posts-desc', label: 'Posts High-Low' }
]
const viewMode = ref('grid')
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showMobileFilter = ref(false)
const showMobileUserMenu = ref(false)

const filterRef = ref(null)
const desktopUserMenuRef = ref(null)
const mobileUserMenuRef = ref(null)

const onSearch = () => emit('search', searchQuery.value)
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value
  if (showFilterDropdown.value) {
    showUserMenu.value = false
    showMobileUserMenu.value = false
  }
}
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showFilterDropdown.value = false
    showMobileUserMenu.value = false
  }
}
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    showFilterDropdown.value = false
    showUserMenu.value = false
    showMobileUserMenu.value = false
  }
}
const toggleMobileFilter = () => {
  showMobileFilter.value = !showMobileFilter.value
}
const toggleMobileUserMenu = () => {
  showMobileUserMenu.value = !showMobileUserMenu.value
  if (showMobileUserMenu.value) {
    showFilterDropdown.value = false
    showUserMenu.value = false
  }
}
const setViewMode = (mode) => {
  viewMode.value = mode
  emit('viewMode', mode)
}

watch(selectedCompanies, (v) => emit('filter', v))
watch(selectedSort, (v) => emit('sort', v))

function onDocumentClick(e) {
  const t = e.target
  if (filterRef.value && !filterRef.value.contains(t)) showFilterDropdown.value = false
  if (desktopUserMenuRef.value && !desktopUserMenuRef.value.contains(t)) showUserMenu.value = false
  if (mobileUserMenuRef.value && !mobileUserMenuRef.value.contains(t)) showMobileUserMenu.value = false
}
onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<style scoped>
.max-h-48::-webkit-scrollbar,
.max-h-32::-webkit-scrollbar {
  width: 6px;
}
.max-h-48::-webkit-scrollbar-thumb,
.max-h-32::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
