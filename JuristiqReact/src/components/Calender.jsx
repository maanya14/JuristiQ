import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./calender.css"; // Custom styles for red marking

function HearingCalendar() {
  const [hearingDates, setHearingDates] = useState([]);

  useEffect(() => {
    const fetchHearingDates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/hearings", { withCredentials: true });

        // Convert to Date objects
        const formattedDates = response.data.map(date => new Date(date));
        setHearingDates(formattedDates);
      } catch (error) {
        console.error("Error fetching hearing dates:", error);
      }
    };

    fetchHearingDates();
  }, []);

  return (
    <div className="calendar-container">
      <Calendar
        tileClassName={({ date }) =>
          hearingDates.some((d) => d.toDateString() === date.toDateString()) ? "highlight" : null
        }
      />
    </div>
  );
}

export default HearingCalendar;


