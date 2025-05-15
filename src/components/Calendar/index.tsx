import React, { useEffect, useState } from "react";
import "./Calendar.scss";
import CalendarGrid from "./components/CalendarGrid";
import CalendarHeader from "./components/CalendarHeader";
import EventsPopup from "./components/EventsPopup";
import Event from "@/types/Event";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";



interface CalendarProps {
	events: Array<Event>;
	onDateSelect: (date: Date) => void;
	selectedDate: Date | null;
	recomendedEvents: number[]|[];
}

const Calendar: React.FC<CalendarProps> = ({ events, onDateSelect, selectedDate,recomendedEvents }) => {
	const user = useSelector((state: RootState) => state.auth.user);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
	const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
	const [showPopup, setShowPopup] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 576);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);


	const closePopup = () => {
		setShowPopup(false);
		setSelectedDayEvents([]);
	};

	const handleDateClick = (date: Date) => {
		onDateSelect(date);
	};

	const parsedEvents = events.map(event => ({
		...event,
		date: new Date(event.date)
	}));

	return (
		<div className="calendar">
			<CalendarHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />
			<hr />
			<CalendarGrid userEventsIds={user?.eventIds} date={currentDate} events={parsedEvents} onDateClick={handleDateClick} selectedDate={selectedDate} recomendedEvents={recomendedEvents}/>
			{showPopup && (
				<EventsPopup events={selectedDayEvents} onClose={closePopup} />
			)}
		</div>
	);
};

export default Calendar;
