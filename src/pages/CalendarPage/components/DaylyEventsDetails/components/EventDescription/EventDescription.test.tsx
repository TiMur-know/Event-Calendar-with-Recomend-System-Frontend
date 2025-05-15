import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import EventDescription from '../EventDescription';
import { vi } from 'vitest';
import Event from '@/types/Event';

const mockEvent:Event = {
  id: '1',
  title: 'Test Event',
  description: 'This is a test event.',
  type: 'Workshop',
  popularity: "Medium",
  popularityCount: 20,
  location: 'Online',
  duration: 2,
  date: new Date(),
};

describe('EventDescription', () => {
  const commonProps = {
    event: mockEvent,
    onEdit: vi.fn(),
    onRemove: vi.fn(),
    onSub: vi.fn(),
    onUnsub: vi.fn(),
  };

  it('renders event information', () => {
    render(
      <EventDescription
        {...commonProps}
        role="USER"
        eventsIds={[]}
        isRecomended={false}
      />
    );

    expect(screen.getByTestId('event-title')).toHaveTextContent(mockEvent.title);
    expect(screen.getByTestId('event-description')).toHaveTextContent(mockEvent.description);
    expect(screen.getByTestId('event-type')).toHaveTextContent(`Type: ${mockEvent.type}`);
    expect(screen.getByTestId('event-popularity')).toHaveTextContent(`Popularity: ${mockEvent.popularity} (${mockEvent.popularityCount} people)`);
    expect(screen.getByTestId('event-location')).toHaveTextContent(`Location: ${mockEvent.location}`);
    expect(screen.getByTestId('event-duration')).toHaveTextContent(`Duration: ${mockEvent.duration} hours`);
  });

  it('renders subscribe button for non-admin not subscribed users', () => {
    render(
      <EventDescription
        {...commonProps}
        role="USER"
        eventsIds={[]}
        isRecomended={false}
      />
    );

    expect(screen.getByTestId('subscribe-button')).toBeInTheDocument();
  });

  it('renders unsubscribe button for subscribed users', () => {
    render(
      <EventDescription
        {...commonProps}
        role="USER"
        eventsIds={['1']}
        isRecomended={false}
      />
    );

    expect(screen.getByTestId('unsubscribe-button')).toBeInTheDocument();
  });

  it('renders admin buttons', () => {
    render(
      <EventDescription
        {...commonProps}
        role="ADMIN"
        eventsIds={[]}
        isRecomended={false}
      />
    );

    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('remove-button')).toBeInTheDocument();
  });

  it('calls onEdit and onRemove for admin', async () => {
    render(
      <EventDescription
        {...commonProps}
        role="ADMIN"
        eventsIds={[]}
        isRecomended={false}
      />
    );

    await userEvent.click(screen.getByTestId('edit-button'));
    await userEvent.click(screen.getByTestId('remove-button'));
    expect(commonProps.onEdit).toHaveBeenCalledWith('1');
    expect(commonProps.onRemove).toHaveBeenCalledWith('1');
  });

  it('calls onSub when user subscribes', async () => {
    render(
      <EventDescription
        {...commonProps}
        role="USER"
        eventsIds={[]}
        isRecomended={true}
      />
    );

    await userEvent.click(screen.getByTestId('subscribe-button'));
    expect(commonProps.onSub).toHaveBeenCalledWith('1');
    expect(screen.getByTestId('recommended-event')).toBeInTheDocument();
  });

  it('calls onUnsub when user unsubscribes', async () => {
    render(
      <EventDescription
        {...commonProps}
        role="USER"
        eventsIds={['1']}
        isRecomended={false}
      />
    );

    await userEvent.click(screen.getByTestId('unsubscribe-button'));
    expect(commonProps.onUnsub).toHaveBeenCalledWith('1');
  });
});
