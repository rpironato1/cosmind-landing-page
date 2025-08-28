import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('should handle conditional classes', () => {
    const condition1 = true
    const condition2 = false
    expect(cn('base-class', condition1 && 'conditional-class')).toBe(
      'base-class conditional-class'
    )
    expect(cn('base-class', condition2 && 'conditional-class')).toBe(
      'base-class'
    )
  })

  it('should handle tailwind merge conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra')
  })
})
