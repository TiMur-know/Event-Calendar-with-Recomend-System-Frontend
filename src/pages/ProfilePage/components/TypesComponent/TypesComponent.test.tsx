import { describe, it, expect, vi } from 'vitest';
import { fireEvent,render, screen  } from '@testing-library/react';
import TypesComponent from './index';

// Mock the ChoicePrefersModal to simplify tests
vi.mock('@/components/ChoisePrefersModal', () => ({
  default: ({ selectedTypes, allTypesEvents, onClose, onConfirm }: any) => (
    <div data-testid="mock-modal">
      <div>Mock Modal</div>
      <button onClick={() => onConfirm(['mockType'])}>Confirm</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('TypesComponent', () => {
  const mockOnTypesChange = vi.fn();
  const mockOnClear = vi.fn();

  const defaultProps = {
    allTypes: ['music', 'sports', 'tech'],
    selectedTypes: ['music'],
    onTypesChange: mockOnTypesChange,
    onClear: mockOnClear,
    showChooseButton: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders selected types', () => {
    render(<TypesComponent {...defaultProps} />);
    expect(screen.getByText('Selected types')).toBeInTheDocument();
    expect(screen.getByText('music')).toBeInTheDocument();
  });

  it('opens modal on "Choose your types" button click', () => {
    render(<TypesComponent {...defaultProps} />);
    const chooseBtn = screen.getByText('Choose your types');
    fireEvent.click(chooseBtn);
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  it('calls onTypesChange with selected types and closes modal', () => {
    render(<TypesComponent {...defaultProps} />);
    fireEvent.click(screen.getByText('Choose your types'));
    fireEvent.click(screen.getByText('Confirm'));

    expect(mockOnTypesChange).toHaveBeenCalledWith(['mockType']);
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('calls onClear when "Clear" button is clicked', () => {
    render(<TypesComponent {...defaultProps} />);
    fireEvent.click(screen.getByText('Clear'));
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('does not render buttons when showChooseButton is false', () => {
    render(<TypesComponent {...defaultProps} showChooseButton={false} />);
    expect(screen.queryByText('Choose your types')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });
});
