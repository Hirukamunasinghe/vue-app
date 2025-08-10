import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import UserPopup from '../UserPopup.vue'
import { createMockUser, createMockProps } from '../../test/utils'

describe('UserPopup', () => {
  const mockUser = createMockUser(1)

  it('renders when show prop is true', () => {
    const props = createMockProps({ show: true, userId: 1, postId: 5 })
    render(UserPopup, { props })
    
    expect(screen.getByText('User Information (ID: 1)')).toBeInTheDocument()
  })

  it('does not render when show prop is false', () => {
    const props = createMockProps({ show: false, userId: 1, postId: 5 })
    const { container } = render(UserPopup, { props })
    
    // Check if the main content is not rendered
    expect(screen.queryByText('User Information (ID: 1)')).not.toBeInTheDocument()
  })

  it('displays correct user ID in title', () => {
    const props = createMockProps({ show: true, userId: 3, postId: 5 })
    render(UserPopup, { props })
    
    expect(screen.getByText('User Information (ID: 3)')).toBeInTheDocument()
  })

  it('displays correct post ID in subtitle', () => {
    const props = createMockProps({ show: true, userId: 1, postId: 7 })
    render(UserPopup, { props })
    
    expect(screen.getByText('Author of Post ID: 7')).toBeInTheDocument()
  })

  it('displays loading state correctly', () => {
    const props = createMockProps({ show: true, loading: true, userId: 1, postId: 5 })
    render(UserPopup, { props })
    
    expect(screen.getByText('Loading user...')).toBeInTheDocument()
    // Find the spinner element by looking for the animate-spin class
    const spinner = screen.getByText('Loading user...').closest('div').querySelector('.animate-spin')
    expect(spinner).toHaveClass('animate-spin')
  })

  it('displays user information when not loading and user exists', () => {
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 1, 
      postId: 5, 
      user: mockUser 
    })
    render(UserPopup, { props })
    
    // Personal Information
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user1@example.com')).toBeInTheDocument()
    expect(screen.getByText('123-456-7890')).toBeInTheDocument()
    expect(screen.getByText('user1.com')).toBeInTheDocument()
    
    // Address
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('Test Street, Test Suite')).toBeInTheDocument()
    expect(screen.getByText('Test City, 12345')).toBeInTheDocument()
    expect(screen.getByText('Lat: 0, Lng: 0')).toBeInTheDocument()
    
    // Company
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Test Company')).toBeInTheDocument()
    expect(screen.getByText('Test catch phrase')).toBeInTheDocument()
    expect(screen.getByText('Test bs')).toBeInTheDocument()
  })

  it('displays "User not found" when user is null', () => {
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 1, 
      postId: 5, 
      user: null 
    })
    render(UserPopup, { props })
    
    expect(screen.getByText('User not found')).toBeInTheDocument()
  })

  it('emits close event when close button is clicked', async () => {
    const props = createMockProps({ show: true, userId: 1, postId: 5 })
    const { emitted } = render(UserPopup, { props })
    
    const closeButton = screen.getByLabelText('Close user popup')
    await fireEvent.click(closeButton)
    
    expect(emitted().close).toBeTruthy()
  })

  it('handles different user data correctly', () => {
    const differentUser = {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      website: 'jane.com',
      company: {
        name: 'Different Company',
        catchPhrase: 'Different phrase',
        bs: 'Different business'
      },
      address: {
        street: 'Different Street',
        suite: 'Different Suite',
        city: 'Different City',
        zipcode: '54321',
        geo: {
          lat: '1',
          lng: '1'
        }
      }
    }
    
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 2, 
      postId: 8, 
      user: differentUser 
    })
    render(UserPopup, { props })
    
    expect(screen.getByText('User Information (ID: 2)')).toBeInTheDocument()
    expect(screen.getByText('Author of Post ID: 8')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('janesmith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('098-765-4321')).toBeInTheDocument()
    expect(screen.getByText('jane.com')).toBeInTheDocument()
    
    expect(screen.getByText('Different Street, Different Suite')).toBeInTheDocument()
    expect(screen.getByText('Different City, 54321')).toBeInTheDocument()
    expect(screen.getByText('Lat: 1, Lng: 1')).toBeInTheDocument()
    
    expect(screen.getByText('Different Company')).toBeInTheDocument()
    expect(screen.getByText('Different phrase')).toBeInTheDocument()
    expect(screen.getByText('Different business')).toBeInTheDocument()
  })

  it('has correct CSS classes for styling', () => {
    const props = createMockProps({ show: true, userId: 1, postId: 5 })
    render(UserPopup, { props })
    
    const container = screen.getByText('User Information (ID: 1)').closest('.fixed')
    expect(container).toHaveClass('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-50', 'p-4')
    
    const popup = screen.getByText('User Information (ID: 1)').closest('.bg-white')
    expect(popup).toHaveClass('bg-white', 'rounded-2xl', 'max-w-3xl', 'w-full', 'shadow-2xl')
  })

  it('handles click events correctly', async () => {
    const props = createMockProps({ show: true, userId: 1, postId: 5 })
    render(UserPopup, { props })
    
    const popup = screen.getByText('User Information (ID: 1)').closest('.bg-white')
    
    // Click on popup should not close it (due to @click.stop)
    await fireEvent.click(popup)
    
    // Popup should still be visible
    expect(screen.getByText('User Information (ID: 1)')).toBeInTheDocument()
  })

  it('displays user information in correct grid layout', () => {
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 1, 
      postId: 5, 
      user: mockUser 
    })
    render(UserPopup, { props })
    
    // Check if grid layout is applied
    const gridContainer = screen.getByText('Personal Information').closest('.grid')
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6')
  })

  it('handles missing user properties gracefully', () => {
    const incompleteUser = {
      id: 3,
      name: 'Incomplete User',
      username: 'incomplete',
      email: 'incomplete@example.com',
      phone: '123-456-7890',
      website: 'incomplete.com',
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
    
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 3, 
      postId: 10, 
      user: incompleteUser 
    })
    
    render(UserPopup, { props })
    
    // Should display the user information
    expect(screen.getByText('Incomplete User')).toBeInTheDocument()
  })

  it('displays loading spinner with correct styling', () => {
    const props = createMockProps({ show: true, loading: true, userId: 1, postId: 5 })
    render(UserPopup, { props })
    
    const spinner = screen.getByText('Loading user...').closest('div').querySelector('.animate-spin')
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-500', 'mx-auto')
  })

  it('shows correct number of sections when user data is complete', () => {
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 1, 
      postId: 5, 
      user: mockUser 
    })
    render(UserPopup, { props })
    
    // Should show 3 main sections
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
  })

  it('handles zero/null values in user data', () => {
    const userWithZeros = {
      ...mockUser,
      address: {
        ...mockUser.address,
        geo: {
          lat: '0',
          lng: '0'
        }
      }
    }
    
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 1, 
      postId: 5, 
      user: userWithZeros 
    })
    render(UserPopup, { props })
    
    expect(screen.getByText('Lat: 0, Lng: 0')).toBeInTheDocument()
  })
}) 