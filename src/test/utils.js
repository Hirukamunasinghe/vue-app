import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { vi } from 'vitest'

// Helper function to render component with default options
export function renderComponent(component, options = {}) {
  const defaultOptions = {
    global: {
      stubs: {
        // Stub FontAwesome icons
        'i': { template: '<span class="icon"></span>' }
      }
    }
  }
  
  return render(component, { ...defaultOptions, ...options })
}

// Helper function to wait for async operations
export { waitFor }

// Helper function to fire events
export { fireEvent }

// Helper function to query elements
export { screen }

// Helper function to create mock functions
export function createMockFunction() {
  return vi.fn()
}

// Helper function to create mock props
export function createMockProps(props = {}) {
  return {
    show: false,
    userId: null,
    posts: [],
    loading: false,
    ...props
  }
}

// Helper function to create mock posts
export function createMockPosts(count = 5, userId = 1) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    userId,
    title: `Test Post ${i + 1}`,
    body: `This is the body of test post ${i + 1}`
  }))
}

// Helper function to create mock user
export function createMockUser(id = 1) {
  return {
    id,
    name: `User ${id}`,
    username: `user${id}`,
    email: `user${id}@example.com`,
    phone: '123-456-7890',
    website: `user${id}.com`,
    company: {
      name: 'Test Company',
      catchPhrase: 'Test catch phrase',
      bs: 'Test bs'
    },
    address: {
      street: 'Test Street',
      suite: 'Test Suite',
      city: 'Test City',
      zipcode: '12345',
      geo: {
        lat: '0',
        lng: '0'
      }
    }
  }
} 