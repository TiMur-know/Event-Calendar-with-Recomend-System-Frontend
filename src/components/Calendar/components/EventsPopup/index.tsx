import React from "react";
import "./EventsPopup.scss";
import Event from "@/types/Event";

interface EventsPopupProps {
	events: Event[];
	onClose: () => void;
}

const EventsPopup: React.FC<EventsPopupProps> = ({ events, onClose }) => {
	return (
		<div className="events-popup-container" onClick={onClose}>
			<div className="events-popup">
				<div className="popup-content">
					<button className="close-btn" onClick={onClose}>X</button>
					<h3>Events</h3>
					<ul className="events-list">
						{events.map((event, index) => (
							<li className="event" key={index} title={event.description}>
								<a href="#">{event.title}</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default EventsPopup;
