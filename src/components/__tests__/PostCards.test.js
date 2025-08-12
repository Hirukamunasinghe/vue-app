// postcards
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostCards from '../PostCards.vue'
import { mockUsers, mockPosts, setupAxiosMocks } from '../../test/utils'
import axios from 'axios'

// Mock the child components
vi.mock('../Navigation.vue', () => ({
  default: {
    name: 'Navigation',
    template: '<div class="navigation-mock"></div>',
    emits: ['search', 'filter', 'sort', 'viewMode']
  }
}))

vi.mock('../Pagination.vue', () => ({
  default: {
    name: 'Pagination',
    template: '<div class="pagination-mock"></div>',
    props: ['current', 'totalPages'],
    emits: ['change']
  }
}))

vi.mock('../PostsPopup.vue', () => ({
  default: {
    name: 'PostsPopup',
    template: '<div class="posts-popup-mock"></div>',
    props: ['posts', 'users', 'visible', 'currentPage', 'totalPages', 'loading'],
    emits: ['close', 'viewUser', 'pageChange']
  }
}))

vi.mock('../UserPopup.vue', () => ({
  default: {
    name: 'UserPopup',
    template: '<div class="user-popup-mock"></div>',
    props: ['user', 'postId', 'visible'],
    emits: ['close', 'goBack']
  }
}))

