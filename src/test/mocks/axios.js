import { vi } from 'vitest'

// Mock posts data
export const mockPosts = [
  {
    id: 1,
    userId: 1,
    title: 'Test Post 1',
    body: 'This is the body of test post 1'
  },
  {
    id: 2,
    userId: 1,
    title: 'Test Post 2',
    body: 'This is the body of test post 2'
  },
  {
    id: 3,
    userId: 2,
    title: 'Test Post 3',
    body: 'This is the body of test post 3'
  },
  {
    id: 4,
    userId: 2,
    title: 'Test Post 4',
    body: 'This is the body of test post 4'
  },
  {
    id: 5,
    userId: 3,
    title: 'Test Post 5',
    body: 'This is the body of test post 5'
  }
]

// Mock user data
export const mockUsers = {
  1: {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '123-456-7890',
    website: 'johndoe.com',
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
  },
  2: {
    id: 2,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    website: 'janesmith.com',
    company: {
      name: 'Another Company',
      catchPhrase: 'Another catch phrase',
      bs: 'Another bs'
    },
    address: {
      street: 'Another Street',
      suite: 'Another Suite',
      city: 'Another City',
      zipcode: '54321',
      geo: {
        lat: '1',
        lng: '1'
      }
    }
  }
}

// Mock axios
export const mockAxios = {
  get: vi.fn()
}

// Setup default mock responses
mockAxios.get.mockImplementation((url) => {
  if (url === 'https://jsonplaceholder.typicode.com/posts') {
    return Promise.resolve({ data: mockPosts })
  }
  
  const userIdMatch = url.match(/\/users\/(\d+)/)
  if (userIdMatch) {
    const userId = parseInt(userIdMatch[1])
    if (mockUsers[userId]) {
      return Promise.resolve({ data: mockUsers[userId] })
    }
    return Promise.reject(new Error('User not found'))
  }
  
  return Promise.reject(new Error('URL not mocked'))
})

export default mockAxios 