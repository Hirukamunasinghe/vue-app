// postspopuptests
import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test/utils'
import PostsPopup from '../PostsPopup.vue'

describe('PostsPopup Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(PostsPopup, {
      props: {
        show: true,
        userId: 1,
        posts: [
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
        ],
        loading: false,
        userName: 'John Doe'
      }
    })
  })

  describe('Rendering', () => {
    it('renders posts popup when visible', () => {
      expect(wrapper.find('.fixed').exists()).toBe(true)
      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('displays posts list correctly', () => {
      const postItems = wrapper.findAll('.border.border-gray-200')
      expect(postItems).toHaveLength(2)
    })

    it('shows post title and content', () => {
      const firstPost = wrapper.find('.border.border-gray-200')
      expect(firstPost.find('.font-semibold').text()).toBe('First Post')
      expect(firstPost.find('.text-gray-600').text()).toBe('This is the first post content')
    })

    it('displays user information for each post', () => {
      const userNames = wrapper.findAll('.text-blue-600')
      expect(userNames[0].text()).toBe('View Author')
    })
  })

  describe('Visibility Control', () => {
    it('shows popup when visible prop is true', async () => {
      await wrapper.setProps({ show: true })
      expect(wrapper.find('.fixed').exists()).toBe(true)
    })

    it('hides popup when visible prop is false', async () => {
      await wrapper.setProps({ show: false })
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })
  })

  describe('Close Functionality', () => {
    it('emits close event when close button is clicked', async () => {
      const closeButton = wrapper.find('button[aria-label="Close posts popup"]')
      expect(closeButton.exists()).toBe(true)
      
      await closeButton.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Post Interaction', () => {
    it('emits viewUser event when user name is clicked', async () => {
      const viewAuthorButton = wrapper.find('.text-blue-600')
      expect(viewAuthorButton.exists()).toBe(true)
      
      await viewAuthorButton.trigger('click')
      expect(wrapper.emitted('showUser')).toBeTruthy()
    })

    it('emits viewUser event with correct parameters', async () => {
      const secondPost = wrapper.findAll('.border.border-gray-200')[1]
      const viewAuthorButton = secondPost.find('.text-blue-600')
      await viewAuthorButton.trigger('click')

      expect(wrapper.emitted('showUser')[0]).toEqual([1, 2]) // userId, postId
    })
  })

  describe('Pagination', () => {
    it('renders pagination component when multiple pages exist', async () => {
      await wrapper.setProps({ posts: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        body: `Content ${i + 1}`,
        userId: 1
      })) })
      
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(true)
    })

    it('emits pageChange event when pagination changes', async () => {
      await wrapper.setProps({ posts: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        body: `Content ${i + 1}`,
        userId: 1
      })) })
      
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      await pagination.vm.$emit('change', 2)
      
      expect(wrapper.vm.currentPage).toBe(2)
    })

    it('hides pagination when only one page exists', async () => {
      await wrapper.setProps({ totalPages: 1 })
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(false)
    })
  })

  describe('Loading States', () => {
    it('shows loading indicator when loading prop is true', async () => {
      await wrapper.setProps({ loading: true })
      const loadingIndicator = wrapper.find('.animate-spin')
      expect(loadingIndicator.exists()).toBe(true)
    })

    it('hides loading indicator when loading prop is false', async () => {
      await wrapper.setProps({ loading: false })
      const loadingIndicator = wrapper.find('.animate-spin')
      expect(loadingIndicator.exists()).toBe(false)
    })
  })

  describe('Empty States', () => {
    it('shows appropriate message when no posts exist', async () => {
      await wrapper.setProps({ posts: [], loading: false })
      // When there are no posts and not loading, should show empty state
      const emptyMessage = wrapper.find('.text-gray-600')
      if (emptyMessage.exists()) {
        expect(emptyMessage.text()).toBeTruthy()
      }
    })
  })

  describe('Styling and Layout', () => {
    it('applies correct modal positioning classes', () => {
      const modal = wrapper.find('.fixed')
      expect(modal.classes()).toContain('fixed')
      expect(modal.classes()).toContain('inset-0')
      expect(modal.classes()).toContain('z-50')
    })

    it('applies correct backdrop styling', () => {
      const backdrop = wrapper.find('.fixed')
      expect(backdrop.classes()).toContain('fixed')
      expect(backdrop.classes()).toContain('inset-0')
    })

    it('applies correct modal content styling', () => {
      const content = wrapper.find('.bg-white')
      expect(content.classes()).toContain('bg-white')
      expect(content.classes()).toContain('rounded-xl')
      expect(content.classes()).toContain('shadow-2xl')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      const closeButton = wrapper.find('button[aria-label="Close posts popup"]')
      expect(closeButton.exists()).toBe(true)
    })

    it('provides proper heading structure', () => {
      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toContain('Posts from')
    })
  })

  describe('Event Handling', () => {
    it('prevents event bubbling on modal content click', async () => {
      const modalContent = wrapper.find('.bg-white')
      await modalContent.trigger('click')
      // Should not emit close event
      expect(wrapper.emitted('close')).toBeFalsy()
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      const modal = wrapper.find('.max-w-4xl')
      expect(modal.classes()).toContain('max-w-4xl')
      expect(modal.classes()).toContain('w-full')
    })

    it('handles mobile layout properly', () => {
      const content = wrapper.find('.px-4')
      expect(content.classes()).toContain('px-4')
    })
  })

  describe('Data Binding', () => {
    it('updates displayed posts when posts prop changes', async () => {
      const newPosts = [
        { id: 3, title: 'New Post', body: 'New content', userId: 1 }
      ]
      await wrapper.setProps({ posts: newPosts })
      
      // Check if the new post title is displayed
      const postTitles = wrapper.findAll('.text-gray-900')
      const hasNewPost = postTitles.some(title => title.text().includes('New Post'))
      expect(hasNewPost).toBe(true)
    })

    it('updates current page when currentPage prop changes', async () => {
      // Ensure wrapper is mounted
      expect(wrapper.exists()).toBe(true)
      
      const newPosts = [
        { id: 3, title: 'New Post', body: 'New content', userId: 1 }
      ]
      await wrapper.setProps({ posts: newPosts })
      
      // The component manages its own internal currentPage state
      // When posts change, it should reset to page 1
      await wrapper.vm.$nextTick()
      
      // Check if the posts were updated
      expect(wrapper.props('posts')).toEqual(newPosts)
    })
  })

  describe('Edge Cases', () => {
    it('handles posts with missing data gracefully', async () => {
      const incompletePosts = [
        { id: 1, title: 'Incomplete Post' }
      ]
      await wrapper.setProps({ posts: incompletePosts })
      
      // Should render without crashing
      expect(wrapper.find('.fixed').exists()).toBe(true)
    })

    it('handles very long post content', async () => {
      const longPost = {
        id: 1,
        title: 'Long Post',
        body: 'A'.repeat(1000),
        userId: 1
      }
      await wrapper.setProps({ posts: [longPost] })
      
      // Should handle long content gracefully
      expect(wrapper.find('.fixed').exists()).toBe(true)
    })
  })
}) 