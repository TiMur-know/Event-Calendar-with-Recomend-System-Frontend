import { addMonths, format, subMonths } from "date-fns";
import React from "react";
import "./CalendarHeader.scss";

interface CalendarHeaderProps {
	currentDate: Date;
	setCurrentDate: (date: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, setCurrentDate }) => {
	return (
		<div className="calendar-header d-flex justify-content-between p-3">
			<button className="btn btn-primary" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&lt;</button>
			<h2>{format(currentDate, "MMMM yyyy")}</h2>
			<button className="btn btn-primary" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>&gt;</button>
		</div>
	);
};

export default CalendarHeader;
