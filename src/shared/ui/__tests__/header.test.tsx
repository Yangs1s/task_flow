import { render, screen } from '../../../shared/lib/test-utils'
import { Header } from '../header'

describe('Header Component', () => {
  it('renders header with TaskFlow title', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { name: /taskflow/i })).toBeInTheDocument()
  })

  it('has correct heading level', () => {
    render(<Header />)
    const heading = screen.getByRole('heading', { name: /taskflow/i })
    expect(heading.tagName).toBe('H1')
  })

  it('applies correct CSS classes', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('px-4', 'py-2')
    
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('text-2xl', 'font-bold')
  })
}
)