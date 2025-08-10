import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import PostCards from '../../components/PostCards.vue'

// --- Mock axios safely (no external refs in the factory) ---
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn()
    }
  }
})

// Mock child components with realistic behavior
vi.mock('../../components/PostsPopup.vue', () => ({
  default: {
    name: 'PostsPopup',
    template: `
      <div v-if="show" data-testid="posts-popup">
        <h3>Posts from User ID {{ userId }}</h3>
        <div v-if="loading">Loading posts...</div>
        <div v-else-if="posts.length > 0">
          <div v-for="post in posts" :key="post.id" data-testid="post-item">
            <h4>{{ post.title }}</h4>
            <p>{{ post.body }}</p>
            <button @click="$emit('showUser', userId, post.id)" data-testid="view-author-btn">
              View Author
            </button>
          </div>
        </div>
        <button @click="$emit('close')" data-testid="close-posts-btn">Close</button>
      </div>
    `,
    props: ['show', 'userId', 'posts', 'loading'],
    emits: ['close', 'showUser']
  }
}))

vi.mock('../../components/UserPopup.vue', () => ({
  default: {
    name: 'UserPopup',
    template: `
      <div v-if="show" data-testid="user-popup">
        <h3>User Information (ID: {{ userId }})</h3>
        <p>Author of Post ID: {{ postId }}</p>
        <div v-if="loading">Loading user...</div>
        <div v-else-if="user">
          <p>Name: {{ user.name }}</p>
          <p>Email: {{ user.email }}</p>
        </div>
        <button @click="$emit('close')" data-testid="close-user-btn">Close</button>
      </div>
    `,
    props: ['show', 'userId', 'postId', 'user', 'loading'],
    emits: ['close']
  }
}))

vi.mock('../../components/Pagination.vue', () => ({
  default: {
    name: 'Pagination',
    template: `
      <div data-testid="pagination">
        <button @click="$emit('change', current - 1)" :disabled="current === 1">Previous</button>
        <span>Page {{ current }} of {{ totalPages }}</span>
        <button @click="$emit('change', current + 1)" :disabled="current === totalPages">Next</button>
      </div>
    `,
    props: ['current', 'totalPages'],
    emits: ['change']
  }
}))

// Import axios AFTER the mock (vi.mock is hoisted anyway)
import axios from 'axios'

describe('Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockReset()

    // Default axios behavior for this suite
    // - /posts -> 10 posts (userId cycles 1..10)
    // - /users/:id -> simple user object
    axios.get.mockImplementation((url) => {
      if (url === 'https://jsonplaceholder.typicode.com/posts') {
        const posts = Array.from({ length: 10 }, (_, i) => {
          const id = i + 1
          return {
            userId: id,
            id,
            title: `Post ${id}`,
            body: `Body for post ${id}`
          }
        })
        return Promise.resolve({ data: posts })
      }

      const match = url.match(/\/users\/(\d+)/)
      if (match) {
        const userId = Number(match[1])
        return Promise.resolve({
          data: {
            id: userId,
            name: `User ${userId}`,
            email: `user${userId}@example.com`
          }
        })
      }

      return Promise.reject(new Error('URL not mocked'))
    })
  })

  it('shows posts popup when view posts button is clicked', async () => {
    render(PostCards)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    const viewPostsButton = screen.getAllByText('View Posts')[0]
    await fireEvent.click(viewPostsButton)

    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
    expect(screen.getByText('Posts from User ID 1')).toBeInTheDocument()
  })

  it('shows user popup when view author button is clicked from posts popup', async () => {
    render(PostCards)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    await fireEvent.click(screen.getAllByText('View Posts')[0])
    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('view-author-btn'))

    expect(screen.getByTestId('user-popup')).toBeInTheDocument()
    expect(screen.queryByTestId('posts-popup')).not.toBeInTheDocument()
  })

  it('closes user popup and reopens posts popup when close button is clicked', async () => {
    render(PostCards)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    await fireEvent.click(screen.getAllByText('View Posts')[0])
    await fireEvent.click(screen.getByTestId('view-author-btn'))
    expect(screen.getByTestId('user-popup')).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('close-user-btn'))

    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
    expect(screen.queryByTestId('user-popup')).not.toBeInTheDocument()
  })

  it('filters posts correctly for different users', async () => {
    render(PostCards)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    const viewPostsButtons = screen.getAllByText('View Posts')

    await fireEvent.click(viewPostsButtons[0])
    expect(screen.getByText('Posts from User ID 1')).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('close-posts-btn'))

    await fireEvent.click(viewPostsButtons[1])
    expect(screen.getByText('Posts from User ID 2')).toBeInTheDocument()
  })

  it('handles pagination correctly for cards and renders posts popup', async () => {
    render(PostCards)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    const cardPagination = screen.getByTestId('pagination')
    expect(cardPagination).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()

    await fireEvent.click(screen.getAllByText('View Posts')[0])
    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
  })

  it('maintains correct state when switching between popups', async () => {
    render(PostCards)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    const viewPostsButtons = screen.getAllByText('View Posts')
    await fireEvent.click(viewPostsButtons[0])

    expect(screen.getByText('Posts from User ID 1')).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('view-author-btn'))

    expect(screen.getByText('User Information (ID: 1)')).toBeInTheDocument()
    expect(screen.getByText('Author of Post ID: 1')).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('close-user-btn'))

    expect(screen.getByText('Posts from User ID 1')).toBeInTheDocument()
  })

  it('handles API errors gracefully in the component flow', async () => {
    // First call to /posts fails
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('API Error')))

    render(PostCards)

    // Component still renders
    expect(screen.getByText('Users Project')).toBeInTheDocument()

    // You can still open the posts popup UI (data may be empty)
    const viewPostsButton = screen.getAllByText('View Posts')[0]
    await fireEvent.click(viewPostsButton)

    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
  })

  it('correctly passes data between components', async () => {
    render(PostCards)

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    await fireEvent.click(screen.getAllByText('View Posts')[0])
    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('view-author-btn'))

    expect(screen.getByText('User Information (ID: 1)')).toBeInTheDocument()
    expect(screen.getByText('Author of Post ID: 1')).toBeInTheDocument()
  })
})
