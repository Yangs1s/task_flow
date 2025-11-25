import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('should handle empty input', () => {
    expect(cn()).toBe('')
  })

  it('should handle object syntax', () => {
    expect(cn({
      'active': true,
      'inactive': false,
      'base': true
    })).toContain('active')
    expect(cn({
      'active': true,
      'inactive': false,
      'base': true
    })).toContain('base')
    expect(cn({
      'active': true,
      'inactive': false,
      'base': true
    })).not.toContain('inactive')
  })
}
