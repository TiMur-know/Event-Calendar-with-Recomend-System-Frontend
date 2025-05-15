import authReducer, {
  login,
  logout,
  getEventsTypes,
  registrationUser,
  subscribeToEvent,
  unsubscribeFromEvent,
  type AuthState,
} from './authSlice';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: {
      userId: null,
      fullname: null,
      role: null,
      eventIds: [],
    },
    eventTypes: null,
    error: null,
    loading: false,
    token: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('login', () => {
    it('should set loading true on login.pending', () => {
      const state = authReducer(initialState, { type: login.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should store user data on login.fulfilled', () => {
      const payload = {
        userId: '1',
        fullname: 'John Doe',
        role: 'ADMIN',
        eventIds: ['a', 'b'],
        token: 'abc123',
      };
      const state = authReducer(initialState, {
        type: login.fulfilled.type,
        payload,
      });

      expect(state.user).toEqual({
        userId: '1',
        fullname: 'John Doe',
        role: 'ADMIN',
        eventIds: ['a', 'b'],
      });
      expect(state.token).toBe('abc123');
      expect(state.loading).toBe(false);
    });

    it('should handle login.rejected', () => {
      const state = authReducer(initialState, {
        type: login.rejected.type,
        payload: 'Invalid email or password',
      });
      expect(state.error).toBe('Invalid email or password');
      expect(state.loading).toBe(false);
    });
  });

  describe('logout', () => {
    const loggedInState: AuthState = {
      ...initialState,
      user: {
        userId: '1',
        fullname: 'Test',
        role: 'USER',
        eventIds: ['x'],
      },
      token: 'token',
    };

    it('resets user and token on logout.fulfilled', () => {
      const state = authReducer(loggedInState, {
        type: logout.fulfilled.type,
      });

      expect(state.user).toEqual(initialState.user);
      expect(state.token).toBe(null);
      expect(state.loading).toBe(false);
    });

    it('sets error on logout.rejected', () => {
      const state = authReducer(loggedInState, {
        type: logout.rejected.type,
        payload: 'Logout failed',
      });

      expect(state.error).toBe('Logout failed');
    });
  });

  describe('getEventsTypes', () => {
    it('stores event types on fulfilled', () => {
      const state = authReducer(initialState, {
        type: getEventsTypes.fulfilled.type,
        payload: ['Music', 'Tech'],
      });

      expect(state.eventTypes).toEqual(['Music', 'Tech']);
      expect(state.loading).toBe(false);
    });

    it('sets error on rejected', () => {
      const state = authReducer(initialState, {
        type: getEventsTypes.rejected.type,
        payload: 'Failed to fetch',
      });

      expect(state.error).toBe('Failed to fetch');
      expect(state.loading).toBe(false);
    });
  });

  describe('registrationUser', () => {
    it('clears loading on fulfilled', () => {
      const state = authReducer({ ...initialState, loading: true }, {
        type: registrationUser.fulfilled.type,
      });

      expect(state.loading).toBe(false);
    });

    it('sets error on rejected', () => {
      const state = authReducer(initialState, {
        type: registrationUser.rejected.type,
        payload: 'Email already in use',
      });

      expect(state.error).toBe('Email already in use');
    });
  });

  describe('subscribeToEvent', () => {
    const userState: AuthState = {
      ...initialState,
      user: {
        userId: '1',
        fullname: 'Jane',
        role: 'USER',
        eventIds: [],
      },
    };

    it('adds event ID to user.eventIds on fulfilled', () => {
      const state = authReducer(userState, {
        type: subscribeToEvent.fulfilled.type,
        payload: 'event123',
      });

      expect(state.user?.eventIds).toContain('event123');
    });

    it('sets error on rejected', () => {
      const state = authReducer(userState, {
        type: subscribeToEvent.rejected.type,
        payload: 'Subscription failed',
      });

      expect(state.error).toBe('Subscription failed');
    });
  });

  describe('unsubscribeFromEvent', () => {
    const userState: AuthState = {
      ...initialState,
      user: {
        userId: '1',
        fullname: 'Jane',
        role: 'USER',
        eventIds: ['event123', 'event456'],
      },
    };

    it('removes event ID from user.eventIds on fulfilled', () => {
      const state = authReducer(userState, {
        type: unsubscribeFromEvent.fulfilled.type,
        payload: 'event123',
      });

      expect(state.user?.eventIds).not.toContain('event123');
    });

    it('sets error on rejected', () => {
      const state = authReducer(userState, {
        type: unsubscribeFromEvent.rejected.type,
        payload: 'Unsubscription failed',
      });

      expect(state.error).toBe('Unsubscription failed');
    });
  });
});
