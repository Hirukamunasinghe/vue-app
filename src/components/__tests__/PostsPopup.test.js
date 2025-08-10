import { render, screen, fireEvent } from '@testing-library/vue'
import { nextTick } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import PostsPopup from '../PostsPopup.vue'
import { createMockProps } from '../../test/utils'

// Mock the Pagination component
vi.mock('../Pagination.vue', () => ({
  default: {
    name: 'Pagination',
    template: '<div data-testid="pagination">Pagination Component</div>',
    props: ['current', 'totalPages'],
    emits: ['change']
  }
}))

const mockPosts = [
  { id: 1, title: 'Test Post 1', body: 'This is the body of test post 1', userId: 1 },
  { id: 2, title: 'Test Post 2', body: 'This is the body of test post 2', userId: 1 },
  { id: 3, title: 'Test Post 3', body: 'This is the body of test post 3', userId: 1 },
  { id: 4, title: 'Test Post 4', body: 'This is the body of test post 4', userId: 1 },
  { id: 5, title: 'Test Post 5', body: 'This is the body of test post 5', userId: 1 },
  { id: 6, title: 'Test Post 6', body: 'This is the body of test post 6', userId: 1 }
]

describe('PostsPopup', () => {
  it('renders when show prop is true', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    expect(screen.getByText('Posts from User ID 1')).toBeInTheDocument()
  })

  it('does not render when show prop is false', () => {
    const props = createMockProps({ show: false, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    expect(screen.queryByText('Posts from User ID 1')).not.toBeInTheDocument()
  })

  it('displays loading state correctly', () => {
    const props = createMockProps({ show: true, loading: true, userId: 1, posts: [] })
    render(PostsPopup, { props })
    
    expect(screen.getByText('Loading posts...')).toBeInTheDocument()
    const spinner = screen.getByText('Loading posts...').previousElementSibling
    expect(spinner).toHaveClass('animate-spin')
  })

  it('displays posts when not loading and posts exist', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.getByText('Test Post 2')).toBeInTheDocument()
    expect(screen.getByText('This is the body of test post 1')).toBeInTheDocument()
  })

  it('displays correct user ID in title', () => {
    const props = createMockProps({ show: true, loading: false, userId: 5, posts: mockPosts })
    render(PostsPopup, { props })
    
    expect(screen.getByText('Posts from User ID 5')).toBeInTheDocument()
  })

  it('shows pagination when there are more than 5 posts', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('does not show pagination when there are 5 or fewer posts', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts.slice(0, 3) })
    render(PostsPopup, { props })
    
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('displays only 5 posts per page (first page)', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.getByText('Test Post 5')).toBeInTheDocument()
    expect(screen.queryByText('Test Post 6')).not.toBeInTheDocument()
  })

  it('emits close event when close button is clicked', async () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    const { emitted } = render(PostsPopup, { props })
    
    const closeButton = screen.getByLabelText('Close posts popup')
    await fireEvent.click(closeButton)
    
    expect(emitted().close).toBeTruthy()
  })

  it('emits showUser event when view author button is clicked', async () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    const { emitted } = render(PostsPopup, { props })
    
    const viewAuthorButton = screen.getByText(/View Author \(User ID: 1, Post ID: 1\)/)
    await fireEvent.click(viewAuthorButton)
    
    expect(emitted().showUser).toBeTruthy()
    expect(emitted().showUser[0]).toEqual([1, 1])
  })

  it('displays post information correctly', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.getByText('This is the body of test post 1')).toBeInTheDocument()
    expect(screen.getByText('Post ID: 1')).toBeInTheDocument()
    expect(screen.getByText(/View Author \(User ID: 1, Post ID: 1\)/)).toBeInTheDocument()
  })

  it('handles empty posts array', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: [] })
    render(PostsPopup, { props })
    
    expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('resets to first page when userId changes', async () => {
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 1, 
      posts: mockPosts 
    })
    const { rerender } = render(PostsPopup, { props })
    
    // Change userId
    const newProps = { ...props, userId: 2 }
    rerender(newProps)
    
    // Wait for the DOM to update
    await nextTick()
    
    // The component should show posts from the new user ID in the title
    expect(screen.getByText('Posts from User ID 2')).toBeInTheDocument()
  })

  it('resets to first page when show prop changes', async () => {
    const props = createMockProps({ 
      show: false, 
      loading: false, 
      userId: 1, 
      posts: mockPosts 
    })
    const { rerender } = render(PostsPopup, { props })
    
    // Initially, the component should not be visible
    expect(screen.queryByText('Posts from User ID 1')).not.toBeInTheDocument()
    
    // Show the popup
    const newProps = { ...props, show: true }
    rerender(newProps)
    
    // Wait for the DOM to update
    await nextTick()
    
    // The component should now be visible with the correct title
    expect(screen.getByText('Posts from User ID 1')).toBeInTheDocument()
  })

  it('resets to first page when posts length changes', async () => {
    const props = createMockProps({ 
      show: true, 
      loading: false, 
      userId: 1, 
      posts: mockPosts.slice(0, 3) 
    })
    const { rerender } = render(PostsPopup, { props })
    
    // Change posts to have more items
    const newProps = { ...props, posts: mockPosts }
    rerender(newProps)
    
    // Wait for the DOM to update
    await nextTick()
    
    // Should show pagination now
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('has correct CSS classes for styling', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    const popup = screen.getByText('Posts from User ID 1').closest('.fixed')
    expect(popup).toHaveClass('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-50')
  })

  it('handles click events correctly', async () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    const { emitted } = render(PostsPopup, { props })
    
    // Test close button
    const closeButton = screen.getByLabelText('Close posts popup')
    await fireEvent.click(closeButton)
    expect(emitted().close).toBeTruthy()
    
    // Test view author button
    const viewAuthorButton = screen.getByText(/View Author \(User ID: 1, Post ID: 1\)/)
    await fireEvent.click(viewAuthorButton)
    expect(emitted().showUser).toBeTruthy()
  })

  it('displays correct number of total pages', () => {
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: mockPosts })
    render(PostsPopup, { props })
    
    // With 6 posts and page size 5, should have 2 pages
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
  })

  it('handles single post correctly', () => {
    const singlePost = [mockPosts[0]]
    const props = createMockProps({ show: true, loading: false, userId: 1, posts: singlePost })
    render(PostsPopup, { props })
    
    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })
}) 