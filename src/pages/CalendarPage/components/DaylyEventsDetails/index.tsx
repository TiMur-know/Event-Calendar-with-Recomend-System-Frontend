import Event from '@/types/Event';
import React, { useState } from 'react';
import EventDescription from './components/EventDescription';

import { subscribeToEvent, unsubscribeFromEvent } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store'; 
import { useDispatch, useSelector } from 'react-redux';
import ModalToLogin from './components/ModalToLogin';

interface DaylyEventsDetailsProps {
	events: Event[];
	selectedDate: Date | null;
	recomendedEvents: number[]|[]
}

const DaylyEventsDetails: React.FC<DaylyEventsDetailsProps> = ({ events, selectedDate, recomendedEvents }) => {
	const dispatch: AppDispatch = useDispatch(); 
	const [isModalShow, setIsModal] = useState(false);
	const user = useSelector((state: RootState) => state.auth.user);
	const { events: allEvents, error, loading } = useSelector((state: RootState) => state.calendar);
	if (!selectedDate) return null;

	if (loading) return <p>Loading events...</p>;
	if (error) return <p>Error: {error}</p>;

	const filteredEvents = allEvents.filter(event => {
		const eventDate = new Date(event.date);
		return eventDate.toDateString() === selectedDate.toDateString();
	});
	const onClose = () => {
		setIsModal(false);
	}
	const handleEventEdit = (id: string) => {

		const userId = 1;
		// Add logic to edit the event
	};

	const handleEventRemove = (id: string) => {
		const userId = 1;
		// Add logic to remove the event
	};

	const handleSubscribe = (id: string) => {
		if (!user) {
			setIsModal(true);
			return;
		}
		dispatch(subscribeToEvent({ eventId: id })); 
	};

	const removeSubscribe = (id: string) => {
		if (!user) {
			setIsModal(true);
			return
		}
		dispatch(unsubscribeFromEvent({ eventId: id })); 
	};
	const isRecomended = (eventId: string): boolean => {
		return recomendedEvents.some(id => id.toString() === eventId.toString());
	};
	return (
		<div>
			<h2>Events on {selectedDate.toDateString()}</h2>
			{filteredEvents.length > 0 ? (
				filteredEvents.map(event => (
					<EventDescription
						key={event.id}
						role={user?.role}
						event={event}
						isRecomended={isRecomended(event.id)}
						eventsIds={user?.eventIds}
						onEdit={handleEventEdit}
						onRemove={handleEventRemove}
						onSub={handleSubscribe}
						onUnsub={removeSubscribe}
					/>
				))
			) : (
				<p>No events for this day.</p>
			)}
			{isModalShow && (<ModalToLogin onClose={onClose} />)}
		</div>
	);
};

export default DaylyEventsDetails;