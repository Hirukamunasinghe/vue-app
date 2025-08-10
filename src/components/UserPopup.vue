<template>
  <div 
    v-if="show" 
    class="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
  >
    <div 
      class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] sm:max-h-[80vh] shadow-2xl ring-1 ring-gray-200/60 overflow-y-auto"
      @click.stop
    >
      <div class="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/95 border-b border-gray-200 rounded-t-2xl">
        <!-- Back Button (Top Left) - Only show when viewing from a post -->
        <button 
          v-if="postId"
          @click="goBack"
          class="absolute top-2 sm:top-4 left-2 sm:left-4 text-gray-500 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-gray-100"
          aria-label="Go back to posts"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        
        <!-- Avatar and Header Section -->
        <div class="px-4 py-4 sm:px-6 sm:py-6 text-center">
          <div v-if="!loading && user" class="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-blue-100">
            <img :src="getUserAvatar(user.id)" alt="User Avatar" class="w-full h-full object-cover">
          </div>
          <div v-else-if="loading" class="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-200 animate-pulse"></div>
          
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
            {{ loading ? 'Loading...' : (user?.name || 'User Information') }}
          </h2>
        </div>
        
        <!-- Close Button -->
        <button 
          @click="close"
          class="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-gray-100"
          aria-label="Close user popup"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="px-4 py-4 sm:px-6 sm:py-6">
        <div v-if="loading" class="text-center py-6 sm:py-8">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-3 sm:mt-4 text-gray-600">Loading user...</p>
        </div>
        
        <div v-else-if="user" class="space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Personal Information</h3>
              <div class="mt-2 space-y-1 text-gray-700 text-sm sm:text-base">
                <p><span class="font-medium">Name:</span> {{ user.name }}</p>
                <p><span class="font-medium">Username:</span> {{ user.username }}</p>
                <p><span class="font-medium">Email:</span> {{ user.email }}</p>
                <p><span class="font-medium">Phone:</span> {{ user.phone }}</p>
                <p><span class="font-medium">Website:</span> {{ user.website }}</p>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Address</h3>
              <div class="mt-2 space-y-1 text-gray-700 text-sm sm:text-base">
                <p>{{ user.address.street }}, {{ user.address.suite }}</p>
                <p>{{ user.address.city }}, {{ user.address.zipcode }}</p>
                <p>Lat: {{ user.address.geo.lat }}, Lng: {{ user.address.geo.lng }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-900 text-sm sm:text-base">Company</h3>
            <div class="mt-2 space-y-1 text-gray-700 text-sm sm:text-base">
              <p><span class="font-medium">Name:</span> {{ user.company.name }}</p>
              <p><span class="font-medium">Catch Phrase:</span> {{ user.company.catchPhrase }}</p>
              <p><span class="font-medium">Business:</span> {{ user.company.bs }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-6 sm:py-8 text-gray-600">
          User not found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  userId: { type: Number, default: null },
  postId: { type: Number, default: null },
  user: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'goBack'])

const close = () => emit('close')

const goBack = () => emit('goBack')

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

const getUserAvatar = (userId) => {
  // Use modulo to ensure we always get a valid index
  const index = (userId - 1) % avatarImages.length
  return avatarImages[index]
}
</script>

<style scoped>
</style> 