import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import React from "react";
import "./CalendarGrid.scss";
import Event from "@/types/Event";

interface CalendarGridProps {
	date: Date;
	events: Event[];
	onDateClick: (date: Date) => void;
	selectedDate: Date | null;
	userEventsIds?: string[];
	recomendedEvents:number[]
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ userEventsIds, date, events, onDateClick, selectedDate,recomendedEvents }) => {

	const monthStart = startOfMonth(date);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
	const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

	const days = [];
	let day = startDate;

	while (day <= endDate) {
		days.push(day);
		day = addDays(day, 1);
	}
	const defaultSelectedDate = selectedDate || new Date();

	return (
		<div className="calendar-grid calendar-grid-responsive">
			{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
				<div key={day} className="calendar-day-header">{day}</div>
			))}
			{days.map((day, index) => {
				
				const isSelected = isSameDay(day, defaultSelectedDate);
				const isWeekend = day.getDay() === 0 || day.getDay() === 6;
				const isCurrentMonth = isSameMonth(day, monthStart);
				const hasEvents = events.some(event => isSameDay(event.date, day) && isCurrentMonth);
				const isUserEvent = userEventsIds?.some(eventId => events.some(event => event.id === eventId && isSameDay(event.date, day))) || false;
				const isRecomendedEvent =
				recomendedEvents?.length > 0 &&
				events.some(event =>
					recomendedEvents.includes(Number(event.id)) && isSameDay(event.date, day)
				)||false;
				return (
					<div
						key={index}
						className={`calendar-day ${isCurrentMonth ? "current-month" : "other-month"} ${isSameDay(day, new Date()) ? "today" : ""} ${isSelected ? "selected-day" : ""} ${isCurrentMonth && isWeekend ? "weekend" : ""} ${!isCurrentMonth && isWeekend ? "other-month-weekend" : ""} ${hasEvents ? "highlighted-day" : ""}
						 ${isUserEvent && (!isSelected) ?  "user-event" : ""}
						 ${isRecomendedEvent &&(!isUserEvent&&!isSelected)?"recomended-event":""}`}
						onClick={() => onDateClick(day)}
							
					>
						{format(day, "d")}
					</div>
				);
			})}
		</div>
	);
};

export default CalendarGrid;
