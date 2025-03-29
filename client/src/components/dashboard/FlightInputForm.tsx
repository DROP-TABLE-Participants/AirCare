'use client';
import React, { useState } from 'react';

export default function FlightInputForm() {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [distance, setDistance] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform some action with the flight data (e.g., fetch predictions)
    alert(`Calculating flight stats from ${departure} to ${arrival}...`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="departure" className="block font-medium mb-1">
          Departure Airport
        </label>
        <input
          id="departure"
          type="text"
          className="border p-2 rounded w-full"
          placeholder="e.g. JFK"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="arrival" className="block font-medium mb-1">
          Arrival Airport
        </label>
        <input
          id="arrival"
          type="text"
          className="border p-2 rounded w-full"
          placeholder="e.g. LAX"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="distance" className="block font-medium mb-1">
          Distance (NM)
        </label>
        <input
          id="distance"
          type="number"
          className="border p-2 rounded w-full"
          placeholder="e.g. 2475"
          value={distance}
          onChange={(e) =>
            setDistance(e.target.value ? parseInt(e.target.value) : '')
          }
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Calculate
      </button>
    </form>
  );
}