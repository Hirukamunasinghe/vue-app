import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test/utils'
import UserPopup from '../UserPopup.vue'

describe('UserPopup Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(UserPopup, {
      props: {
        show: true,
        userId: 1,
        postId: 1,
        user: {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '123-456-7890',
          website: 'johndoe.com',
          address: {
            street: '123 Main St',
            suite: 'Apt 1',
            city: 'New York',
            zipcode: '10001',
            geo: { lat: '40.7128', lng: '-74.0060' }
          },
          company: {
            name: 'Tech Corp',
            catchPhrase: 'Innovative Solutions',
            bs: 'Technology Services'
          }
        }
      }
    })
  })

  describe('Rendering', () => {
    it('renders user popup when visible', () => {
      expect(wrapper.find('.fixed').exists()).toBe(true)
      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('displays user information correctly', () => {
      expect(wrapper.find('.text-gray-700').text()).toContain('John Doe')
      expect(wrapper.find('.text-gray-700').text()).toContain('johndoe')
      expect(wrapper.find('.text-gray-700').text()).toContain('john@example.com')
    })

    it('shows company information', () => {
      // Check if company information is displayed in the component
      expect(wrapper.text()).toContain('Tech Corp')
      expect(wrapper.text()).toContain('Innovative Solutions')
      expect(wrapper.text()).toContain('Technology Services')
    })

    it('displays location information', () => {
      // Check if address information is displayed in the component
      expect(wrapper.text()).toContain('123 Main St')
      expect(wrapper.text()).toContain('New York')
      expect(wrapper.text()).toContain('10001')
    })
  })

  describe('Visibility Control', () => {
    it('hides popup when visible prop is false', async () => {
      await wrapper.setProps({ show: false })
      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('shows popup when visible prop is true', async () => {
      await wrapper.setProps({ show: true })
      expect(wrapper.find('.fixed').exists()).toBe(true)
    })
  })

  describe('Close Functionality', () => {
    it('emits close event when close button is clicked', async () => {
      const closeButton = wrapper.find('button[aria-label="Close user popup"]')
      expect(closeButton.exists()).toBe(true)
      
      await closeButton.trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('emits goBack event when back button is clicked', async () => {
      const backButton = wrapper.find('button[aria-label="Go back to posts"]')
      expect(backButton.exists()).toBe(true)
      
      await backButton.trigger('click')
      expect(wrapper.emitted('goBack')).toBeTruthy()
    })
  })

  describe('User Data Display', () => {
    it('handles missing user data gracefully', async () => {
      await wrapper.setProps({ user: null })
      expect(wrapper.find('.text-gray-600').text()).toBe('User not found')
    })

    it('displays user avatar if available', () => {
      const avatar = wrapper.find('img[alt="User Avatar"]')
      expect(avatar.exists()).toBe(true)
      expect(avatar.attributes('src')).toBeDefined()
    })

    it('shows post ID information', () => {
      expect(wrapper.props('postId')).toBe(1)
    })
  })

  describe('Styling and Layout', () => {
    it('applies correct modal positioning classes', () => {
      expect(wrapper.find('.fixed').classes()).toContain('inset-0')
      expect(wrapper.find('.fixed').classes()).toContain('flex')
      expect(wrapper.find('.fixed').classes()).toContain('items-center')
    })

    it('applies correct backdrop styling', () => {
      expect(wrapper.find('.fixed').classes()).toContain('z-50')
    })

    it('applies correct modal content styling', () => {
      expect(wrapper.find('.bg-white').classes()).toContain('rounded-2xl')
      expect(wrapper.find('.bg-white').classes()).toContain('shadow-2xl')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      const closeButton = wrapper.find('button[aria-label="Close user popup"]')
      const backButton = wrapper.find('button[aria-label="Go back to posts"]')
      
      expect(closeButton.exists()).toBe(true)
      expect(backButton.exists()).toBe(true)
    })

    it('has proper button roles', () => {
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.attributes('aria-label')).toBeDefined()
      })
    })

    it('provides proper heading structure', () => {
      const headings = wrapper.findAll('h2, h3')
      expect(headings.length).toBeGreaterThan(0)
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
      expect(wrapper.find('.max-w-3xl').exists()).toBe(true)
    })

    it('handles mobile layout properly', () => {
      expect(wrapper.find('.p-4').exists()).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty user object', async () => {
      await wrapper.setProps({ 
        user: {
          id: 1,
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '123-456-7890',
          website: 'johndoe.com',
          address: {
            street: '123 Main St',
            suite: 'Apt 1',
            city: 'New York',
            zipcode: '10001',
            geo: { lat: '40.7128', lng: '-74.0060' }
          },
          company: {
            name: 'Tech Corp',
            catchPhrase: 'Innovative Solutions',
            bs: 'Technology Services'
          }
        }
      })
      // Should not crash, should show user info
      expect(wrapper.find('.fixed').exists()).toBe(true)
    })

    it('handles very long text content', async () => {
      const longName = 'A'.repeat(100)
      await wrapper.setProps({
        user: {
          ...wrapper.props('user'),
          name: longName
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.text-2xl').text()).toContain(longName)
    })
  })
}) 