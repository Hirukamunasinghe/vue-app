<template>
  <div 
    v-if="show" 
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
  >
    <div 
      class="bg-white rounded-2xl max-w-3xl w-full shadow-2xl ring-1 ring-gray-200/60"
      @click.stop
    >
      <div class="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/95 border-b border-gray-200 rounded-t-2xl">
        <div class="px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">User Information (ID: {{ userId }})</h2>
          <button 
            @click="close"
            class="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-gray-100"
            aria-label="Close user popup"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="px-6 pb-4 text-sm text-gray-500">Author of Post ID: {{ postId }}</p>
      </div>
      
      <div class="px-6 py-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading user...</p>
        </div>
        
        <div v-else-if="user" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-900">Personal Information</h3>
              <div class="mt-2 space-y-1 text-gray-700">
                <p><span class="font-medium">Name:</span> {{ user.name }}</p>
                <p><span class="font-medium">Username:</span> {{ user.username }}</p>
                <p><span class="font-medium">Email:</span> {{ user.email }}</p>
                <p><span class="font-medium">Phone:</span> {{ user.phone }}</p>
                <p><span class="font-medium">Website:</span> {{ user.website }}</p>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900">Address</h3>
              <div class="mt-2 space-y-1 text-gray-700">
                <p>{{ user.address.street }}, {{ user.address.suite }}</p>
                <p>{{ user.address.city }}, {{ user.address.zipcode }}</p>
                <p>Lat: {{ user.address.geo.lat }}, Lng: {{ user.address.geo.lng }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-900">Company</h3>
            <div class="mt-2 space-y-1 text-gray-700">
              <p><span class="font-medium">Name:</span> {{ user.company.name }}</p>
              <p><span class="font-medium">Catch Phrase:</span> {{ user.company.catchPhrase }}</p>
              <p><span class="font-medium">Business:</span> {{ user.company.bs }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-600">
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

const emit = defineEmits(['close'])

const close = () => emit('close')
</script>

<style scoped>
</style> 