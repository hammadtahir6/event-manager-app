import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Individual, BookingStatus } from '../types';
import { TIME_SLOTS } from '../constants';
import { Clock } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  individuals: Individual[];
  onEventClick: (individual: Individual) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ individuals, onEventClick }) => {
  // Map booking statuses to specific hex colors for the calendar
  const getEventColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Inquiry: return '#3b82f6'; // blue-500
      case BookingStatus.TourScheduled: return '#9333ea'; // purple-600
      case BookingStatus.ContractSent: return '#ca8a04'; // yellow-600
      case BookingStatus.Confirmed: return '#16a34a'; // green-600
      case BookingStatus.Completed: return '#4b5563'; // gray-600
      case BookingStatus.Cancelled: return '#dc2626'; // red-600
      default: return '#db2777'; // wedding-600
    }
  };

  const events = individuals.map(ind => {
    // Parse date and time
    const dateStr = ind.weddingDate;
    
    // Determine start time based on time slot or fallback
    let timeStr = '12:00';
    if (ind.eventTime) {
       const slot = TIME_SLOTS.find(s => s.id === ind.eventTime);
       if (slot) {
         timeStr = slot.startTime;
       } else if (ind.eventTime.includes(':')) {
         // Handle legacy formatted times like "14:00"
         timeStr = ind.eventTime;
       }
    }

    const start = new Date(`${dateStr}T${timeStr}`);
    
    // Default duration: 5 hours if no end time logic (simplified)
    const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);

    return {
      title: ind.eventName || `${ind.name}'s Event`,
      start,
      end,
      resource: ind,
    };
  });

  const eventStyleGetter = (event: any) => {
    const backgroundColor = getEventColor(event.resource.status);
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '0.85rem'
      }
    };
  };

  // Logic to highlight business hours (Availability Slots)
  const slotPropGetter = (date: Date) => {
    const hour = date.getHours();
    
    // Business Availability Logic based on TIME_SLOTS + extended evening
    // Morning: 7-11
    // Day: 12-17
    // Evening: 18-23 + 00-02 (Next day handled by wrapping)
    
    const isBusinessHour = 
      (hour >= 7 && hour < 11) || // Morning Slot
      (hour >= 12 && hour < 17) || // Day Slot
      (hour >= 18 && hour <= 23) || // Evening Slot Part 1
      (hour >= 0 && hour < 2);      // Evening Slot Part 2

    if (isBusinessHour) {
      return {
        className: 'bg-wedding-50 border-t border-dashed border-wedding-200',
        style: {
          backgroundColor: '#fdf2f8', // wedding-50
        }
      };
    }
    
    // Closed / Off-hours
    return {
      style: {
        backgroundColor: '#f3f4f6', // gray-100
      }
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col h-[calc(100vh-14rem)] min-h-[600px]">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-600 border-b border-gray-50 pb-2">
         <div className="flex items-center">
            <div className="w-3 h-3 bg-wedding-50 border border-wedding-200 mr-1"></div>
            <span>Available Slot</span>
         </div>
         <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 mr-1"></div>
            <span>Closed</span>
         </div>
         <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-sm mr-1"></div>
            <span>Confirmed</span>
         </div>
         <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
            <span>Inquiry</span>
         </div>
      </div>

      <div className="flex-1">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          slotPropGetter={slotPropGetter}
          onSelectEvent={(event) => onEventClick(event.resource)}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="week"
          min={new Date(0, 0, 0, 6, 0, 0)} // Start view at 6 AM
          max={new Date(0, 0, 0, 23, 59, 59)} // End view at midnight
          step={60}
          timeslots={1}
          popup
          tooltipAccessor={(event) => `${event.title} (${event.resource.status})`}
          components={{
            timeSlotWrapper: (props: any) => {
               // Optional customization if needed, currently handled by slotPropGetter
               return props.children;
            }
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;