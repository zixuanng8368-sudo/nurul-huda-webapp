// src/components/EventCard.tsx
import React from 'react';

interface EventProps {
  image: string;
  title: string;
  date: string;
  description: string;
  organizer: string;
}

const EventCard: React.FC<EventProps> = ({ image, title, date, description, organizer }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-6">
      <div className="md:w-1/3 h-48 md:h-auto">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="md:w-2/3 p-6 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <span className="text-sm font-semibold text-blue-600 uppercase mt-1">{date}</span>
        <p className="text-gray-600 mt-3">{description}</p>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium italic">Anjuran: {organizer}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;