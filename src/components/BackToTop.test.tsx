import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BackToTop } from '../components/BackToTop'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock scroll methods
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true,
})

describe('BackToTop component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset pageYOffset
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    })
  })

  it('should not be visible when page offset is less than 300', () => {
    Object.defineProperty(window, 'pageYOffset', {
      value: 200,
      writable: true,
    })

    render(<BackToTop />)
    
    // Component should not be in the document initially
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should become visible when scrolled past 300px', () => {
    render(<BackToTop />)
    
    // Simulate scroll past 300px
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    })
    
    fireEvent.scroll(window)
    
    // Component should now be visible
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should call scrollTo when clicked', () => {
    render(<BackToTop />)
    
    // Make component visible
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true,
    })
    
    fireEvent.scroll(window)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('should clean up scroll event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = render(<BackToTop />)
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    )
    
    removeEventListenerSpy.mockRestore()
  })
})