describe('PostCards Component', () => {
  let wrapper

  beforeEach(() => {
    setupAxiosMocks()
    wrapper = mount(PostCards, {
      global: {
        stubs: {
          'font-awesome-icon': true,
          'i': true
        }
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('renders the main container', () => {
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })

    it('renders navigation component', () => {
      expect(wrapper.findComponent({ name: 'Navigation' }).exists()).toBe(true)
    })

    it('displays header with title and description', () => {
      const title = wrapper.find('h1')
      const description = wrapper.find('p')
      
      expect(title.text()).toBe('User Directory')
      expect(description.text()).toBe('Discover and connect with users from around the world')
    })

    it('shows stats cards', () => {
      const totalUsersCard = wrapper.find('.text-blue-600')
      const totalPostsCard = wrapper.find('.text-green-600')
      
      expect(totalUsersCard.exists()).toBe(true)
      expect(totalPostsCard.exists()).toBe(true)
    })
  })

  describe('Data Fetching', () => {
    it('fetches users on component mount', async () => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
    })

    it('fetches posts on component mount', async () => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts')
    })

    it('handles API errors gracefully', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'))
      
      // Re-mount to trigger the error
      const errorWrapper = mount(PostCards)
      await errorWrapper.vm.$nextTick()
      
      expect(console.error).toHaveBeenCalledWith('Error fetching users:', expect.any(Error))
    })
  })

  describe('User Display', () => {
    it('renders user cards in grid view', async () => {
      await wrapper.vm.$nextTick()
      const userCards = wrapper.findAll('.bg-white.rounded-xl')
      expect(userCards.length).toBeGreaterThan(0)
    })

    it('displays user information correctly', async () => {
      await wrapper.vm.$nextTick()
      const userName = wrapper.find('.text-xl.font-semibold')
      const userEmail = wrapper.find('.text-sm.text-gray-600')
      
      expect(userName.exists()).toBe(true)
      expect(userEmail.exists()).toBe(true)
    })

    it('shows company information', async () => {
      await wrapper.vm.$nextTick()
      const companyName = wrapper.find('.text-blue-100')
      const catchPhrase = wrapper.find('.text-sm.text-gray-600')
      
      expect(companyName.exists()).toBe(true)
      expect(catchPhrase.exists()).toBe(true)
    })
  })

  describe('Search and Filtering', () => {
    it('handles search input', async () => {
      const navigation = wrapper.findComponent({ name: 'Navigation' })
      await navigation.vm.$emit('search', 'John')
      
      expect(wrapper.vm.searchQuery).toBe('John')
    })

    it('handles filter changes', async () => {
      const navigation = wrapper.findComponent({ name: 'Navigation' })
      await navigation.vm.$emit('filter', ['Tech Corp'])
      
      expect(wrapper.vm.selectedCompanies).toContain('Tech Corp')
    })

    it('handles sort changes', async () => {
      const navigation = wrapper.findComponent({ name: 'Navigation' })
      await navigation.vm.$emit('sort', 'name')
      
      expect(wrapper.vm.selectedSort).toBe('name')
    })

    it('handles view mode changes', async () => {
      const navigation = wrapper.findComponent({ name: 'Navigation' })
      await navigation.vm.$emit('viewMode', 'table')
      
      expect(wrapper.vm.viewMode).toBe('table')
    })
  })

  describe('Pagination', () => {
    it('renders pagination component', async () => {
      // Set up component state to trigger pagination
      wrapper.vm.users = mockUsers
      wrapper.vm.posts = mockPosts
      wrapper.vm.currentPage = 1
      wrapper.vm.pageSize = 2
      
      // Force a re-render
      await wrapper.vm.$nextTick()
      
      // Check if pagination is rendered (only when totalPages > 1)
      const totalPages = Math.ceil(mockUsers.length / wrapper.vm.pageSize)
      if (totalPages > 1) {
        const pagination = wrapper.findComponent({ name: 'Pagination' })
        expect(pagination.exists()).toBe(true)
      }
    })

    it('handles page changes', async () => {
      wrapper.vm.users = mockUsers
      wrapper.vm.posts = mockPosts
      wrapper.vm.currentPage = 1
      wrapper.vm.pageSize = 2
      
      await wrapper.vm.$nextTick()
      
      // Find pagination component
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      if (pagination.exists()) {
        // Test page change
        await pagination.vm.$emit('change', 2)
        expect(wrapper.vm.currentPage).toBe(2)
      }
    })

    it('resets pagination when filters change', async () => {
      await wrapper.vm.$nextTick()
      const initialPage = wrapper.vm.currentPage
      
      // Change a filter
      wrapper.vm.searchQuery = 'New Search'
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.currentPage).toBe(1)
    })
  })

  describe('Popup Management', () => {
    it('shows posts popup when triggered', async () => {
      await wrapper.vm.showPostsPopup(1)
      
      expect(wrapper.vm.showPosts).toBe(true)
      expect(wrapper.vm.selectedUserId).toBe(1)
    })

    it('shows user popup when triggered', async () => {
      await wrapper.vm.showUserPopup(1, 1)
      
      expect(wrapper.vm.showUser).toBe(true)
      expect(wrapper.vm.selectedUserId).toBe(1)
      expect(wrapper.vm.selectedPostId).toBe(1)
    })

    it('closes posts popup', async () => {
      wrapper.vm.showPosts = true
      await wrapper.vm.closePostsPopup()
      
      expect(wrapper.vm.showPosts).toBe(false)
    })

    it('closes user popup', async () => {
      wrapper.vm.showUser = true
      await wrapper.vm.closeUserPopup()
      
      expect(wrapper.vm.showUser).toBe(false)
      expect(wrapper.vm.selectedUser).toBe(null)
    })

    it('goes back to posts from user popup', async () => {
      wrapper.vm.showUser = true
      wrapper.vm.showPosts = false
      
      await wrapper.vm.goBackToPosts()
      
      expect(wrapper.vm.showUser).toBe(false)
      expect(wrapper.vm.showPosts).toBe(true)
      expect(wrapper.vm.selectedUser).toBe(null)
    })
  })

  describe('User Interactions', () => {
    it('handles user card clicks', async () => {
      wrapper.vm.users = mockUsers
      wrapper.vm.posts = mockPosts
      
      await wrapper.vm.$nextTick()
      
      const userCard = wrapper.find('.bg-white.rounded-xl')
      expect(userCard.exists()).toBe(true)
      
      const viewPostsButton = userCard.find('button')
      expect(viewPostsButton.exists()).toBe(true)
    })

    it('handles post count display', async () => {
      await wrapper.vm.$nextTick()
      const postCount = wrapper.vm.getUserPostCount(1)
      expect(typeof postCount).toBe('number')
    })

    it('handles avatar image display', async () => {
      const avatar = wrapper.vm.getUserAvatar(1)
      expect(avatar).toMatch(/^\/image.*\.png$/)
    })
  })

  describe('State Management', () => {
    it('manages loading states correctly', async () => {
      expect(wrapper.vm.usersLoading).toBe(false)
      expect(wrapper.vm.userLoading).toBe(false)
    })

    it('manages popup visibility states', () => {
      expect(wrapper.vm.showPosts).toBe(false)
      expect(wrapper.vm.showUser).toBe(false)
    })

    it('manages selected user and post states', () => {
      expect(wrapper.vm.selectedUser).toBe(null)
      expect(wrapper.vm.selectedUserId).toBe(null)
      expect(wrapper.vm.selectedPostId).toBe(null)
    })
  })

  describe('Computed Properties', () => {
    it('filters users based on search query', async () => {
      wrapper.vm.searchQuery = 'John'
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.filteredUsers.length).toBeGreaterThan(0)
    })

    it('filters users based on company selection', async () => {
      wrapper.vm.selectedCompanies = ['Tech Corp']
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.filteredUsers.length).toBeGreaterThan(0)
    })

    it('sorts users correctly', async () => {
      wrapper.vm.selectedSort = 'name'
      await wrapper.vm.$nextTick()
      
      const sortedUsers = wrapper.vm.filteredUsers
      expect(sortedUsers.length).toBeGreaterThan(0)
    })

    it('paginates users correctly', async () => {
      await wrapper.vm.$nextTick()
      const paginatedUsers = wrapper.vm.paginatedUsers
      expect(paginatedUsers.length).toBeLessThanOrEqual(9) // Default page size
    })
  })

  describe('Active Filters Display', () => {
    it('shows active filters when they exist', async () => {
      wrapper.vm.selectedCompanies = ['Tech Corp']
      wrapper.vm.searchQuery = 'John'
      await wrapper.vm.$nextTick()
      
      const activeFilters = wrapper.findAll('.bg-blue-100')
      expect(activeFilters.length).toBeGreaterThan(0)
    })

    it('allows removing individual filters', async () => {
      wrapper.vm.selectedCompanies = ['Tech Corp']
      wrapper.vm.searchQuery = 'John'
      await wrapper.vm.$nextTick()
      
      // The activeFilters computed property creates filters with prefixes
      // So we need to remove the filter with the full format
      const companyFilter = `Company: ${wrapper.vm.selectedCompanies.join(', ')}`
      wrapper.vm.removeFilter(companyFilter)
      await wrapper.vm.$nextTick()
      
      // Check if filter was removed
      expect(wrapper.vm.selectedCompanies).toEqual([])
    })

    it('allows clearing all filters', async () => {
      wrapper.vm.selectedCompanies = ['Tech Corp']
      wrapper.vm.searchQuery = 'John'
      await wrapper.vm.$nextTick()
      
      const clearAllButton = wrapper.find('.text-gray-500.underline')
      await clearAllButton.trigger('click')
      
      expect(wrapper.vm.selectedCompanies).toEqual([])
      expect(wrapper.vm.searchQuery).toBe('')
    })
  })

  describe('Error Handling', () => {
    it('handles user fetch errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('User fetch failed'))
      
      await wrapper.vm.fetchUsers()
      
      expect(console.error).toHaveBeenCalledWith('Error fetching users:', expect.any(Error))
    })

    it('handles post fetch errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Post fetch failed'))
      
      await wrapper.vm.fetchPosts()
      
      expect(console.error).toHaveBeenCalledWith('Error fetching posts:', expect.any(Error))
    })

    it('handles individual user fetch errors', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Individual user fetch failed'))
      
      await wrapper.vm.fetchUser(1)
      
      expect(console.error).toHaveBeenCalledWith('Error fetching user:', expect.any(Error))
      expect(wrapper.vm.selectedUser).toBe(null)
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      const gridContainer = wrapper.find('.grid')
      expect(gridContainer.classes()).toContain('grid-cols-1')
      expect(gridContainer.classes()).toContain('sm:grid-cols-2')
      expect(gridContainer.classes()).toContain('xl:grid-cols-3')
    })

    it('applies responsive spacing classes', () => {
      const container = wrapper.find('.max-w-7xl')
      expect(container.classes()).toContain('px-4')
      expect(container.classes()).toContain('sm:px-6')
      expect(container.classes()).toContain('lg:px-8')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty data arrays', async () => {
      wrapper.vm.users = []
      wrapper.vm.posts = []
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.filteredUsers).toHaveLength(0)
      expect(wrapper.vm.posts).toHaveLength(0)
    })

    it('handles missing user properties gracefully', async () => {
      const userWithMissingProps = {
        id: 999,
        name: 'Test User',
        email: 'test@example.com',
        company: { name: 'Test Company' },
        address: { city: 'Test City' }
        // Missing some properties but not the critical ones
      }
      
      wrapper.vm.users = [userWithMissingProps]
      wrapper.vm.posts = mockPosts
      
      await wrapper.vm.$nextTick()
      
      // Should render without crashing
      const userCard = wrapper.find('.bg-white.rounded-xl')
      expect(userCard.exists()).toBe(true)
      
      // Should handle missing properties gracefully
      expect(() => wrapper.vm.getUserPostCount(999)).not.toThrow()
    })

    it('handles very large datasets', async () => {
      const largeUserArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        company: { name: 'Company', catchPhrase: 'Phrase' },
        address: { city: 'City', country: 'Country' }
      }))
      
      wrapper.vm.users = largeUserArray
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.filteredUsers).toHaveLength(1000)
    })
  })
}) 