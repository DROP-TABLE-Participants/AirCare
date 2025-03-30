"use client";
import React, { useState } from "react";

export interface Flight {
  id: string;
  name: string;
  coords: [number, number];
}

interface FlightSelectorProps {
  flights: Flight[];
  onSelect: (departureId: string | null, arrivalId: string | null) => void;
}

export default function FlightSelector({ flights, onSelect }: FlightSelectorProps) {
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isArrivalOpen, setIsArrivalOpen] = useState(false);
  const [departureId, setDepartureId] = useState<string | null>(null);
  const [arrivalId, setArrivalId] = useState<string | null>(null);

  const getDeparture = () => flights.find(f => f.id === departureId);
  const getArrival = () => flights.find(f => f.id === arrivalId);

  const toggleDepartureDropdown = () => {
    setIsDepartureOpen((prev) => !prev);
    setIsArrivalOpen(false); 
  };

  const toggleArrivalDropdown = () => {
    setIsArrivalOpen((prev) => !prev);
    setIsDepartureOpen(false); 
  };

  const handleDepartureSelect = (selectedId: string) => {
    setDepartureId(selectedId);
    setIsDepartureOpen(false);

    if (selectedId === arrivalId) {
      setArrivalId(null);
    }

    onSelect(selectedId, arrivalId);
  };

  const handleArrivalSelect = (selectedId: string) => {
    setArrivalId(selectedId);
    setIsArrivalOpen(false);
    onSelect(departureId, selectedId);
  };

  const departureCity = getDeparture()?.name || "Select Departure";
  const arrivalCity = getArrival()?.name || "Select Destination";

  return (
    <div className="inline-flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      {}
      <div className="relative w-full sm:w-auto">
        <button
          onClick={toggleDepartureDropdown}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-2 py-1 sm:px-3 sm:py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none text-xs sm:text-sm"
        >
          <span className="mr-1">From:</span> 
          <span className={`${departureId ? 'font-medium truncate max-w-[100px]' : 'text-white'}`}>
            {departureCity}
          </span>
        </button>

        {isDepartureOpen && (
          <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-60 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-2 px-3 bg-gray-800 text-gray-300 text-sm font-medium rounded-t-md">
              Select Departure City
            </div>
            <div className="py-1 text-gray-200 max-h-60 overflow-y-auto">
              {flights.map((flight) => (
                <button
                  key={flight.id}
                  onClick={() => handleDepartureSelect(flight.id)}
                  className={`block w-full px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-700 ${
                    flight.id === departureId ? 'bg-gray-700 text-white' : ''
                  }`}
                >
                  {flight.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {}
      <div className="hidden sm:flex items-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

      {}
      <div className="flex sm:hidden items-center justify-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {}
      <div className="relative w-full sm:w-auto">
        <button
          onClick={toggleArrivalDropdown}
          className={`w-full sm:w-auto inline-flex items-center justify-center rounded-md px-2 py-1 sm:px-3 sm:py-2 bg-gray-800 text-white hover:bg-gray-700 focus:outline-none text-xs sm:text-sm ${!departureId ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={!departureId} 
        >
          <span className="mr-1">To:</span>
          <span className={`${arrivalId ? 'font-medium truncate max-w-[100px]' : 'text-white'}`}>
            {arrivalCity}
          </span>
        </button>

        {isArrivalOpen && (
          <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-60 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-2 px-3 bg-gray-800 text-gray-300 text-sm font-medium rounded-t-md">
              Select Destination City
            </div>
            <div className="py-1 text-gray-200 max-h-60 overflow-y-auto">
              {flights
                .filter(flight => flight.id !== departureId) 
                .map((flight) => (
                  <button
                    key={flight.id}
                    onClick={() => handleArrivalSelect(flight.id)}
                    className={`block w-full px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-700 ${
                      flight.id === arrivalId ? 'bg-gray-700 text-white' : ''
                    }`}
                  >
                    {flight.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}