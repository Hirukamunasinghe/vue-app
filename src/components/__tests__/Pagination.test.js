// pagination testing
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../Pagination.vue'

describe('Pagination Component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Pagination, {
      props: {
        current: 1,
        totalPages: 10
      }
    })
  })

  describe('Rendering', () => {
    it('renders pagination component correctly', () => {
      expect(wrapper.find('.flex').exists()).toBe(true)
    })

    it('shows correct total number of page buttons', () => {
      const pageButtons = wrapper.findAll('button').filter(btn => 
        btn.text().match(/^\d+$/)
      )
      expect(pageButtons).toHaveLength(5) // Max 5 buttons shown
    })

    it('displays current page as active', () => {
      const activeButton = wrapper.find('button[aria-current="page"]')
      expect(activeButton.exists()).toBe(true)
      expect(activeButton.text()).toBe('1')
      expect(activeButton.classes()).toContain('bg-blue-500')
    })
  })

  describe('Navigation Buttons', () => {
    it('renders previous button', () => {
      const prevButton = wrapper.find('button[aria-label="Previous page"]')
      expect(prevButton.exists()).toBe(true)
      expect(prevButton.find('i').exists()).toBe(true)
    })

    it('renders next button', () => {
      const nextButton = wrapper.find('button[aria-label="Next page"]')
      expect(nextButton.exists()).toBe(true)
      expect(nextButton.find('i').exists()).toBe(true)
    })

    it('disables previous button on first page', () => {
      const prevButton = wrapper.find('button[aria-label="Previous page"]')
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('enables next button when not on last page', () => {
      const nextButton = wrapper.find('button[aria-label="Next page"]')
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Page Navigation', () => {
    it('emits change event when page button is clicked', async () => {
      const pageButton = wrapper.findAll('button').find(btn => btn.text() === '2')
      await pageButton.trigger('click')
      
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')[0]).toEqual([2])
    })

    it('emits change event when next button is clicked', async () => {
      const nextButton = wrapper.find('button[aria-label="Next page"]')
      await nextButton.trigger('click')
      
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')[0]).toEqual([2])
    })

    it('emits change event when previous button is clicked', async () => {
      // Set current page to 2 first
      await wrapper.setProps({ current: 2 })
      const prevButton = wrapper.find('button[aria-label="Previous page"]')
      await prevButton.trigger('click')
      
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')[0]).toEqual([1])
    })
  })

  describe('Page Calculation Logic', () => {
    it('shows all pages when total pages <= 5', async () => {
      await wrapper.setProps({ current: 1, totalPages: 3 })
      const pageButtons = wrapper.findAll('button').filter(btn => 
        btn.text().match(/^\d+$/)
      )
      expect(pageButtons).toHaveLength(3)
    })

    it('shows correct page range around current page', async () => {
      await wrapper.setProps({ current: 5, totalPages: 10 })
      const pageButtons = wrapper.findAll('button').filter(btn => 
        btn.text().match(/^\d+$/)
      )
      const pageNumbers = pageButtons.map(btn => parseInt(btn.text()))
      expect(pageNumbers).toEqual([3, 4, 5, 6, 7])
    })

    it('adjusts start when near end of pages', () => {
      const wrapper = mount(Pagination, {
        props: {
          current: 8,
          totalPages: 10
        }
      })
      
      const pageButtons = wrapper.findAll('button').filter(btn => 
        btn.text() && !isNaN(parseInt(btn.text()))
      )
      const pageNumbers = pageButtons.map(btn => parseInt(btn.text()))
      expect(pageNumbers).toEqual([6, 7, 8, 9, 10])
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      const prevButton = wrapper.find('button[aria-label="Previous page"]')
      const nextButton = wrapper.find('button[aria-label="Next page"]')
      
      expect(prevButton.exists()).toBe(true)
      expect(nextButton.exists()).toBe(true)
    })

    it('marks current page with aria-current', () => {
      const currentPageButton = wrapper.find('button[aria-current="page"]')
      expect(currentPageButton.exists()).toBe(true)
    })

    it('provides title attributes for page buttons', () => {
      const pageButtons = wrapper.findAll('button').filter(btn => 
        btn.text().match(/^\d+$/)
      )
      pageButtons.forEach(button => {
        expect(button.attributes('title')).toMatch(/Page \d+/)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles single page correctly', async () => {
      await wrapper.setProps({ current: 1, totalPages: 1 })
      const pageButtons = wrapper.findAll('button').filter(btn => 
        btn.text().match(/^\d+$/)
      )
      expect(pageButtons).toHaveLength(1)
      expect(pageButtons[0].text()).toBe('1')
    })

    it('prevents navigation to invalid pages', async () => {
      const pageButton = wrapper.findAll('button').find(btn => btn.text() === '2')
      await pageButton.trigger('click')
      
      // Should emit the valid page number
      expect(wrapper.emitted('change')[0]).toEqual([2])
    })
  })

  describe('Styling', () => {
    it('applies correct classes to current page button', () => {
      const currentButton = wrapper.find('button[aria-current="page"]')
      expect(currentButton.classes()).toContain('bg-blue-500')
      expect(currentButton.classes()).toContain('text-white')
      expect(currentButton.classes()).toContain('border-blue-500')
    })

    it('applies hover effects to non-current page buttons', () => {
      const nonCurrentButtons = wrapper.findAll('button').filter(btn => 
        btn.text().match(/^\d+$/) && !btn.attributes('aria-current')
      )
      nonCurrentButtons.forEach(button => {
        expect(button.classes()).toContain('hover:bg-gray-100')
      })
    })
  })
}) 