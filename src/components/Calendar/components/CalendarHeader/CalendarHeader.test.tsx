import { render, screen, fireEvent } from '@testing-library/react';
import CalendarHeader from './index';
import { describe, it, expect, vi } from 'vitest';
import { addMonths, subMonths } from 'date-fns';

describe('CalendarHeader', () => {
const currentDate = new Date(2025, 4, 13); 

it('renders current date in "MMMM yyyy" format', () => {
render(<CalendarHeader currentDate={currentDate} setCurrentDate={() => {}} />);
expect(screen.getByText('May 2025')).toBeInTheDocument();
});

it('calls setCurrentDate with previous month on left arrow click', () => {
const mockSetCurrentDate = vi.fn();
render(<CalendarHeader currentDate={currentDate} setCurrentDate={mockSetCurrentDate} />);
fireEvent.click(screen.getByText('<'));
expect(mockSetCurrentDate).toHaveBeenCalledWith(subMonths(currentDate, 1));
});

it('calls setCurrentDate with next month on right arrow click', () => {
const mockSetCurrentDate = vi.fn();
render(<CalendarHeader currentDate={currentDate} setCurrentDate={mockSetCurrentDate} />);
fireEvent.click(screen.getByText('>'));
expect(mockSetCurrentDate).toHaveBeenCalledWith(addMonths(currentDate, 1));
});
});