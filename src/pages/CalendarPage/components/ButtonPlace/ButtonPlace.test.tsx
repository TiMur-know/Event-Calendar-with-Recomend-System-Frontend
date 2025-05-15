
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonPlace from '../ButtonPlace';
import { vi } from 'vitest';

describe('ButtonPlace', () => {
  it('renders a button with text "Add Event"', () => {
    render(<ButtonPlace onCreate={() => {}} />);
    expect(screen.getByText('Add Event')).toBeInTheDocument();
  });

  it('calls onCreate when button is clicked', async () => {
    const handleCreate = vi.fn();
    render(<ButtonPlace onCreate={handleCreate} />);
    await userEvent.click(screen.getByText('Add Event'));
    expect(handleCreate).toHaveBeenCalledTimes(1);
  });
});
