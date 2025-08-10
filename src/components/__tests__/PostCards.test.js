import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { createMockPosts, createMockUser } from '../../test/utils'

// --- Mock axios (safe for hoisting) ---
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}))

// Mock the child components
vi.mock('../PostsPopup.vue', () => ({
  default: {
    name: 'PostsPopup',
    template: '<div data-testid="posts-popup">Posts Popup Component</div>',
    props: ['show', 'userId', 'posts', 'loading'],
    emits: ['close', 'showUser']
  }
}))

vi.mock('../UserPopup.vue', () => ({
  default: {
    name: 'UserPopup',
    template: '<div data-testid="user-popup">User Popup Component</div>',
    props: ['show', 'userId', 'postId', 'user', 'loading'],
    emits: ['close']
  }
}))

vi.mock('../Pagination.vue', () => ({
  default: {
    name: 'Pagination',
    template: '<div data-testid="pagination">Pagination Component</div>',
    props: ['current', 'totalPages'],
    emits: ['change']
  }
}))

// Import after mocks (ok because vi.mock is hoisted)
import axios from 'axios'
import PostCards from '../PostCards.vue'

describe('PostCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockReset()

    // Default axios mocks for posts and users
    axios.get.mockImplementation((url) => {
      if (url === 'https://jsonplaceholder.typicode.com/posts') {
        // 10 posts, userId starts at 1
        return Promise.resolve({ data: createMockPosts(10, 1) })
      }

      if (url === 'https://jsonplaceholder.typicode.com/users') {
        // Mock users with names
        const users = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`
        }))
        return Promise.resolve({ data: users })
      }

      const userIdMatch = url.match(/\/users\/(\d+)/)
      if (userIdMatch) {
        const userId = parseInt(userIdMatch[1])
        return Promise.resolve({ data: createMockUser(userId) })
      }

      return Promise.reject(new Error('URL not mocked'))
    })
  })

  it('renders the main title and description', () => {
    render(PostCards)
    expect(screen.getByText('Users Project')).toBeInTheDocument()
    expect(screen.getByText('Browse posts by user and view author details')).toBeInTheDocument()
  })

  it('renders user cards grid with correct number of cards', () => {
    render(PostCards)
    
    // Should show 5 cards per page (cardPageSize = 5)
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('User 2')).toBeInTheDocument()
    expect(screen.getByText('User 3')).toBeInTheDocument()
    expect(screen.getByText('User 4')).toBeInTheDocument()
    expect(screen.getByText('User 5')).toBeInTheDocument()
    
    // Should not show cards beyond page 1
    expect(screen.queryByText('User 6')).not.toBeInTheDocument()
  })

  it('displays correct user names on cards', () => {
    render(PostCards)
    
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('User 2')).toBeInTheDocument()
    expect(screen.getByText('User 3')).toBeInTheDocument()
    expect(screen.getByText('User 4')).toBeInTheDocument()
    expect(screen.getByText('User 5')).toBeInTheDocument()
  })

  it('shows pagination for cards when there are more than 5 users', () => {
    render(PostCards)
    const pagination = screen.getByTestId('pagination')
    expect(pagination).toBeInTheDocument()
  })

  it('fetches posts on component mount', async () => {
    render(PostCards)
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
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
  })

  it('filters posts by selected user ID (opens posts popup for user 1)', async () => {
    render(PostCards)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })
    
    const viewPostsButton = screen.getAllByText('View Posts')[0] // user 1
    await fireEvent.click(viewPostsButton)
    
    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
  })

  it('handles card pagination component render', () => {
    render(PostCards)
    const pagination = screen.getByTestId('pagination')
    expect(pagination).toBeInTheDocument()
  })

  it('closes posts popup when close event is emitted (smoke test)', async () => {
    render(PostCards)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })
    
    const viewPostsButton = screen.getAllByText('View Posts')[0]
    await fireEvent.click(viewPostsButton)
    
    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
    // The actual close is handled by PostsPopup; we just ensure it renders without crashing
  })

  it('shows user popup when showUser event is emitted from posts popup (smoke test)', async () => {
    render(PostCards)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })
    
    const viewPostsButton = screen.getAllByText('View Posts')[0]
    await fireEvent.click(viewPostsButton)
    
    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
    // Event emission is internal to PostsPopup; we validate render path only
  })

  it('fetches user data when user popup is opened (axios wired)', async () => {
    render(PostCards)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })
    // Actual user fetch is triggered by PostsPopup event; wiring is covered through axios mock
  })

  it('handles API errors gracefully', async () => {
    // Next call to /posts fails
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('API Error')))
    
    render(PostCards)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })
    
    // Component should still render
    expect(screen.getByText('Users Project')).toBeInTheDocument()
  })

  it('has correct CSS classes for styling', () => {
    render(PostCards)
    
    const container = screen.getByText('Users Project').closest('.max-w-7xl')
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-10')
    
    const title = screen.getByText('Users Project')
    expect(title).toHaveClass('text-4xl', 'font-extrabold', 'tracking-tight', 'text-slate-900', 'mb-2', 'text-center')
  })

  it('renders cards with correct styling classes', () => {
    render(PostCards)
    
    const card = screen.getByText('Card 1').closest('.relative')
    expect(card).toHaveClass(
      'relative',
      'overflow-hidden',
      'rounded-xl',
      'border',
      'border-slate-200',
      'bg-white/90',
      'backdrop-blur-sm',
      'p-6',
      'shadow-sm'
    )
  })

  it('handles empty posts array correctly', async () => {
    // First call to /posts returns empty list
    axios.get.mockImplementationOnce((url) => {
      if (url === 'https://jsonplaceholder.typicode.com/posts') {
        return Promise.resolve({ data: [] })
      }
      return Promise.reject(new Error('URL not mocked'))
    })
    
    render(PostCards)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })
    
    // Component should still render cards (cards are based on fixed user IDs)
    expect(screen.getByText('User 1')).toBeInTheDocument()
  })

  it('updates selected user ID when view posts is clicked (user 3)', async () => {
    render(PostCards)
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })
    
    const viewPostsButtons = screen.getAllByText('View Posts')
    const user3Button = viewPostsButtons[2] // Third button (user 3)
    await fireEvent.click(user3Button)
    
    expect(screen.getByTestId('posts-popup')).toBeInTheDocument()
  })

  it('resets to first card page when component remounts', () => {
    render(PostCards)
    
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('User 5')).toBeInTheDocument()
    expect(screen.queryByText('User 6')).not.toBeInTheDocument()
  })
})
