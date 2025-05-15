import calendarReducer, {
  fetchEvents,
  getRecomendedEventsId,
  addEvent,
  updateEvent,
  deleteEvent
} from './calendarSlice';
import type { CalendarState } from './calendarSlice';
import type { Event } from '@/types/Event';

describe('calendarSlice', () => {
  const initialState: CalendarState = {
    events: [],
    recomendedEvents: [],
    error: null,
    loading: false,
  };

  const sampleEvent: Event = {
    id: '1',
    title: 'Test Event',
    date: '2025-05-01',
    location: 'Online',
    description: 'A test event',
    type: 'Tech',
  };

  it('should return the initial state', () => {
    expect(calendarReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchEvents', () => {
    it('sets loading true on pending', () => {
      const state = calendarReducer(initialState, { type: fetchEvents.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('stores events on fulfilled', () => {
      const state = calendarReducer(initialState, {
        type: fetchEvents.fulfilled.type,
        payload: [sampleEvent],
      });
      expect(state.events).toEqual([sampleEvent]);
      expect(state.loading).toBe(false);
    });

    it('sets error on rejected', () => {
      const state = calendarReducer(initialState, {
        type: fetchEvents.rejected.type,
        payload: 'Fetch failed',
      });
      expect(state.error).toBe('Fetch failed');
      expect(state.loading).toBe(false);
    });
  });

  describe('getRecomendedEventsId', () => {
    it('sets loading on pending', () => {
      const state = calendarReducer(initialState, {
        type: getRecomendedEventsId.pending.type,
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('sets recommended event IDs on fulfilled', () => {
      const state = calendarReducer(initialState, {
        type: getRecomendedEventsId.fulfilled.type,
        payload: [101, 202],
      });
      expect(state.recomendedEvents).toEqual([101, 202]);
      expect(state.loading).toBe(false);
    });

    it('sets error on rejected', () => {
      const state = calendarReducer(initialState, {
        type: getRecomendedEventsId.rejected.type,
        payload: 'Recommendation error',
      });
      expect(state.error).toBe('Recommendation error');
      expect(state.loading).toBe(false);
    });
  });

  describe('addEvent', () => {
    it('adds a new event to state on fulfilled', () => {
      const state = calendarReducer(initialState, {
        type: addEvent.fulfilled.type,
        payload: sampleEvent,
      });
      expect(state.events).toContainEqual(sampleEvent);
    });
  });

  describe('updateEvent', () => {
    const modifiedEvent = { ...sampleEvent, title: 'Updated Title' };

    const existingState: CalendarState = {
      ...initialState,
      events: [sampleEvent],
    };

    it('updates existing event in state', () => {
      const state = calendarReducer(existingState, {
        type: updateEvent.fulfilled.type,
        payload: modifiedEvent,
      });
      expect(state.events[0].title).toBe('Updated Title');
    });

    it('does nothing if event not found', () => {
      const state = calendarReducer(existingState, {
        type: updateEvent.fulfilled.type,
        payload: { ...sampleEvent, id: '999' },
      });
      expect(state.events.length).toBe(1);
    });
  });

  describe('deleteEvent', () => {
    const existingState: CalendarState = {
      ...initialState,
      events: [sampleEvent],
    };

    it('removes event from state on fulfilled', () => {
      const state = calendarReducer(existingState, {
        type: deleteEvent.fulfilled.type,
        payload: '1',
      });
      expect(state.events).toHaveLength(0);
    });
  });

  describe('rejected matcher fallback', () => {
    it('sets error from any rejected action', () => {
      const state = calendarReducer(initialState, {
        type: 'anyAction/rejected',
        payload: 'Some error',
      });
      expect(state.error).toBe('Some error');
    });
  });
});
