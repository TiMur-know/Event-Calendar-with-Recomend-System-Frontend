import { combineReducers } from '@reduxjs/toolkit';
import calendarReducer from './slices/calendarSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';

const rootSlice = combineReducers({
	auth: authReducer,
	userDetails: userReducer,
	calendar: calendarReducer
});

export default rootSlice;
