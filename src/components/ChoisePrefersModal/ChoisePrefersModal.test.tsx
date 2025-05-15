import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChoicePrefersModal from './index';

describe('ChoicePrefersModal', () => {
  const defaultProps = {
    selectedTypes: ['music'],
    allTypesEvents: ['music', 'sports', 'theatre'],
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  const renderModal = (props = {}) => {
    return render(<ChoicePrefersModal {...defaultProps} {...props} />);
  };

  it('renders the title and all type options with proper casing', () => {
    renderModal();
    expect(screen.getByText('Choose Your Preference')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Theatre')).toBeInTheDocument();
  });

  it('displays a fallback message if allTypesEvents is empty', () => {
    renderModal({ allTypesEvents: [] });
    expect(screen.getByText('No types available to select.')).toBeInTheDocument();
  });

  it('toggles selection state when type is clicked', () => {
    renderModal();
    const musicItem = screen.getByText('Music');
    const sportsItem = screen.getByText('Sports');

    expect(musicItem.className).toContain('type-item-active');
    expect(sportsItem.className).toContain('type-item-unactive');

    fireEvent.click(sportsItem);
    expect(sportsItem.className).toContain('type-item-active');

    fireEvent.click(musicItem);
    expect(musicItem.className).toContain('type-item-unactive');
  });

  it('calls onConfirm with selected types when Confirm is clicked', () => {
    const onConfirm = vi.fn();
    renderModal({ onConfirm });

    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledWith(['music']);
  });

  it('calls onClose when clicking Cancel button', () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside the modal content', () => {
    const onClose = vi.fn();
    const { container } = renderModal({ onClose });

    fireEvent.click(container.querySelector('.modal-overlay')!);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not close when clicking inside the modal content', () => {
    const onClose = vi.fn();
    const { container } = renderModal({ onClose });

    fireEvent.click(container.querySelector('.modal-content')!);
    expect(onClose).not.toHaveBeenCalled();
  });
});
