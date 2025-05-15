import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../api/authInterceptorRequest";

interface User {
	userId: string | null;
	fullname: string | null;
	role: string | null;
	eventIds: string[];
}

export interface RegistrationUser {
	email: string;
	password: string;
	fullname: string;
	prefferedTypes: string[] | null;
}

export interface AuthState {
	user: User | null;
	error: string | null;
	loading: boolean;
	token: string | null;
	eventTypes: string[] | null
}

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

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const response = await authApi.post("/auth/login", { email, password });
			const { session_token, user } = response.data;
			return {
				userId: user.id,
				fullname: user.fullname,
				role: user.role.toUpperCase(),
				eventIds: user.eventIds,
				token: session_token,
			};
		} catch (error) {
			return rejectWithValue("Invalid email or password");
		}
	}
  
);
export const getEventsTypes = createAsyncThunk(
	"auth/getEventsTypes",
	async (_, { rejectWithValue }) => {
		try {
			const response = await authApi.get("/events/event_types");

			return response.data.event_types;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Failed to fetch event types");
		}
	}
);
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
	try {
		await authApi.post("/auth/logout");

	} catch (error) {
		return rejectWithValue("Logout failed");
	}
});

export const registrationUser = createAsyncThunk(
	"auth/registrationUser",
	async ({ email, password, fullname, prefferedTypes }: RegistrationUser, { rejectWithValue }) => {
		try {
			await authApi.post("/auth/registration", { email, password, fullname, prefferedTypes });
		} catch (error: any) {
			console.error("Registration error:", error);
			console.error("Registration error:", error.response?.data?.error);
			return rejectWithValue(error.response?.data?.error || "Registration failed");
		}
	}
);

export const subscribeToEvent = createAsyncThunk(
	"auth/subscribeToEvent",
	async ({ eventId }: { eventId: string }, { getState, rejectWithValue }) => {
		const state = getState() as { auth: AuthState };
		if (state.auth.user) {
			const userId = state.auth.user.userId;
			try {
				await authApi.post(`/events/${eventId}/subscribe`, { user_id: userId });
				return eventId;
			} catch (error) {
				return rejectWithValue("Subscription failed");
			}
		}
	}
);

export const unsubscribeFromEvent = createAsyncThunk(
	"auth/unsubscribeFromEvent",
	async ({ eventId }: { eventId: string }, { getState, rejectWithValue }) => {
		const state = getState() as { auth: AuthState };
		if (state.auth.user) {
			const userId = state.auth.user.userId;
			try {
				await authApi.post(`/events/${eventId}/unsubscribe`, { user_id: userId });
				return eventId;
			} catch (error) {
				return rejectWithValue("Unsubscription failed");
			}
		}
	}
);


const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {

	},
	extraReducers: (builder) => {
		builder
			.addCase(getEventsTypes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getEventsTypes.fulfilled, (state, action) => {
				state.eventTypes = action.payload;
				state.loading = false;
			})
			.addCase(getEventsTypes.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})

			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.user = {
					userId: action.payload.userId,
					fullname: action.payload.fullname,
					role: action.payload.role,
					eventIds: action.payload.eventIds,
				};
				state.token = action.payload.token;
				state.loading = false; 
			})
			.addCase(login.rejected, (state, action) => {
				state.error = action.payload as string; 
				state.loading = false; 
			})
			.addCase(logout.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = initialState.user;
				state.token = null;
				state.loading = false;
			})
			.addCase(logout.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			.addCase(registrationUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registrationUser.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(registrationUser.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			.addCase(subscribeToEvent.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(subscribeToEvent.fulfilled, (state, action) => {
				if (state.user) {
					state.user.eventIds.push(action.payload as string);
				}
				state.loading = false;
			})
			.addCase(subscribeToEvent.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			})
			.addCase(unsubscribeFromEvent.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(unsubscribeFromEvent.fulfilled, (state, action) => {
				if (state.user) {
					state.user.eventIds = state.user.eventIds.filter((id) => id !== action.payload);
				}
				state.loading = false;
			})
			.addCase(unsubscribeFromEvent.rejected, (state, action) => {
				state.error = action.payload as string;
				state.loading = false;
			});
	},
});

export default authSlice.reducer;
