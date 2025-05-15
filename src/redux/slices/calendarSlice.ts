import authApi from '@/redux/api/authInterceptorRequest';
import Event from '@/types/Event';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface CalendarState {
	events: Event[];
	recomendedEvents: number[]|[];
	error: string | null;
	loading: boolean;
}

const initialState: CalendarState = {
	events: [],
	recomendedEvents:[],
	error: null,
	loading: false
};

export const fetchEvents = createAsyncThunk('calendar/fetchEvents', async (_, { rejectWithValue }) => {
	try {
		const { data } = await axios.get("http://localhost:5000/api/v1/events");

		return data;
	} catch (error: any) {
		console.error('Error fetching events:', error); 
		return rejectWithValue(error.response?.data?.message || error.message);
	}
});
export const getRecomendedEventsId = createAsyncThunk('calendar/getRecomendedEvents',async (userId:number|string,{
	rejectWithValue
})=>{
	try{
		const {data}= await authApi.post('/events/recommend', {user_id:userId})

		return data.recommendations
	}
	catch(error:any){
		console.error('Error fetching events:',error)
		return rejectWithValue(error.response?.data?.message||error.message)
	}
})
export const addEvent = createAsyncThunk('calendar/addEvent', async (event: Event, { rejectWithValue }) => {
	try {
		const { data } = await authApi.post('/events', event);
		return data;
	} catch (error: any) {
		return rejectWithValue(error.response?.data?.message || error.message);
	}
});

export const updateEvent = createAsyncThunk('calendar/updateEvent', async (event: Event, { rejectWithValue }) => {
	try {
		const { data } = await authApi.put(`/events/${event.id}`, event);
		return data;
	} catch (error: any) {
		return rejectWithValue(error.response?.data?.message || error.message);
	}
});

export const deleteEvent = createAsyncThunk('calendar/deleteEvent', async (eventId: string, { rejectWithValue }) => {
	try {
		await authApi.delete(`/events/${eventId}`);
		return eventId;
	} catch (error: any) {
		return rejectWithValue(error.response?.data?.message || error.message);
	}
});

const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(getRecomendedEventsId.pending,(state)=>{
				state.loading = true;
				state.error = null;
			})
			.addCase(getRecomendedEventsId.fulfilled,(state, action: PayloadAction<number[]|[]>)=>{
				state.loading=false
				state.recomendedEvents=action.payload
			})
			.addCase(getRecomendedEventsId.rejected,(state,action:PayloadAction<any>)=>{
				state.loading = false;
				state.error = action.payload; 
			})
			.addCase(fetchEvents.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
				state.loading = false;
				state.events = action.payload; 
			})
			.addCase(fetchEvents.rejected, (state, action: PayloadAction<any>) => {
				state.loading = false;
				state.error = action.payload; 
			})
			.addCase(addEvent.fulfilled, (state, action: PayloadAction<Event>) => {
				state.events.push(action.payload);
			})
			.addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
				const index = state.events.findIndex(event => event.id === action.payload.id);
				if (index !== -1) {
					state.events[index] = action.payload;
				}
			})
			.addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
				state.events = state.events.filter(event => event.id !== action.payload);
			})
			.addMatcher(
				(action) => action.type.endsWith('/rejected'),
				(state, action: PayloadAction<any>) => {
					state.loading = false;
					state.error = action.payload;
				}
			);
	}
});

export default calendarSlice.reducer;
