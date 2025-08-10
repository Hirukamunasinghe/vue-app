import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import Pagination from '../Pagination.vue'

describe('Pagination', () => {
  const defaultProps = {
    current: 1,
    totalPages: 5
  }

  it('renders pagination with correct number of pages', () => {
    render(Pagination, { props: defaultProps })
    
    // Check if all page numbers are displayed
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('highlights current page correctly', () => {
    render(Pagination, { props: { current: 3, totalPages: 5 } })
    
    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveClass('bg-blue-500', 'text-white')
  })

  it('emits change event when page button is clicked', async () => {
    const { emitted } = render(Pagination, { props: defaultProps })
    
    const page2Button = screen.getByText('2')
    await fireEvent.click(page2Button)
    
    expect(emitted().change).toBeTruthy()
    expect(emitted().change[0]).toEqual([2])
  })

  it('emits change event when previous button is clicked', async () => {
    const { emitted } = render(Pagination, { props: { current: 2, totalPages: 5 } })
    
    const prevButton = screen.getByLabelText('Previous page')
    await fireEvent.click(prevButton)
    
    expect(emitted().change).toBeTruthy()
    expect(emitted().change[0]).toEqual([1])
  })

  it('emits change event when next button is clicked', async () => {
    const { emitted } = render(Pagination, { props: { current: 2, totalPages: 5 } })
    
    const nextButton = screen.getByLabelText('Next page')
    await fireEvent.click(nextButton)
    
    expect(emitted().change).toBeTruthy()
    expect(emitted().change[0]).toEqual([3])
  })

  it('disables previous button on first page', () => {
    render(Pagination, { props: { current: 1, totalPages: 5 } })
    
    const prevButton = screen.getByLabelText('Previous page')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(Pagination, { props: { current: 5, totalPages: 5 } })
    
    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toBeDisabled()
  })

  it('handles single page correctly', () => {
    render(Pagination, { props: { current: 1, totalPages: 1 } })
    
    // Should only show page 1
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.queryByText('2')).not.toBeInTheDocument()
    
    // Both prev and next buttons should be disabled
    const prevButton = screen.getByLabelText('Previous page')
    const nextButton = screen.getByLabelText('Next page')
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  it('limits visible page buttons to 5 when total pages > 5', () => {
    render(Pagination, { props: { current: 1, totalPages: 10 } })
    
    // Should show pages 1-5
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    
    // Should not show page 6
    expect(screen.queryByText('6')).not.toBeInTheDocument()
  })

  it('shows correct page range when current page is in middle', () => {
    render(Pagination, { props: { current: 5, totalPages: 10 } })
    
    // Should show pages 3-7 (centered around current page 5)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('shows correct page range when current page is near end', () => {
    render(Pagination, { props: { current: 9, totalPages: 10 } })
    
    // Should show pages 6-10
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('prevents navigation to invalid pages', async () => {
    const { emitted } = render(Pagination, { props: { current: 1, totalPages: 5 } })
    
    // Try to go to page 0 (invalid)
    const prevButton = screen.getByLabelText('Previous page')
    await fireEvent.click(prevButton)
    
    // Should not emit change event for invalid page
    expect(emitted().change).toBeFalsy()
  })

  it('has correct accessibility attributes', () => {
    render(Pagination, { props: { current: 3, totalPages: 5 } })
    
    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
    
    const prevButton = screen.getByLabelText('Previous page')
    expect(prevButton).toHaveAttribute('aria-label', 'Previous page')
    
    const nextButton = screen.getByLabelText('Next page')
    expect(nextButton).toHaveAttribute('aria-label', 'Next page')
  })

  it('applies correct CSS classes for styling', () => {
    render(Pagination, { props: { current: 1, totalPages: 5 } })
    
    const container = screen.getByText('1').closest('div').parentElement
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'select-none', 'mt-4')
    
    const pageButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent.match(/^\d+$/)
    )
    
    pageButtons.forEach(button => {
      expect(button).toHaveClass('w-8', 'h-8', 'rounded-md', 'border', 'text-sm')
    })
  })
}) 