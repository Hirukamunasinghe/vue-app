import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import axios from 'axios'

// Mock data for testing
export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    company: {
      name: 'Tech Corp',
      catchPhrase: 'Innovative solutions'
    },
    address: {
      city: 'New York',
      country: 'USA'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    company: {
      name: 'Design Studio',
      catchPhrase: 'Creative excellence'
    },
    address: {
      city: 'London',
      country: 'UK'
    }
  }
]

export const mockPosts = [
  {
    id: 1,
    title: 'First Post',
    body: 'This is the first post content',
    userId: 1
  },
  {
    id: 2,
    title: 'Second Post',
    body: 'This is the second post content',
    userId: 1
  }
]

// Helper function to mount components with common options
export function mountComponent(component, options = {}) {
  return mount(component, {
    global: {
      stubs: {
        'font-awesome-icon': true,
        'i': true
      }
    },
    ...options
  })
}

// Helper function to mock axios responses
export function mockAxiosResponse(data, status = 200) {
  return {
    data,
    status,
    statusText: 'OK'
  }
}

// Helper function to set up axios mocks
export function setupAxiosMocks() {
  vi.mocked(axios.get).mockImplementation((url) => {
    if (url.includes('/users')) {
      return Promise.resolve(mockAxiosResponse(mockUsers))
    }
    if (url.includes('/posts')) {
      return Promise.resolve(mockAxiosResponse(mockPosts))
    }
    if (url.includes('/users/1')) {
      return Promise.resolve(mockAxiosResponse(mockUsers[0]))
    }
    return Promise.resolve(mockAxiosResponse([]))
  })
}

// Helper function to wait for next tick
export async function nextTick() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// Helper function to create mock event
export function createMockEvent(type = 'click', target = null) {
  return {
    type,
    target: target || document.createElement('button'),
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
  }
} 