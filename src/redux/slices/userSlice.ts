import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authApi from "../api/authInterceptorRequest";

interface User {
	id: number|string;
	email: string;
	location: string;
	phone_number: string;
	full_name: string;
	sex: string;
	preferred_event_types: string[];
}

interface UserState {
	user: User|null;
	loading: boolean;
	error: string | null;
}

const initialState: UserState = {
	loading: false,
	error: null,
	user:{
		id:0,
		full_name: '',
		email: '',
		phone_number: '',
		sex: '',
		location: '',
		preferred_event_types: [],
	}
};

export const getUserDetailsId = createAsyncThunk(
	'userDetails/getUserDetailsId',
	async (userId: string, { rejectWithValue }) => {
		try {
			const response = await authApi.get(`/users/${userId}`);
			const user_details = {
				id: response.data.id,
				email: response.data.email,
				full_name: response.data.full_name,
				phone_number: response.data.phone_number,
				sex: response.data.sex,
				location: response.data.location,
				preferred_event_types: response.data.preferred_event_types,
			}
			return user_details;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);
export const updateUserDetails = createAsyncThunk(
	'userDetails/updateUserDetails',
	async (user: User, { rejectWithValue }) => {
		try {
			const response = await authApi.put(`/users/${user.id}`, user);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
)
const userSlice = createSlice({
	name: 'userDetails',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
		.addCase(getUserDetailsId.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(getUserDetailsId.fulfilled, (state, action) => {

			state.user = action.payload;
			state.loading = false;
		}
	)
		.addCase(getUserDetailsId.rejected, (state, action) => {
			state.error = action.payload as string;
			state.loading = false;
		})
		.addCase(updateUserDetails.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
		.addCase(updateUserDetails.fulfilled, (state, action) => {
			state.user = action.payload;
			state.loading = false;
		})

	}
});

export default userSlice.reducer;
