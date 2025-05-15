import userReducer, {
  getUserDetailsId,
  updateUserDetails,
} from './userSlice';

interface User {
  id: number | string;
  email: string;
  location: string;
  phone_number: string;
  full_name: string;
  sex: string;
  preferred_event_types: string[];
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  user: {
    id: 0,
    full_name: '',
    email: '',
    phone_number: '',
    sex: '',
    location: '',
    preferred_event_types: [],
  },
};

const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  full_name: 'John Doe',
  phone_number: '1234567890',
  sex: 'Male',
  location: 'City',
  preferred_event_types: ['Music', 'Tech'],
};

describe('userSlice reducer', () => {
  it('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getUserDetailsId', () => {
    it('should set loading true on pending', () => {
      const state = userReducer(initialState, {
        type: getUserDetailsId.pending.type,
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should store user data on fulfilled', () => {
      const state = userReducer(initialState, {
        type: getUserDetailsId.fulfilled.type,
        payload: mockUser,
      });
      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
    });

    it('should set error on rejected', () => {
      const state = userReducer(initialState, {
        type: getUserDetailsId.rejected.type,
        payload: 'Fetch failed',
      });
      expect(state.error).toBe('Fetch failed');
      expect(state.loading).toBe(false);
    });
  });

  describe('updateUserDetails', () => {
    it('should set loading true on pending', () => {
      const state = userReducer(initialState, {
        type: updateUserDetails.pending.type,
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update user data on fulfilled', () => {
      const state = userReducer(initialState, {
        type: updateUserDetails.fulfilled.type,
        payload: { ...mockUser, full_name: 'Updated Name' },
      });
      expect(state.user?.full_name).toBe('Updated Name');
      expect(state.loading).toBe(false);
    });

    it('should not mutate state on unknown action', () => {
      const state = userReducer(initialState, {
        type: 'userDetails/unknownAction',
      });
      expect(state).toEqual(initialState);
    });
  });
});
