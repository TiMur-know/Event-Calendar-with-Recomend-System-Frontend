import Event from '@/types/Event';
import React from 'react';
import styles from './styles.module.scss';

interface EventDescriptionProps {
	event: Event;
	role: string | undefined|null;
	eventsIds: string[] | undefined;
	isRecomended: boolean;
	onEdit: (id: string) => void;
	onRemove: (id: string) => void;
	onSub: (id: string) => void;
	onUnsub: (id: string) => void;
}

const EventDescription: React.FC<EventDescriptionProps> = ({ event, eventsIds, role, isRecomended, onEdit, onRemove, onSub, onUnsub }) => {
	const isUserSubscribed = eventsIds?.some((eventId) => eventId === event.id);

	return (
		<div data-testid="event-container" className={`${styles.container} ${isUserSubscribed ? styles.subscribed : ''}`}>
			<div>
				<h3 data-testid="event-title" className={styles.title}>{event.title}</h3>
				{isRecomended && !isUserSubscribed ? (
					<span data-testid="recommended-event" className={styles.recomendSpan}>Recommended event</span>
				) : <></>}
				
				<p data-testid="event-description" className={styles.description}>{event.description}</p>
				<p data-testid="event-type" className={styles.details}>Type: {event.type}</p>
				<p data-testid="event-popularity" className={styles.details}>Popularity: {event.popularity} ({event.popularityCount} people)</p>
				<p data-testid="event-location" className={styles.details}>Location: {event.location}</p>
				<p data-testid="event-duration" className={styles.details}>Duration: {event.duration} hours</p>
			</div>
			<div className={styles.buttonContainer}>
				{role === 'ADMIN' && (
					<>
						<button data-testid="edit-button" className={styles.button} onClick={() => onEdit(event.id)}>Edit</button>
						<button data-testid="remove-button" className={styles.button} onClick={() => onRemove(event.id)}>Remove</button>
					</>
				)}
				{role !== 'ADMIN' && (
					<>
						{!isUserSubscribed && (
							<button data-testid="subscribe-button" className={styles.button} onClick={() => onSub(event.id)}>Subscribe</button>
						)}
						{isUserSubscribed && (
							<button data-testid="unsubscribe-button" className={styles.button} onClick={() => onUnsub(event.id)}>Unsubscribe</button>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default EventDescription;
