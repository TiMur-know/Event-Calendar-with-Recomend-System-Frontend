
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModalToLogin from '../ModalToLogin'
import { vi } from 'vitest'

const mockNavigate = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('ModalToLogin', () => {
  it('renders modal content', () => {
    render(<ModalToLogin onClose={() => {}} />)
    expect(screen.getByText('Login Required')).toBeInTheDocument()
    expect(screen.getByText(/need to login/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('calls onClose when clicking on overlay', async () => {
    const onClose = vi.fn()
    render(<ModalToLogin onClose={onClose} />)
    await userEvent.click(screen.getByText('Login Required').parentElement!.parentElement!)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking close button', async () => {
    const onClose = vi.fn()
    render(<ModalToLogin onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('navigates to /login when clicking Login', async () => {
    render(<ModalToLogin onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
