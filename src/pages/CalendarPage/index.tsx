import Calendar from '@/components/Calendar';
import { fetchEvents, getRecomendedEventsId } from '@/redux/slices/calendarSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ButtonPlace from './components/ButtonPlace';
import DaylyEventsDetails from './components/DaylyEventsDetails';

const CalendarPage: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
	const dispatch: AppDispatch = useDispatch();

	const {recomendedEvents ,events, error, loading } = useSelector((state: RootState) => state.calendar);
	const user = useSelector((state: RootState) => state.auth.user);

	useEffect(() => {
		dispatch(fetchEvents());
	}, [dispatch]);
	useEffect(()=>{
		if(user!==null && user.userId!==null){
			dispatch(getRecomendedEventsId(user.userId))
		}
	},[user,dispatch])
	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
	};

	const handleEventCreate = () => {
		console.log('Add event button clicked');
	};

	return (
		<div>
			<h1>Calendar Page</h1>
			{loading && <p>Loading events...</p>}
			{error && <p>Error: {error}</p>}
			{!loading && !error && events.length === 0 && <p>No events available.</p>}
			{!loading && !error && events.length > 0 && (
				<>
					<Calendar events={events} onDateSelect={handleDateSelect} selectedDate={selectedDate} recomendedEvents={recomendedEvents}/>
					{user?.role === 'ADMIN' && (
						<ButtonPlace onCreate={handleEventCreate} />
					)}
					<DaylyEventsDetails events={events} selectedDate={selectedDate} recomendedEvents={recomendedEvents}/>
				</>
			)}
		</div>
	);
};

export default CalendarPage;